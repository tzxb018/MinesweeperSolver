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
  return constraints.filter(constraint => past.some(variable => constraintMap.get(variable).has(constraint)));
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
 * Attempts to assign the next available value to the current variable.
 * @param {Array<{key: number, value: boolean}>} stack past variable assignments
 * @param {number} index current variable index
 * @param {number} key variable to be assigned
 * @param {boolean} value assignment to be attempted
 * @returns {number} next level of the stack to assign
 */
const label = (stack, index, key, value) => {
  stack[index] = {
    key,
    value,
  };
  return index + 1;
};

/**
 * Removes the current variable assignment from the stack and restores its domains.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {Map<number, Set<boolean>} domains current variable domains
 * @param {Map<number, Set<boolean>} globalDomains starting variable domains
 * @returns {number} level of the stack
 */
const unlabel = (stack, domains, globalDomains) => {
  const key = stack.pop().key;
  domains.set(key, globalDomains.get(key));
  return stack.length - 1;
};

// populate current domains with the domains from c.get('domains')
// start the stack with the first assignment
// set the current variable to the next assignment
// while the stack is not empty or as tall as the number of variables
  // label the current variable with next available assignment
  // if no available assignment, unlabel
  // else if backcheck
    // advance to the next variable
  // else remove current assignment from available domain

// if backchecking passes, label the next variable
// else relabel, remove the old assignment from the domain and grab next assignment
// if all the assignments have run out, unlabel
