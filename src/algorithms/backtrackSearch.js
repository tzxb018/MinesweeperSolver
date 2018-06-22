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
 * Attempts to assign the current variable a consistent value.
 * @param {Array<{key: number, value: boolean}>} stack past variable assignments
 * @param {number} key variable to be assigned
 * @param {Map<number, Set<Array<Array<boolean>>>} constraintMap variables mapped to the constraints that contian them
 * @param {Set<boolean>} domain current variable domains
 * @returns {boolean} true if label was successful, false if impossible
 */
const label = (stack, key, constraintMap, domain) => {
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
  return consistent;
};

/**
 * Restores the domain of the current variable and removes the previous variable assignment from the stack.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {number} key variable to be restored
 * @param {Map<number, Set<boolean>} domains current variable domains
 * @param {Map<number, Set<boolean>} globalDomains starting variable domains
 * @returns {boolean} true if previous variable can be relabeled, false if more unlabeling is needed
 */
const unlabel = (stack, key, domains, globalDomains) => {
  domains.set(key, new Set([...globalDomains.get(key)]));
  const variable = stack.pop();
  if (variable !== undefined) {
    domains.get(variable.key).delete(variable.value);
    if (domains.get(variable.key).size > 0) {
      return true;
    }
  }
  return false;
};

/**
 * Performs a backtracking search on the csp until a viable solution is found or the entire search tree is traversed,
 * indicating that the problem is impossible.
 * @param {Immutable.Map} csp constraint model of the minefield
 * @returns {Immutable.Map} updated constraint model
 */
export default csp => {
  // map the variables to the constraints that contain them
  const constraints = [];
  csp.get('components').forEach(component => constraints.push(...component.constraints));
  const constraintMap = mapVariablesToConstraints(constraints);
  // create a separate copy of the domains
  const globalDomains = new Map();
  csp.get('domains').forEach((values, key) => globalDomains.set(key, new Set([...values])));
  // set the variable assignment order
  const assignmentOrder = [];
  for (let i = 0; i < constraintMap.size; i++) {
    assignmentOrder.push(i);
  }

  let fullySearched = false;
  const solutions = [];
  while (!fullySearched) {
    // start the stack
    let consistent = true;
    const currentDomains = new Map();
    globalDomains.forEach((values, key) => currentDomains.set(key, new Set([...values])));
    const stack = [];
    assignmentOrder.every(key => {
      if (globalDomains.get(key).size === 1) {
        stack.push({
          key,
          value: [...globalDomains.get(key)][0],
        });
        return true;
      }
      return false;
    });
    const startingLevel = stack.length;
    stack.push({
      key: assignmentOrder[startingLevel],
      value: [...globalDomains.get(assignmentOrder[startingLevel])][0],
    });
    let currentLevel = startingLevel + 1;

    // begin the search
    while (currentLevel >= startingLevel && currentLevel < assignmentOrder.length) {
      const currentVariable = assignmentOrder[currentLevel];
      if (consistent) {
        if (label(stack, currentVariable, constraintMap, currentDomains.get(currentVariable))) {
          currentLevel++;
        } else {
          consistent = false;
        }
      } else {
        if (unlabel(stack, currentVariable, currentDomains, globalDomains)) {
          consistent = true;
        }
        currentLevel--;
      }
    }
    if (stack.length === assignmentOrder.length) {
      solutions.push(stack);
      if (currentDomains.get(stack[startingLevel].key) > 1) {
        globalDomains.get(stack[startingLevel].key).delete(stack[startingLevel].value);
        for (let i = startingLevel + 1; i < stack.length; i++) {
          currentDomains.set(stack[i].key, new Set([...globalDomains.get(stack[i].key)]));
        }
      } else if (Array.from(globalDomains.values()).every(set => set.size === 1)) {
        fullySearched = true;
      }
    } else {
      fullySearched = true;
    }
  }

  // update the domains and solvable based on the solutions found
  return csp.withMutations(c => {
    const BTS = [];
    assignmentOrder.forEach((key, index) => {
      const newDomain = new Set();
      solutions.forEach(solution => newDomain.add(solution[index].value));
      c.get('domains').set(key, newDomain);
      if (newDomain.size === 1) {
        let variable;
        c.get('components').some(component => {
          variable = component.variables.find(element => element.key === key);
          if (variable !== undefined) {
            return true;
          }
          return false;
        });
        BTS.push({
          col: variable.col,
          key,
          row: variable.row,
          value: [...newDomain][0],
        });
      }
    });
    if (BTS.length > 0) {
      c.setIn(['solvable', 'BTS'], BTS);
    } else {
      c.deleteIn(['solvable', 'BTS']);
    }
  });
};
