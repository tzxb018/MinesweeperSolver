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
 * @param {number} key variable to be assigned
 * @param {Map<number, Set<Array<Array<boolean>>>} constraintMap variables mapped to the constraints that contian them
 * @param {Set<boolean>} domain current variable domain
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
  const assignmentOrder = [...constraintMap.keys()];
  assignmentOrder.sort((a, b) => a - b);

  let fullySearched = false;
  const solutions = [];
  const swiped = [];
  while (!fullySearched) {
    // start the stack
    let consistent = true;
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
    let currentLevel = startingLevel;
    if (startingLevel === 0) {
      stack.push({
        key: assignmentOrder[startingLevel],
        value: [...currentDomains.get(assignmentOrder[startingLevel])][0],
      });
      currentLevel++;
    }

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
    // if a solution was found, add it to the list and advance the starting position
    if (stack.length === assignmentOrder.length) {
      solutions.push(stack);
      assignmentOrder.every(key => {
        if (currentDomains.get(key).size === 1) {
          globalDomains.set(key, new Set([...currentDomains.get(key)]));
          return true;
        }
        return false;
      });
      // if this was the last possible solution, try to unswipe or the tree is fully searched
      if (startingLevel === assignmentOrder.length) {
        if (swiped.length === 0) {
          console.log('found all solutions');
          fullySearched = true;
        } else {
          const unswipe = swiped.shift();
          globalDomains.set(unswipe.key, new Set([unswipe.value]));
        }
      // if the starting variable was never unlabeled, temporarily swipe its domain
      } else if (currentDomains.get(stack[startingLevel].key).size > 1) {
        swiped.push({
          key: stack[startingLevel].key,
          value: stack[startingLevel].value,
        });
        globalDomains.get(stack[startingLevel].key).delete(stack[startingLevel].value);
      }
    // if no solution was found and no cells can be unswiped, the tree is fully searched
    } else if (swiped.length === 0) {
      console.log('exhausted search space');
      fullySearched = true;
    // unswipe the most recent variable and swipe the next variable
    } else {
      let unswipe = swiped.pop();
      globalDomains.get(unswipe.key).add(unswipe.value);
      let swipe;
      let passed = false;
      let canUnswipe = true;
      while (swipe === undefined && canUnswipe) {
        const canSwipe = assignmentOrder.some(key => {
          if (passed && globalDomains.get(key).size > 1) {
            swipe = {
              key,
              value: [...globalDomains.get(key)][0],
            };
            globalDomains.get(key).delete(swipe.value);
            return true;
          }
          if (key === unswipe.key) {
            passed = true;
          }
          return false;
        });
        if (canSwipe) {
          swiped.push(swipe);
        } else if (swiped.length !== 0) {
          unswipe = swiped.pop();
          globalDomains.get(unswipe.key).add(unswipe.value);
        } else {
          canUnswipe = false;
        }
      }
    }
  }

  // update the domains and solvable based on the solutions found
  return csp.withMutations(c => {
    console.log(solutions);
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
