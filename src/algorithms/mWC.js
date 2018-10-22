import Constraint from 'Constraint';

/**
 * Revises the constraints of the given pair by enforcing pairwise consistency. Pairwise consistency means every tuple
 * has a supporting tuple in the other constraints of the pair.
 * @param {Constraint[]} pair list of Constraints that form the pair
 * @param {number[]} pair.scope list of variables common to the pair
 * @returns {Constraint[]} list of Constraints that were revised, empty array if no changes made
 */
const revise = pair => {
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
      revisedConstraints.push(pair[index]);
    }
  });

  return revisedConstraints;
};

/**
 * Brute force finds all the pairs of constraints with intersecting scopes.
 * @param {Constraint[]} constraints list of Constraints
 * @param {number} size the maximum number of constraints to pair up
 * @returns {Constraint[]} every pair of constraints and their intersecting scopes
 */
/* work in progress
const findPairs = (constraints, size) => {
  const pairs = [];
  constraints.forEach((constraint1, index) => {
    const intersect = [];
    constraints.slice(index).filter(constraint2 => {
      const scope = Constraint.intersectScopes(constraint1, constraint2);
      if (scope.length > 1) {

      }
    })
  })
};

const pwc = csp => csp.withMutations(c => {
  c.get('components').forEach(component => {
    const pairs = findPairs(component.constraints);
    const queue = pairs.slice();
    while (queue.length > 0) {
      const pair = queue.shift();
      const revised = revise(pair);
    }
  });
});
*/

/**
 * Finds whether the given map contains the given pair as a key using deep equality, returning the key if it is found or
 * undefined if it does not exist in the map.
 * @param {Map<number[], boolean[][]>} map
 * @param {number[]} pair variable pair to search for
 * @returns {number[]} matching map key or else undefined
 */
const findKey = (map, pair) =>
  [...map.keys()].find(element => element.every((variable, index) => variable === pair[index]));

/**
 * Finds all valid pairings of variables and maps them to the constraints that have them in scope. A valid pair is a set
 * of variables that appear together in more than one constraint.
 * @param {Constraint[]} constraints list of Constraints
 * @param {number} pairSize the size of the pairs to find (how many variables they should have)
 * @returns {Map<number[], Constraint[]>} valid variable pairs mapped to their constraints
 */
const mapPairsToConstraints = (constraints, pairSize) => {
  const pairMap = new Map();

  // get all the possible pairings
  constraints.filter(constraint => constraint.scope.length >= pairSize).forEach(constraint => {
    // find all pairs of the required length
    const pairs = [];
    constraint.scope.slice(0, -pairSize + 1).forEach(variable => pairs.push([variable]));
    for (let i = 1; i < pairSize; i++) {
      pairs.forEach((pair, index) => pair.push(constraint.scope[index + i]));
    }

    // add each of the pairs to the map
    pairs.forEach(pair => {
      let key = findKey(pairMap, pair);
      if (key === undefined) {
        pairMap.set(pair, []);
        key = pair;
      }
      pairMap.get(key).push(constraint);
    });
  });

  // filter the map so only valid pairs remains
  [...pairMap.keys()].forEach(pair => {
    if (pairMap.get(pair).length === 1) {
      pairMap.delete(pair);
    }
  });
  return pairMap;
};

/**
 * Finds the valid domains of each variable pair.
 * @param {Map<number[], Constraint[]>} pairMap variable pairs mapped to their constraints
 * @returns {Map<number[], boolean[][]} variable pairs mapped to the list of their valid domain combinations
 */
const getPairDomains = pairMap => {
  const domains = new Map();

  // for each pair find the valid domains set by each constraint and intersect them
  pairMap.forEach((constraints, pair) => {
    let tuples = constraints[0].pairDomains([pair]).get(pair);
    constraints.slice(1).forEach(constraint => {
      const newTuples = constraint.pairDomains([pair]).get(pair);
      tuples = tuples.filter(domain =>
        newTuples.some(newDomain => newDomain.every((element, index) => element === domain[index])));
    });
    domains.set(pair, tuples);
  });

  return domains;
};

/**
 * Implementation of m-wise consistency (MWC) using a similar method to simple tabular reduction (STR). Revises
 * constraint tuples and variable pair domain sets, enforcing MWC across all constraint tables. Any pairs with a domain
 * of only one combination are added to the list of solvable cells.
 * @param {Immutable.Map} csp model of the minefield
 * @param {number} [pairSize=2] the number of variables in a "pair"
 * @returns {Immutable.Map} csp with PWC and any solvable cells identified
 */
export default (csp, pairSize = 2) => csp.withMutations(c => {
  const MWC = [];
  c.get('components').forEach(component => {
    const constraintMap = mapPairsToConstraints(component.constraints, pairSize);
    const domains = getPairDomains(constraintMap);
    const queue = [];
    component.constraints.forEach(element => queue.push(element));

    try {
      // continually check constraints until no more changes can be made
      while (queue.length > 0) {
        // revise the next constraint in the queue
        const constraint = queue.shift();
        const newDomains = revise(constraint, domains);
        if (!newDomains) {
          throw [...domains.keys()].filter(pair => pair.every(key => constraint.isInScope(key)));
        }

        newDomains.forEach((values, pair) => {
          // if the new domain set is different, intersect the new and old domain sets
          if (domains.get(pair).length !== values.length) {
            domains.set(pair, domains.get(pair).filter(tuple => values.some(element => element.every(
              (value, i) => value === tuple[i]))));
            // add any constraints affected by this pair back to the queue
            constraintMap.get(pair).forEach(element => {
              if (element !== constraint && !queue.includes(element)) {
                queue.push(element);
              }
            });
          }
          // if the domain is inconsistent, break
          if (domains.get(pair).length === 0) {
            throw new Array(pair);
          }
        });
      }
    } catch (error) {
      error.forEach(pair => {
        constraintMap.get(pair).forEach(constraint => constraint.killAll());
      });
    }

    // solve any pairs with a domain of only one value
    domains.forEach((values, pair) => {
      if (values.length <= (2 ** (pair.length - 1))) {
        for (let i = 0; i < pair.length; i++) {
          const key = pair[i];
          const value = values[0][i];
          if (values.every(tuple => tuple[i] === value)) {
            MWC.push({
              key,
              value,
            });
          }
        }
      }
    });
  });

  // add all MWC cells to the list of solvable cells
  const key = `mWC-${pairSize}`;
  if (MWC.length > 0) {
    c.setIn(['solvable', key], MWC);
  } else {
    c.deleteIn(['solvable', key]);
  }
});
