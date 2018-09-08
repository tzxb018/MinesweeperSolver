import { check } from '../utils';

/**
 * Filters the constraints, finding those that contain the current and at least one past variable.
 * @param {Map<number, Set<Array<Array<boolean>>>} constraints variables mapped to the constraints that contain them
 * @param {Array<number>} assignmentOrder variable assignment order
 * @returns {Map<number, Array<Array<Array<boolean>>>>} variables mapped to the constraints relevant to their backcheck
 */
const constraintFilter = (constraints, assignmentOrder) => {
  const filteredMap = new Map();
  assignmentOrder.forEach((current, index) => {
    const past = assignmentOrder.slice(0, index);
    const filtered = [...constraints.get(current)].filter(constraint =>
      past.some(variable => constraints.get(variable).has(constraint)));
    filteredMap.set(current, filtered);
  });
  return filteredMap;
};

/**
 * Checks if the current variable assignments are supported by all constraints.
 * @param {Array<{key: number, value: boolean}>} stack current variable assignments
 * @param {Array<Array<Array<boolean>>>} constraints constraints relevant to the back check
 * @returns {boolean} true if consistent, false otherwise
 */
const backCheck = (stack, constraints) => constraints.every(constraint => check(stack, constraint));

/**
 * Attempts to assign the current variable a consistent value.
 * @param {Array<{key: number, value: boolean}>} stack past variable assignments
 * @param {number} key variable to be assigned
 * @param {Array<Array<Array<boolean>>>>} constraints constraints relevant to the back check
 * @param {Set<boolean>} domains current variable domains
 * @param {{timeChecking: number}} diagnostics execution metrics object
 * @returns {boolean} true if labeling was successful, false if unlabeling needed
 */
const label = (stack, key, constraints, domains, diagnostics) => {
  let consistent = false;
  while (domains.size > 0 && !consistent) {
    stack.push({
      key,
      value: [...domains][0],
    });
    const startTime = performance.now();
    if (backCheck(stack, constraints)) {
      consistent = true;
    } else {
      domains.delete(stack.pop().value);
    }
    diagnostics.timeChecking += performance.now() - startTime;
  }
  return consistent;
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
 * @param {{nodesVisited: number, backtracks: number, timeChecking: number}} diagnostics search metrics object
 * @returns {boolean} true if solution was found, false if no solution exists
 */
const search = (stack, currentDomains, globalDomains, constraintMap, assignmentOrder, diagnostics) => {
  let consistent = true;
  let currentLevel = stack.length;

  while (currentLevel >= 0 && currentLevel < assignmentOrder.length) {
    const currentVariable = assignmentOrder[currentLevel];
    if (consistent) {
      consistent = label(stack, currentVariable, constraintMap.get(currentVariable),
        currentDomains.get(currentVariable), diagnostics);
      diagnostics.nodesVisited++;
      if (consistent) {
        currentLevel++;
      }
    } else {
      consistent = unlabel(stack, currentVariable, currentDomains, globalDomains.get(currentVariable));
      currentLevel--;
      diagnostics.backtracks++;
    }
  }
  return stack.length === assignmentOrder.length;
};

/**
 * Finds all solutions, by back checking, to the given csp and reduces them to the backbone.
 * @param {Map<number, Set<boolean>} domains variables mapped to their allowed values
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraints variables mapped to their constraints
 * @param {Array<number>} assignmentOrder order of variable assignments
 * @param {{*}} diagnostics search metrics object
 * @returns {Array[{key: number, value: boolean}]} list of solvable variables
 */
export default (domains, constraints, assignmentOrder, diagnostics) => {
  const currentDomains = new Map();
  assignmentOrder.forEach(key => currentDomains.set(key, new Set([...domains.get(key)])));
  let fullySearched = false;
  const stack = [];
  const solutions = [];

  // filter the constraints
  const filterTime = performance.now();
  const constraintMap = constraintFilter(constraints, assignmentOrder);
  diagnostics.timeFiltering += performance.now() - filterTime;

  while (!fullySearched) {
    if (search(stack, currentDomains, domains, constraintMap, assignmentOrder, diagnostics)) {
      // save the solution
      solutions.push(stack.slice());

      // find the next variable that could be solved in a different way
      let next;
      while (!next && stack.length > 0) {
        const top = stack.pop();
        if (currentDomains.get(top.key).size > 1) {
          next = top;
        } else {  // restore the domain to clean up for the next search
          currentDomains.set(top.key, new Set([...domains.get(top.key)]));
        }
      }

      // remove the domain so the same solution isn't found again
      if (next) {
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
