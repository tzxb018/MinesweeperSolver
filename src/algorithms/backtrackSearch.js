import { check } from './utils';

/**
 * Groups all the constraints by the variables they contain.
 * @param {Array<Array<Array<number>>>} constraints csp model of the minefield
 * @returns {Map<number, Set<Array<Array<boolean>>>} variables mapped to the constraints that contain them
 */
const mapVariablesToConstraints = constraints => {
  const map = new Map();

  constraints.forEach(constraint => {
    constraint[0].forEach(variable => {
      if (!map.has(variable)) {
        map.set(variable, new Set());
      }
      map.get(variable).add(constraint);
    });
  });

  return map;
};

/**
 * Filters the constraints, finding those that contain the current and at least one past variable.
 * @param {Map<number, Set<Array<Array<boolean>>>} constraintMap variables mapped to the constraints that contain them
 * @param {number} current current variable
 * @param {Array<number>} past past variables
 * @returns {Array<Array<Array<boolean>>>} list of constraints relevant to the backcheck
 */
const filterConstraints = (constraintMap, current, past) => {
  const constraints = Array.from(constraintMap.get(current));
  const filtered = constraints.filter(constraint => past.some(variable => constraintMap.get(variable).has(constraint)));
  if (filtered.length === 0) {
    return constraints;
  }
  return filtered;
};

/**
 * Checks if the current variable assignments are supported by all constraints.
 * @param {Array<{key: number, value: boolean}>} stack current variable assignments
 * @param {Map<number, Set<Array<Array<boolean>>>} constraintMap variables mapped to the constraints that contain them
 * @returns {boolean} true if consistent, false otherwise
 */
const backcheck = (stack, constraintMap) => {
  const past = stack.map(x => x.key);
  const current = past.pop();
  const constraints = filterConstraints(constraintMap, current, past);
  return constraints.every(constraint =>
    check(stack.filter(variable => constraint[0].includes(variable.key)), constraint));
};

/**
 * Attempts to assign the current variable a consistent value.
 * @param {Array<{key: number, value: boolean}>} stack past variable assignments
 * @param {number} currentLevel current level to label
 * @param {number} key variable to be assigned
 * @param {Map<number, Set<Array<Array<boolean>>>>} constraintMap variables mapped to the constraints that contian them
 * @param {Set<boolean>} domain current variable domain
 * @returns {number} next level to try labeling
 */
const label = (stack, currentLevel, key, constraintMap, domain) => {
  let consistent = false;
  while (!consistent && domain.size > 0) {
    stack.push({
      key,
      value: [...domain][0],
    });
    if (backcheck(stack, constraintMap)) {
      consistent = true;
    } else {
      domain.delete(stack.pop().value);
    }
  }
  return consistent ? currentLevel + 1 : currentLevel;
};

/**
 * Restores the domain of the current variable and removes the previous variable assignment from the stack.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {number} currentLevel current level to unlabel
 * @param {number} key variable to be restored
 * @param {Map<number, Set<boolean>} domains current variable domains
 * @param {Map<number, Set<boolean>} globalDomains starting variable domains
 * @returns {number} next level to label or unlabel
 */
const unlabel = (stack, currentLevel, key, domains, globalDomains) => {
  domains.set(key, new Set([...globalDomains.get(key)]));
  const variable = stack.pop();
  if (variable) {
    domains.get(variable.key).delete(variable.value);
  }
  return currentLevel - 1;
};

/**
 * Searches the subspace until a solution is found or the entire subspace is traversed.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {number} startingLevel level to begin the search from
 * @param {Map<number, Set<boolean>} currentDomains variables mapped to the allowed values of the subspace
 * @param {Map<number, Set<boolean>} globalDomains variables mapped to the backup values of the subspace
 * @param {Map<number, Set<Array<Array<boolean>>>>} constraintMap variables mapped to the constraints that contain them
 * @param {Array<number>} assignmentOrder order of variable assignments
 * @returns {boolean} true if a solution was found, false if the search space was exhausted
 */
const search = (stack, startingLevel, currentDomains, globalDomains, constraintMap, assignmentOrder) => {
  let consistent = true;
  let currentLevel = stack.length;

  // search the tree
  while (currentLevel >= startingLevel && currentLevel < assignmentOrder.length) {
    const currentVariable = assignmentOrder[currentLevel];
    if (consistent) {
      const oldLevel = currentLevel;
      currentLevel = label(stack, currentLevel, currentVariable, constraintMap, currentDomains.get(currentVariable));
      if (currentLevel === oldLevel) {
        consistent = false;
      }
    } else {
      currentLevel = unlabel(stack, currentLevel, currentVariable, currentDomains, globalDomains);
      if (currentLevel >= 0 && currentDomains.get(assignmentOrder[currentLevel]).size > 0) {
        consistent = true;
      }
    }
  }
  return stack.length === assignmentOrder.length;
};

/**
 * Performs a backtracking search on the csp until a viable solution is found or the entire search tree is traversed,
 * indicating that the problem is impossible.
 * @param {Immutable.Map} csp constraint model of the minefield
 * @returns {Immutable.Map} updated constraint model
 */
export default csp => csp.withMutations(c => {
  c.deleteIn(['solvable', 'BTS']);
  // create a separate copy of the domains
  const globalDomains = new Map();
  c.get('domains').forEach((values, key) => globalDomains.set(key, new Set([...values])));
  // solve each component individually
  c.get('components').forEach(component => {
    // map the variables to the constraints that contain them
    const constraintMap = mapVariablesToConstraints(component.constraints);
    // set the variable assignment order
    const assignmentOrder = [...constraintMap.keys()];
    assignmentOrder.sort((a, b) => a - b);

    let fullySearched = false;
    const solutions = [];
    const swiped = [];
    while (!fullySearched) {
      // set up the stack for the search
      const currentDomains = new Map();
      globalDomains.forEach((values, key) => currentDomains.set(key, new Set([...values])));
      const stack = [];
      assignmentOrder.every(key => {
        if (currentDomains.get(key).size === 1) {
          stack.push({
            key,
            value: [...currentDomains.get(key)][0],
          });
          return true;
        }
        return false;
      });
      const startingLevel = stack.length;
      if (stack.length === 0 && assignmentOrder.length > 0) {
        stack.push({
          key: assignmentOrder[0],
          value: [...currentDomains.get(assignmentOrder[0])][0],
        });
      }

      // search the tree
      const success = search(stack, startingLevel, currentDomains, globalDomains, constraintMap, assignmentOrder);

      // if a solution was found, add it to the list and advance the starting position
      if (success) {
        solutions.push(stack);
        // find the next variable with a domain > 1
        let nextSwipe;
        assignmentOrder.slice(startingLevel).every(key => {
          if (currentDomains.get(key).size === 1) {
            globalDomains.set(key, new Set([...currentDomains.get(key)]));
            return true;
          }
          nextSwipe = key;
          return false;
        });
        // if this was the last possible solution, try to unswipe or the tree is fully searched
        if (nextSwipe === undefined) {
          if (swiped.length === 0) {
            fullySearched = true;
          } else {
            const unswipe = swiped.pop();
            globalDomains.set(unswipe.key, new Set([unswipe.value]));
            assignmentOrder.slice(assignmentOrder.indexOf(unswipe.key) + 1).forEach(key =>
              globalDomains.set(key, new Set([...c.get('domains').get(key)])));
          }
        // else, swipe the next available variable
        } else {
          const swipe = stack.find(x => x.key === nextSwipe);
          swiped.push(swipe);
          globalDomains.get(nextSwipe).delete(swipe.value);
        }
      // if no solution was found and no cells can be unswiped, the tree is fully searched
      } else if (swiped.length === 0) {
        fullySearched = true;
      // unswipe the most recent variable
      } else {
        const unswipe = swiped.pop();
        globalDomains.set(unswipe.key, new Set([unswipe.value]));
        assignmentOrder.slice(assignmentOrder.indexOf(unswipe.key) + 1).forEach(key =>
          globalDomains.set(key, new Set([...c.get('domains').get(key)])));
      }
    }

    // update the domains and solvable based on the solutions found
    const BTS = [];
    assignmentOrder.forEach((key, index) => {
      const newDomain = new Set();
      solutions.forEach(solution => newDomain.add(solution[index].value));
      c.get('domains').set(key, newDomain);
      if (newDomain.size === 1) {
        const variable = component.variables.find(element => element.key === key);
        BTS.push({
          col: variable.col,
          key,
          row: variable.row,
          value: [...newDomain][0],
        });
      }
    });
    if (BTS.length > 0) {
      if (!c.get('solvable').has('BTS')) {
        c.setIn(['solvable', 'BTS'], BTS);
      } else {
        c.updateIn(['solvable', 'BTS'], x => x.concat(BTS));
      }
    }
  });
});
