/**
 * Gets the basic viable domain of each variable.
 * @param csp: the csp model of the minefield
 * @returns array containing the domain set for each variable
 */
const getDomains = csp => {
  const domains = [];

  csp.get('components').forEach(component => {
    component.constraints.forEach(constraint => {
      for (let i = 1; i < constraint.length; i++) {
        // for each alive tuple, add the solution values to the domain set
        if (constraint[i].alive) {
          for (let j = 0; j < constraint[i].length; j++) {
            const varKey = constraint[0][j];
            if (domains[varKey] === undefined) {
              domains[varKey] = new Set();
            }
            domains[varKey].add(constraint[i][j]);
          }
        }
      }
    });
  });

  return domains;
};

/**
 * Revises a constraint with the given domains. Returning a map of the new domain sets that the constraint agrees with.
 * @param constraint a table constraint to be revised
 * @param domains the set of variable domains
 * @returns map of the new domain sets that the revised constraint allows for
 */
const revise = (constraint, domains) => {
  // set up the new domain map
  const newDomains = new Map();
  constraint[0].forEach(varKey => {
    newDomains.set(varKey, new Set());
  });

  for (let i = 1; i < constraint.length; i++) {
    // revise the alive tuples with the old domain sets
    if (constraint[i].alive) {
      for (let j = 1; j < constraint[0].length; i++) {
        if (!domains[constraint[0][j]].has(constraint[i][j])) {
          constraint[i].alive = false;
          constraint.alive--;
          break;
        }
      }
      // populate the new domain sets with the consistent tuples
      if (constraint[i].alive) {
        for (let j = 1; j < constraint[0].length; i++) {
          newDomains[constraint[0][j]].add(constraint[i][j]);
        }
      }
    }
  }

  return newDomains;
};

/**
 * Implementation of simple tabular reduction algorithm. Revises constraint tuples and variable domain sets, enforcing
 * generalized arc consistency (GAC) across all constraint tables. Any variables with a domain of only one value are
 * added to the list of solvable cells.
 * @param csp csp model of the minefield
 */
export default csp => csp.withMutations(c => {
  const STR = [];
  // get the initial variable domains
  const domains = getDomains(c);

  c.get('components').forEach(component => {
    const queue = [];
    component.constraints.forEach(element => queue.push(element));

    // continually check constraints until no more changes can be made
    while (queue.length > 0) {
      // revise the next constraint in the queue
      const constraint = queue.shift();
      const newDomains = revise(constraint, domains);

      newDomains.forEach((domainSet, varKey) => {
        // if the new domain set is different, intersect the new and old domain sets
        if (domains[varKey].size !== domainSet.size) {
          domains[varKey] = new Set([...domains[varKey]].filter(x => domainSet.has(x)));
          // add any constraints affected by this variable back to the queue
          component.constraints.forEach(element => {
            if (element !== constraint && element[0].includes(varKey) && !queue.includes(element)) {
              queue.push(element);
            }
          });
        }
        // if the domain is inconsistent, break
        if (domains[varKey].size === 0) {
          throw new Error();
        }
      });
    }

    // solve any variables with a domain of only one value
    domains.forEach((varDomain, varKey) => {
      if (varDomain.size === 1) {
        const variable = component.variables.find(element => element.key === varKey);
        if (variable !== undefined) {
          STR.push({
            col: variable.col,
            key: varKey,
            row: variable.row,
            value: [...varDomain][0],
          });
        }
      }
    });
  });

  // add all STR cells to the list solvable cells
  c.setIn(['solvable', 'STR'], STR);
});
