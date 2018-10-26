import Constraint from 'Constraint';

/**
 * Brute force finds all the pairs of constraints with intersecting scopes.
 * @param {Constraint[]} constraints list of Constraints
 * @param {number} size the maximum number of constraints to pair up
 * @returns {Constraint[]} every pair of constraints and their intersecting scopes
 */
const findPairs = (constraints) => {
  const scopeMap = new Map();
  constraints.forEach((constraint, index) => {
    constraints.slice(index + 1).forEach(constraint2 => {
      const scope = Constraint.intersectScopes(constraint, constraint2);
      if (scope.length > 1) {
        const key = scope.toString();
        if (!scopeMap.has(key)) {
          scopeMap.set(key, [constraint]);
        }
        scopeMap.get(key).push(constraint2);
      }
    });
  });

  const pairs = [];
  scopeMap.forEach((pair, scopeKey) => {
    const scope = scopeKey.split(',').map(n => parseInt(n, 10));
    pair.scope = scope;
    pairs.push(pair);
  });

  return pairs;
};

/**
 * Revises the constraints of the given pair by enforcing pairwise consistency. Pairwise consistency means every tuple
 * has a supporting tuple in the other constraints of the pair.
 * @param {Constraint[]} pair list of Constraints that form the pair
 * @param {number[]} pair.scope list of variables common to the pair
 * @returns {Constraint[]} list of Constraints that were revised, undefined if one of the constraints of the pair is
 * dead
 */
const revise = pair => {
  let isConsistent = true;
  // regionalize each constraint and find the common regions
  const regionMaps = pair.map(constraint => constraint.regionalize(pair.scope));
  const commonRegions = [...regionMaps[0].keys()].filter(domain =>
    regionMaps.every(regionMap => regionMap.has(domain)));

  // revise each constraint's tuples based on the common regions
  const revisedConstraints = [];
  regionMaps.forEach((regionMap, index) => {
    let revised = false;
    regionMap.forEach((tuples, domain) => {
      if (!commonRegions.includes(domain)) {
        tuples.forEach(id => pair[index].kill(id));
        revised = true;
      }
    });
    if (revised) {
      if (!pair[index].isConsistent) {
        isConsistent = false;
      } else {
        revisedConstraints.push(pair[index]);
      }
    }
  });

  return isConsistent ? revisedConstraints : undefined;
};

/**
 * Pair-wise consistency algorithm. Enforces tuple consistency between pairs of constraints that have scope that
 * intersect over at least 2 variables. Tuple consistency means every alive tuple of each constraint in the pair has an
 * alive supporting tuple in all other constraints of the pair.
 */
export default csp => csp.withMutations(c => {
  const PWC = [];
  c.get('components').forEach(component => {
    const pairs = findPairs(component.constraints);
    const constraintMap = new Map();
    pairs.forEach(pair => pair.forEach(constraint => {
      if (!constraintMap.has(constraint)) {
        constraintMap.set(constraint, []);
      }
      constraintMap.get(constraint).push(pair);
    }));
    const queue = [...pairs];

    // revise the pairs until they reach a steady state
    try {
      while (queue.length > 0) {
        const pair = queue.shift();
        const revisedConstraints = revise(pair);
        if (!revisedConstraints) {
          throw pair;
        }
        revisedConstraints.forEach(constraint => queue.push(...constraintMap.get(constraint)));
      }
    } catch (error) {
      error.forEach(constraint => constraint.killAll());
    }

    // solve any variables with a domain of only one value
    component.constraints.forEach(constraint => {
      const specs = constraint.supportedSpecs();
      if (specs) {
        PWC.push(...specs);
      }
    });
  });

  // add all PWC cells to the list of solvable cells
  if (PWC.length > 0) {
    c.setIn(['solvable', 'PWC'], PWC);
  } else {
    c.deleteIn(['solvable', 'PWC']);
  }
});
