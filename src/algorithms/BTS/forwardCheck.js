import { checkAndRecordFuture, intersect } from '../utils';

/**
 * Filters the constraints, finding those that contain any two current or future variables.
 * @param {Map<number, Set<Array<Array<boolean>>>} constraints variables mapped to the constraints that contain them
 * @param {Array<number>} assignmentOrder variable assignment order
 * @returns {Map<number, Array<Array<Array<boolean>>>} variables mapped to the constraints relevant to their forward
 * check
 */
const constraintFilter = (constraints, assignmentOrder) => {
  const filteredMap = new Map();
  assignmentOrder.forEach((current, index) => {
    const future = assignmentOrder.slice(index + 1);
    const filtered = [...constraints.get(current)].filter(constraint =>
      future.some(variable => constraints.get(variable).has(constraint)));
    filteredMap.set(current, filtered);
  });
  return filteredMap;
};

/**
 * Reduces the domains based on the newDomains, adding necessary elements to the queue, and storing reductions in
 * reduced.
 * @param {Map<number, Set<boolean>} reduced map of reduced domains
 * @param {Map<number, Set<boolean>} newDomains current valid variable domains
 * @param {Map<number, Set<boolean>} domains old valid variable domains
 * @param {Array<number>} queue list of unvisited reduced variables
 * @returns {boolean} true if reductions are consistent, false if a domain was destroyed
 */
const reduce = (reduced, newDomains, domains, queue) => {
  // reduce the domains
  let consistent = true;
  newDomains.forEach((values, key) => {
    domains.set(key, new Set([...domains.get(key)].filter(x => {
      if (values.has(x)) {
        return true;
      }
      reduced.get(key).add(x);
      if (!queue.includes(key)) {
        queue.push(key);
      }
      return false;
    })));
    newDomains.set(key, new Set([...domains.get(key)]));
    // check for destroyed domains
    if (domains.get(key).size === 0) {
      consistent = false;
    }
  });
  return consistent;
};

/**
 * Enforces GAC on all future variables based on the current variable assignment.
 * @param {Array{key: number, value: boolean}} stack current variable assignments
 * @param {Map<number, Array<Array<Array<boolean>>>} constraintMap future variables mapped to the constraints relevant
 * to their forward checks
 * @param {Map<number, Set<boolean>>} domains current variable domains
 * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
 * @returns {boolean} true if consistent, false otherwise
 */
const forwardCheck = (stack, constraintMap, domains, reductions) => {
  const current = stack.slice(-1)[0].key;
  const future = [...constraintMap.keys()].slice(stack.length);
  const newDomains = new Map();
  future.forEach(key => newDomains.set(key, new Set([...domains.get(key)])));
  const mapStack = new Map();
  stack.forEach(variable => mapStack.set(variable.key, new Set([variable.value])));

  // check that the current assignment is consistent with all constraints
  let consistent = constraintMap.get(current).every(constraint => {
    const subFutureDomains = checkAndRecordFuture(mapStack, constraint, future, true);
    // update newDomains from subFutureDomains if the assignment is supported
    if (subFutureDomains) {
      subFutureDomains.forEach((values, key) => newDomains.set(key, intersect(newDomains.get(key), values)));
      return true;
    }
    return false;
  });

  // reduce the domains of the future variables
  if (consistent) {
    const reduced = new Map();
    future.forEach(key => reduced.set(key, new Set()));
    const queue = [];
    consistent = reduce(reduced, newDomains, domains, queue);

    while (consistent && queue.length > 0) {
      const next = queue.shift();
      consistent = constraintMap.get(next).every(constraint => {
        const subFutureDomains = checkAndRecordFuture(newDomains, constraint, future);
        // update newDomains from subFutureDomains if the assignment is supported
        if (subFutureDomains) {
          subFutureDomains.forEach((values, key) => newDomains.set(key, intersect(newDomains.get(key), values)));
          return true;
        }
        return false;
      });
      // reduce the domains of the future variables
      if (consistent) {
        consistent = reduce(reduced, newDomains, domains, queue);
      }
    }

    if (consistent) {
      reduced.forEach((values, key) => reductions.get(key).push(values));
      return true;
    }
    reduced.forEach((values, key) => values.forEach(value => domains.get(key).add(value)));
    return false;
  }
  return false;
};

/**
 * Attempts to assign the current variable a consistent value.
 * @param {Array<{key: number, value: boolean}>} stack past variable assignments
 * @param {number} key variable to be assigned
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap future variables mapped to the constraints relevant
 * to their forward checks
 * @param {Map<number, Set<boolean>>} domains current variable domains
 * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
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
    if (forwardCheck(stack, constraintMap, domains, reductions)) {
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
 * @param {Map<number, Set<boolean>} domains current variable domains and reductions
 * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
 * @return {boolean} true if consistent, false if more unlabeling needed
 */
const unlabel = (stack, assignmentOrder, domains, reductions) => {
  const variable = stack.pop();
  if (variable) {
    const future = assignmentOrder.slice(assignmentOrder.indexOf(variable.key) + 1);
    future.forEach(key => {
      const restore = [...reductions.get(key).pop()];
      restore.forEach(value => domains.get(key).add(value));
    });
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
      consistent = unlabel(stack, assignmentOrder, domains, reductions);
      currentLevel--;
      diagnostics.backtracks++;
    }
  }
  return stack.length === assignmentOrder.length;
};

/**
 * Finds all solutions to the given csp and reduces them to the backbone.
 * @param {Map<number, Set<boolean>} domains variables mapped to their allowed values
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraints variables mapped to their constraints
 * @param {Array<number>} assignmentOrder order of variable assignments
 * @param {{*}} diagnostics search metrics object
 * @returns {Array[{key: number, value: boolean}]} list of solvable variables
 */
export default (domains, constraints, assignmentOrder, diagnostics) => {
  const currentDomains = new Map();
  const reductions = new Map();
  assignmentOrder.forEach(key => {
    currentDomains.set(key, new Set([...domains.get(key)]));
    reductions.set(key, []);
  });
  // pad the first variable's reductions so attempting to restore doesn't cause an error
  if (assignmentOrder.length > 0) {
    reductions.get(assignmentOrder[0]).push(new Set());
  }
  let fullySearched = false;
  const stack = [];
  const solutions = [];

  // filter the constraints
  const filterTime = performance.now();
  const constraintMap = constraintFilter(constraints, assignmentOrder);
  diagnostics.timeFiltering += performance.now() - filterTime;

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
          assignmentOrder.slice(assignmentOrder.indexOf(top.key) + 1).forEach(key =>
            [...reductions.get(key).pop()].forEach(d => currentDomains.get(key).add(d)));
        }
      }

      // remove the domain so the same solution isn't found again
      if (next) {
        assignmentOrder.slice(assignmentOrder.indexOf(next.key) + 1).forEach(key =>
          [...reductions.get(key).pop()].forEach(d => currentDomains.get(key).add(d)));
        reductions.get(next.key).slice(-1)[0].add(next.value);
        currentDomains.get(next.key).delete(next.value);
      } else {
        fullySearched = true;
      }
    } else {
      fullySearched = true;
    }
  }

  // reduce the solutions to the backbone
  const backbone = [];
  [...currentDomains.keys()].forEach((key, index) => {
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
