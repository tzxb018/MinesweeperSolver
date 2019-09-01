/**
 * Intersects the domains of two sets. Outputing a new set of the intersection.
 * @param {Set<*>} set1
 * @param {Set<*>} set2
 * @returns {Set<*>} new set of the intersect of set1 and set2
 */
export const intersect = (set1, set2) => new Set([...set1].filter(value => set2.has(value)));


/**
 * Gets the basic viable domains of each variable.
 * @param {Constraint[]} constraints array of Constraints
 * @returns {Map<number, Set<boolean>>} map containing the allowed domain set for each variable
 */
export const getDomains = constraints => {
  const domains = new Map();
  constraints.forEach(constraint => {
    const newDomains = constraint.supportedDomains();
    if (newDomains) {
      newDomains.forEach((values, key) => {
        if (!domains.has(key)) {
          domains.set(key, new Set([...values]));
        } else {
          domains.set(key, intersect(domains.get(key), values));
        }
      });
    } else {
      constraint.scope.forEach(key => domains.set(key, new Set()));
    }
  });
  return domains;
};

/**
 * Formats the given number with commas separating each three digits.
 * @param {number} num number to format with commas
 * @param {string} formatted number
 */
export const numberWithCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * Revises the constraints of the given edge by enforcing pairwise consistency. Pairwise consistency means every tuple
 * has a supporting tuple in the other constraint of the edge.
 * @param {Constraint[]} edge list of constraints that form the edge
 * @param {number[]} edge.scope list of variables common to the pair
 * @param {Object} [diagnostics] execution metrics object
 * @param {number} diagnostics.tuplesKilled number of tuples killed
 * @returns {Constraint[]} list of Constraints that were revised, undefined if one of the constraints of the edge is
 * dead
 */
export const reviseEdge = (edge, diagnostics) => {
  let isConsistent = true;
  // regionalize each constraint and find the common regions
  const regionMaps = edge.map(constraint => constraint.regionalize(edge.scope));
  const commonRegions = [...regionMaps[0].keys()].filter(domain =>
    regionMaps.every(regionMap => regionMap.has(domain)));

  // revise each constraint's tuples based on the common regions
  const revisedConstraints = [];
  regionMaps.forEach((regionMap, index) => {
    let revised = false;
    regionMap.forEach((tuples, domain) => {
      if (!commonRegions.includes(domain)) {
        tuples.forEach(id => edge[index].kill(id));
        if (diagnostics) {
          diagnostics.tuplesKilled += tuples.length;
        }
        revised = true;
      }
    });
    if (revised) {
      if (!edge[index].isConsistent) {
        isConsistent = false;
      } else {
        revisedConstraints.push(edge[index]);
      }
    }
  });

  return isConsistent ? revisedConstraints : undefined;
};
