import { constraintFilter } from './forwardCheck';
import { revise } from '../STR';

/**
 * Reduces the domains based on the newDomains, adding necessary elements to the queue, and storing reductions in
 * reduced
 * @param {Map<number, Set<boolean>>} reduced map of reduced domains
 * @param {Map<number, Set<boolean>>} newDomains current valid variable domains
 * @param {Map<number, Set<boolean>>} domains old valid variable domains
 * @param {Array<{}>} queue list of unvisited constraints
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap variables mapped to the constraints relevant to
 * their forward check
 * @param {Array<Array<boolean>>} constraint current constraint being reduced
 * @returns {boolean} true if reductions are consistent, false if a domain was destroyed
 */
const reduce = (reduced, newDomains, domains, queue, constraintMap, constraint) => {
  // reduce the domains
  let consistent = true;
  newDomains.forEach((values, key) => {
    if (domains.get(key).size !== values.size) {
      domains.set(key, new Set([...domains.get(key)].filter(x => {
        if (values.has(x)) {
          return true;
        }
        reduced.get(key).add(x);
        return false;
      })));
      constraintMap.get(key).forEach(element => {
        if (element !== constraint && !queue.includes(element)) {
          queue.push(element);
        }
      });
      // check for destroyed domains
      if (domains.get(key).size === 0) {
        consistent = false;
      }
    }
  });
  return consistent;
};

/**
 * Restores the reductions of the given key.
 * @param {number} restoreKey variable key to restore reductions from
 * @param {Array<number>} assignmentOrder order of variable assignments
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap variables mapped to the constraints relevant to
 * their forward check
 * @param {Map<*, Array<Set<*>>>} reductions variables and constraints mapped to their domain and tuple reductions
 * respectively
 * @param {Map<number, Set<boolean>>} domains variables mapped to their valid domain
 */
const restore = (restoreKey, assignmentOrder, constraintMap, reductions, domains) => {
  const futureConstraints = new Set();
  assignmentOrder.slice(assignmentOrder.indexOf(restoreKey) + 1).forEach(key => {
    [...reductions.get(key).pop()].forEach(d => domains.get(key).add(d));
    constraintMap.get(key).forEach(constraint => futureConstraints.add(constraint));
  });
  constraintMap.get(restoreKey).forEach(constraint => futureConstraints.add(constraint));

  futureConstraints.forEach(constraint => {
    [...reductions.get(constraint).pop()].forEach(value => {
      constraint[value].alive = true;
      constraint.alive++;
    });
  });
};

/**
 * Maintains GAC on all future variables and constraints using STR based on the current variable assignment.
 * @param {Array<{key: number, value: boolean}>} stack current variable assignments
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap future variables mapped to the constraints relevant
 * to their forward checks
 * @param {Map<number, Set<boolean>>} domains current variable domains
 * @param {Map<*, Array<Set<*>>>} reductions variables and constraints mapped to their domain and tuple reductions
 * respectively
 * @returns {boolean} true if consistent, false otherwise
 */
const forwardCheckSTR = (stack, constraintMap, domains, reductions) => {
  const current = stack.slice(-1)[0];
  const future = [...constraintMap.keys()].slice(stack.length);
  const reduced = new Map();
  const futureConstraints = new Set();
  future.forEach(key => {
    reduced.set(key, new Set());
    constraintMap.get(key).forEach(constraint => futureConstraints.add(constraint));
  });
  reduced.set(current.key, new Set());
  domains.set(current.key, new Set([...domains.get(current.key)].filter(x => {
    if (x === current.value) {
      return true;
    }
    reduced.get(current.key).add(x);
    return false;
  })));


  const queue = [];
  constraintMap.get(current.key).forEach(constraint => {
    queue.push(constraint);
    futureConstraints.add(constraint);
  });
  futureConstraints.forEach(constraint => reduced.set(constraint, new Set()));
  let consistent = true;

  while (queue.length > 0 && consistent) {
    // revise the next constraint in the queue
    const constraint = queue.shift();
    const newDomains = revise(constraint, domains, reduced);
    [...newDomains.keys()].forEach(key => {
      if (!future.includes(key)) {
        newDomains.delete(key);
      }
    });

    // update the future domains and add any affected constraints back to the queue
    consistent = reduce(reduced, newDomains, domains, queue, constraintMap, constraint);
  }

  if (consistent) {
    reduced.get(current.key).forEach(value => domains.get(current.key).add(value));
    reduced.delete(current.key);
    reduced.forEach((values, key) => reductions.get(key).push(values));
  } else {
    reduced.forEach((values, key) => {
      if (typeof key === 'number') {
        values.forEach(value => domains.get(key).add(value));
      } else {
        values.forEach(value => {
          key[value].alive = true;
          key.alive++;
        });
      }
    });
  }

  return consistent;
};

/**
 * Attempts to assign the current variable a consistent value.
 * @param {Array<{key: number, value: boolean}>} stack past variable assignments
 * @param {number} key variable to be assigned
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap future variables mapped to the constraints relevant
 * to their forward checks
 * @param {Map<number, Set<boolean>>} domains current variable domains
 * @param {Map<number, Array<Set<boolean>>>} reductions variables and constraints mapped to their domain and tuple
 * reductions respectively
 * @param {{timeChecking: number}} diagnostics execution metrics object
 * @returns {boolean} true if labeling was successful, false if unlabeling needed
 */
const label = (stack, key, constraintMap, domains, reductions, diagnostics) => {
  let consistent = false;
  while (domains.get(key).size > 0 && !consistent) {
    stack.push({
      key,
      value: [...domains.get(key)][0],
    });
    const startTime = performance.now();
    if (forwardCheckSTR(stack, constraintMap, domains, reductions)) {
      consistent = true;
    } else {
      const value = stack.pop().value;
      domains.get(key).delete(value);
      reductions.get(key).slice(-1)[0].add(value);
    }
    diagnostics.timeChecking += performance.now() - startTime;
  }
  return consistent;
};

/**
 * Restores the domain of the current variable and removes the previous variable assignment from the stack.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {Array<number>} assignmentOrder order of variable assignments
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap variables mapped to the constraints relevant to
 * their forward check
 * @param {Map<number, Set<boolean>} domains current variable domains and reductions
 * @param {Map<*, Array<Set<*>>>} reductions variables and constraints mapped to their domain and tuple reductions
 * respectively
 * @return {boolean} true if consistent, false if more unlabeling needed
 */
const unlabel = (stack, assignmentOrder, constraintMap, domains, reductions) => {
  const variable = stack.pop();
  if (variable) {
    restore(variable.key, assignmentOrder, constraintMap, reductions, domains);
    domains.get(variable.key).delete(variable.value);
    reductions.get(variable.key).slice(-1)[0].add(variable.value);
    if (domains.get(variable.key).size > 0) {
      return true;
    }
  }
  return false;
};

/**
 * Searches the subspace until a solution is found or the entire subspace is traversed.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {Map<number, Set<boolean>} domains variables mapped to the allowed values of the subspace
 * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap variables mapped to the constraints relevant to
 * their forward check
 * @param {Array<number>} assignmentOrder order of variable assignments
 * @param {{nodesVisited: number, backtracks: number, timeChecking: number}} diagnostics search metrics object
 * @returns {boolean} true if solution was found, false if no solution exists
 */
const search = (stack, domains, reductions, constraintMap, assignmentOrder, diagnostics) => {
  let consistent = true;
  let currentLevel = stack.length;

  while (currentLevel >= 0 && currentLevel < assignmentOrder.length) {
    const currentVariable = assignmentOrder[currentLevel];
    if (consistent) {
      consistent = label(stack, currentVariable, constraintMap, domains, reductions, diagnostics);
      diagnostics.nodesVisited++;
      if (consistent) {
        currentLevel++;
      }
    } else {
      consistent = unlabel(stack, assignmentOrder, constraintMap, domains, reductions);
      currentLevel--;
      diagnostics.backtracks++;
    }
  }
  return stack.length === assignmentOrder.length;
};

/**
 * Finds all solutions to the given csp and reduces them to the backbone.
 * @param {Map<number, Set<boolean>>} domains variables mapped to their allowed values
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraints variables mapped to their constraints
 * @param {Array<number>} assignmentOrder order of variable assignments
 * @param {{*}} diagnostics search metrics object
 * @returns {Array<{key: number, value: boolean}>} list of solvable variables
 */
export default (domains, constraints, assignmentOrder, diagnostics) => {
  // filter the constraints
  const filterTime = performance.now();
  const constraintMap = constraintFilter(constraints, assignmentOrder);
  diagnostics.timeFiltering += performance.now() - filterTime;

  const currentDomains = new Map();
  const reductions = new Map();
  assignmentOrder.forEach(key => {
    currentDomains.set(key, new Set([...domains.get(key)]));
    reductions.set(key, []);
    constraintMap.get(key).forEach(constraint => reductions.set(constraint, [new Set()]));
  });
  // pad the first variable's reductions to avoid index out of bounds issues
  if (assignmentOrder.length > 0) {
    reductions.get(assignmentOrder[0]).push(new Set());
  }
  let fullySearched = false;
  const stack = [];
  const solutions = [];

  while (!fullySearched) {
    if (search(stack, currentDomains, reductions, constraintMap, assignmentOrder, diagnostics)) {
      // save the solution
      solutions.push(stack.slice());

      // find the next variable that could be solved in a different way
      let next;
      while (!next && stack.length > 0) {
        const top = stack.pop();
        if (currentDomains.get(top.key).size > 1) {
          next = top;
        } else {  // restore the reductions to clean up for the next search
          restore(top.key, assignmentOrder, constraintMap, reductions, currentDomains);
        }
      }

      // remove the domain so the same solution isn't found again
      if (next) {
        restore(next.key, assignmentOrder, constraintMap, reductions, currentDomains);
        reductions.get(next.key).slice(-1)[0].add(next.value);
        currentDomains.get(next.key).delete(next.value);
      } else {
        fullySearched = true;
      }
    } else {
      fullySearched = true;
    }
  }

  // return the constraints to their previous state
  reductions.forEach((values, key) => {
    if (typeof key !== 'number') {
      values.forEach(value => {
        key[value.alive] = true;
        key.alive++;
      });
    }
  });

  // reduce the solutions to the backbone
  const backbone = [];
  assignmentOrder.forEach((key, index) => {
    const solutionValues = new Set();
    solutions.forEach(solution => solutionValues.add(solution[index].value));
    if (solutionValues.size === 1) {
      backbone.push({
        key,
        value: [...solutionValues][0],
      });
    }
  });
  return backbone;
};
