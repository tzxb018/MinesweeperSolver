/**
 * Revises a constraint with the given domains. Returning a map of the new domain sets that the constraint agrees with.
 * @param {Array<Array<boolean>>} constraint a table constraint to be revised
 * @param {Map<number, Set<boolean>>} domains the set of variable domains
 * @returns {Map<number, Set<boolean>>} map of the new domain sets that the revised constraint allows for
 */
const revise = (constraint, domains) => {
  // set up the new domain map
  const newDomains = new Map();
  constraint[0].forEach(varKey => newDomains.set(varKey, new Set()));

  for (let i = 1; i < constraint.length; i++) {
    // revise the alive tuples with the old domain sets
    if (constraint[i].alive) {
      for (let j = 0; j < constraint[0].length; j++) {
        if (!domains.get(constraint[0][j]).has(constraint[i][j])) {
          constraint[i].alive = false;
          constraint.alive--;
          break;
        }
      }
      // populate the new domain sets with the consistent tuples
      if (constraint[i].alive) {
        for (let j = 0; j < constraint[0].length; j++) {
          newDomains.get(constraint[0][j]).add(constraint[i][j]);
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
 * @param {Immutable.Map} csp csp model of the minefield
 * @returns {Immutable.Map} csp with GAC and any solvable cells identified
 */
export default csp => csp.withMutations(c => {
  const STR = [];
  const domains = c.get('domains');
  c.get('components').forEach(component => {
    const queue = [];
    component.constraints.forEach(element => queue.push(element));

    try {
      // continually check constraints until no more changes can be made
      while (queue.length > 0) {
        // revise the next constraint in the queue
        const constraint = queue.shift();
        const newDomains = revise(constraint, domains);

        newDomains.forEach((values, key) => {
          // if the new domain set is different, intersect the new and old domain sets
          if (domains.get(key).size !== values.size) {
            domains.set(key, new Set([...domains.get(key)].filter(x => values.has(x))));
            // add any constraints affected by this variable back to the queue
            component.constraints.forEach(element => {
              if (element !== constraint && element[0].includes(key) && !queue.includes(element)) {
                queue.push(element);
              }
            });
          }
          // if the domain is inconsistent, break
          if (domains.get(key).size === 0) {
            throw key;
          }
        });
      }
    } catch (error) {
      component.constraints.forEach(element => {
        if (element[0].includes(error)) {
          element.alive = 0;
        }
      });
    }

    // solve any variables with a domain of only one value
    domains.forEach((values, key) => {
      if (values.size === 1) {
        const variable = component.variables.find(element => element.key === key);
        if (variable !== undefined) {
          STR.push({
            col: variable.col,
            key,
            row: variable.row,
            value: [...values][0],
          });
        }
      }
    });
  });

  // add all STR cells to the list of solvable cells
  if (STR.length > 0) {
    c.setIn(['solvable', 'STR'], STR);
  } else {
    c.deleteIn(['solvable', 'STR']);
  }
});
