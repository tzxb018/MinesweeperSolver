/**
 * Checks if the solution is supported by the constraint.
 * @param {Array<{key: number, value: boolean}>} stack current solution stack
 * @param {Constraint} constraint set of allowed solutions
 * @returns {boolean} true if supported, false otherwise
 */
export const check = (stack, constraint) => {
  const solutionIndex = [];
  const solution = stack.filter(variable => {
    const index = constraint[0].indexOf(variable.key);
    if (index !== -1) {
      solutionIndex.push(index);
      return true;
    }
    return false;
  });
  return constraint.slice(1).some(tuple => tuple.alive && solution.every(
    (variable, index) => tuple[solutionIndex[index]] === variable.value));
};

/**
 * Checks if the solution is supported by the constraint, while also recording the supported future domains.
 * @param {Map<number, Set<boolean>>} mapStack current solution domain restrictions
 * @param {Array<Array<boolean>>} constraint set of allowed solutions
 * @param {Array<number>} future list of future variable keys
 * @param {boolean} doBackCheck true to perform simultaneous backcheck, (default) false to ignore it
 * @returns {Map<number, Set<boolean>>} future variables mapped to supported domains, undefined if not supported
 */
export const checkAndRecordFuture = (mapStack, constraint, future, doBackCheck = false) => {
  const futureDomains = new Map();
  const futureIndex = new Map();
  let solutionIndex = new Map();
  constraint[0].forEach((key, index) => {
    if (future.includes(key)) {
      futureDomains.set(key, new Set());
      futureIndex.set(key, index);
    } else {
      solutionIndex.set(key, index);
    }
  });
  // simultaneous back check?
  if (!doBackCheck) {
    solutionIndex = futureIndex;
  }

  let supported = false;
  constraint.slice(1).forEach(tuple => {
    if (tuple.alive && [...solutionIndex.keys()].every(key => mapStack.get(key).has(tuple[solutionIndex.get(key)]))) {
      supported = true;
      futureDomains.forEach((values, key) => values.add(tuple[futureIndex.get(key)]));
    }
  });
  return supported ? futureDomains : undefined;
};

/**
 * Intersects the domains of two sets. Outputing a new set of the intersection.
 * @param {Set<*>} set1
 * @param {Set<*>} set2
 * @returns {Set<*>} new set of the intersect of set1 and set2
 */
export const intersect = (set1, set2) => new Set([...set1].filter(value => set2.has(value)));
