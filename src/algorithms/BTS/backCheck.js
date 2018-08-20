import { check } from '../utils';

/**
 * Filters the constraints, finding those that contain the current and at least one past variable.
 * @param {Array<number>} assignmentOrder variable assignment order
 * @param {Map<number, Set<Array<Array<boolean>>>} constraintMap variables mapped to the constraints that contain them
 * @returns {Map<number, Array<Array<Array<boolean>>>>} variables mapped to the constraints relevant to their backcheck
 */
export const constraintFilter = (assignmentOrder, constraintMap) => {
  const filteredMap = new Map();
  assignmentOrder.forEach((current, index) => {
    const past = assignmentOrder.slice(0, index);
    const constraints = [...constraintMap.get(current)];
    const filtered = constraints.filter(constraint =>
      past.some(variable => constraintMap.get(variable).has(constraint)));
    filteredMap.set(current, filtered);
  });
  return filteredMap;
};

/**
 * Checks if the current variable assignments are supported by all constraints.
 * @param {Array<{key: number, value: boolean}>} stack current variable assignments
 * @param {Array<Array<Array<boolean>>>} constraints constraints relevant to the back check
 * @param {timeChecking: number} diagnostics execution metrics object
 * @returns {boolean} true if consistent, false otherwise
 */
const backCheck = (stack, constraints, diagnostics) => {
  const startTime = performance.now();
  const consistent = constraints.every(constraint =>
    check(stack.filter(variable => constraint[0].includes(variable.key)), constraint));
  diagnostics.timeChecking += performance.now() - startTime;
  return consistent;
};

/**
 * Attempts to assign the current variable a consistent value.
 * @param {Array<{key: number, value: boolean}>} stack past variable assignments
 * @param {number} key variable to be assigned
 * @param {Array<Array<Array<boolean>>>>} constraints constraints relevant to the back check
 * @param {Set<boolean>} domains current variable domains
 * @param {timeChecking: number} diagnostics execution metrics object
 * @returns {number} next level to try labeling
 */
const label = (stack, key, constraints, domains, diagnostics) => {
  while (domains.size > 0) {
    stack.push({
      key,
      value: [...domains][0],
    });
    if (backCheck(stack, constraints, diagnostics)) {
      break;
    } else {
      domains.delete(stack.pop().value);
    }
  }
  return stack.length;
};

/**
 * Restores the domain of the current variable and removes the previous variable assignment from the stack.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {number} key variable to be restored
 * @param {Map<number, Set<boolean>} domains current variable domains
 * @param {Set<boolean>} restorations original variable domains
 * @returns {boolean} true if consistent, false if more unlabeling needed
 */
const unlabel = (stack, key, domains, restorations) => {
  domains.set(key, new Set([...restorations]));
  const variable = stack.pop();
  if (variable) {
    domains.get(variable.key).delete(variable.value);
    if (domains.get(variable.key).size > 0) {
      return true;
    }
  }
  return false;
};

/**
 * Searches the subspace until a solution is found or the entire subspace is traversed.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {Map<number, Set<boolean>} currentDomains variables mapped to the allowed values of the subspace
 * @param {Map<number, Set<boolean>} globalDomains variables mapped to the backup values of the subspace
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap variables mapped to the constraints relevant to
 * their back check
 * @param {Array<number>} assignmentOrder order of variable assignments
 * @returns {{*}} search diagnostics object
 */
export default (stack, currentDomains, globalDomains, constraintMap, assignmentOrder) => {
  let consistent = true;
  let currentLevel = stack.length;
  const diagnostics = {
    solutionFound: false,
    nodesVisited: 0,
    backtracks: 0,
    timeChecking: 0,
  };

  // search the tree
  while (currentLevel >= 0 && currentLevel < assignmentOrder.length) {
    const currentVariable = assignmentOrder[currentLevel];
    if (consistent) {
      const oldLevel = currentLevel;
      currentLevel = label(stack, currentVariable, constraintMap.get(currentVariable),
        currentDomains.get(currentVariable), diagnostics);
      diagnostics.nodesVisited++;
      if (currentLevel === oldLevel) {
        consistent = false;
      }
    } else {
      consistent = unlabel(stack, currentVariable, currentDomains, globalDomains.get(currentVariable));
      currentLevel--;
      diagnostics.backtracks++;
    }
  }
  diagnostics.solutionFound = stack.length === assignmentOrder.length;
  return diagnostics;
};
