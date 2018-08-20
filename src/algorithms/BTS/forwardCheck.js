/**
 * Filters the constraints, finding those that contain any two current or future variables.
 * @param {Array<{key: number, value: boolean}} assignmentOrder variable assignment order
 * @param {Map<number, Set<Array<Array<boolean>>>} constraintMap variables mapped to the constraints that contain them
 * @returns {Map<number, Array<Array<Array<boolean>>>} variables mapped to the constraints relevant to their forward
 * check
 */
export const constraintFilter = (assignmentOrder, constraintMap) => {
  const filteredMap = new Map();
  assignmentOrder.forEach((current, index) => {
    const future = assignmentOrder.slice(index + 1);
    const constraints = [...constraintMap.get(current)];
    const filtered = constraints.filter(constraint =>
      future.some(variable => constraintMap.get(variable).has(constraint)));
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
  });
  // check for destroyed domains
  if ([...domains.values()].some(set => set.size === 0)) {
    return false;
  }
  return true;
};

/**
 * Enforces GAC on all future variables based on the current variable assignment.
 * @param {Array{key: number, value: boolean}} stack current variable assignments
 * @param {Map<number, Array<Array<Array<boolean>>>} constraintMap future variables mapped to the constraints relevant
 * to their forward checks
 * @param {Map<number, Set<boolean>>} domains current variable domains
 * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
 * @param {{timeChecking: 0}} diagnostics execution metrics object
 * @returns {boolean} true if consistent, false otherwise
 */
const forwardCheck = (stack, constraintMap, domains, reductions, diagnostics) => {
  const startTime = performance.now();
  const current = stack.slice(-1)[0].key;
  const future = [...constraintMap.keys()].slice(stack.length);
  const newDomains = new Map();
  future.forEach(key => newDomains.set(key, new Set([...domains.get(key)])));

  // check that the current assignment is consistent with all constraints
  let consistent = constraintMap.get(current).every(constraint => {
    const subFuture = constraint[0].filter(key => future.includes(key));
    const subDomains = new Map();
    subFuture.forEach(key => subDomains.set(key, new Set()));
    const subSolution = stack.filter(variable => constraint[0].includes(variable.key));
    let supported = false;
    // populate subDomains from consistent tuples
    constraint.slice(1).forEach(tuple => {
      if (tuple.alive && subSolution.every(element => tuple[constraint[0].indexOf(element.key)] === element.value)) {
        subFuture.forEach(key => subDomains.get(key).add(tuple[constraint[0].indexOf(key)]));
        supported = true;
      }
    });
    // update newDomains from subDomains if the assignment is supported
    if (supported) {
      subDomains.forEach((values, key) =>
        newDomains.set(key, new Set([...newDomains.get(key)].filter(value => values.has(value)))));
    }
    return supported;
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
        const subFuture = constraint[0].filter(key => future.includes(key));
        const subDomains = new Map();
        subFuture.forEach(key => subDomains.set(key, new Set()));
        let supported = false;
        constraint.slice(1).forEach(tuple => {
          if (tuple.alive && subFuture.every(key => domains.get(key).has(tuple[constraint[0].indexOf(key)]))) {
            subFuture.forEach(key => subDomains.get(key).add(tuple[constraint[0].indexOf(key)]));
            supported = true;
          }
        });
        if (supported) {
          subDomains.forEach((values, key) =>
            newDomains.set(key, new Set([...newDomains.get(key)].filter(value => values.has(value)))));
        }
        return supported;
      });
      // reduce the domains of the future variables
      if (consistent) {
        consistent = reduce(reduced, newDomains, domains, queue);
      }
    }

    if (consistent) {
      reduced.forEach((values, key) => reductions.get(key).push(values));
      diagnostics.timeChecking += performance.now() - startTime;
      return true;
    }
    reduced.forEach((values, key) => values.forEach(value => domains.get(key).add(value)));
    diagnostics.timeChecking += performance.now() - startTime;
    return false;
  }
  diagnostics.timeChecking += performance.now() - startTime;
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
 * @returns {number} next level to try labeling
 */
const label = (stack, key, constraintMap, domains, reductions, diagnostics) => {
  while (domains.get(key).size > 0) {
    stack.push({
      key,
      value: [...domains.get(key)][0],
    });
    if (forwardCheck(stack, constraintMap, domains, reductions, diagnostics)) {
      break;
    } else {
      const value = stack.pop().value;
      domains.get(key).delete(value);
      reductions.get(key).slice(-1)[0].add(value);
    }
  }
  return stack.length;
};

/**
 * Restores the domain of the current variable and removes the previous variable assignment from the stack.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {Array<number>} assignmentOrder order of variable assignments
 * @param {Map<number, Set<boolean>} domains current variable domains and reductions
 * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
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
  }
};

/**
 * Searches the subspace until a solution is found or the entire subspace is traversed.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {Map<number, Set<boolean>} domains variables mapped to the allowed values of the subspace
 * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
 * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap variables mapped to the constraints relevant to
 * their forward check
 * @param {Array<number>} assignmentOrder order of variable assignments
 * @returns {{*}} search diagnostics object
 */
export default (stack, domains, reductions, constraintMap, assignmentOrder) => {
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
      currentLevel = label(stack, currentVariable, constraintMap, domains, reductions, diagnostics);
      diagnostics.nodesVisited++;
      if (currentLevel === oldLevel) {
        consistent = false;
      }
    } else {
      unlabel(stack, assignmentOrder, domains, reductions);
      currentLevel--;
      diagnostics.backtracks++;
      if (currentLevel >= 0 && domains.get(assignmentOrder[currentLevel]).size > 0) {
        consistent = true;
      }
    }
  }
  diagnostics.solutionFound = stack.length === assignmentOrder.length;
  return diagnostics;
};
