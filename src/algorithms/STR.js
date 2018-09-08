/**
 * Revises a constraint with the given domains. Supported domains are recorded and returned in a new map.
 * If reduced is provided, any killed tuples are recorded there. Otherwise they are ignored.
 * @param {Array<Array<boolean>>} constraint a table constraint to be revised
 * @param {Map<number, Set<boolean>>} domains the set of allowed variable domains
 * @param {Map<{}, Set<number>>} [reduced] table constraints mapped to their killed tuples
 * @returns {Map<number, Set<boolean>>} variables mapped to their new allowed domains
 */
export const revise = (constraint, domains, reduced = undefined) => {
  // set up the new domain map
  const newDomains = new Map();
  constraint[0].forEach(key => newDomains.set(key, new Set()));

  // revise the alive tuples with the old domain sets
  constraint.slice(1).forEach((tuple, tupleNumber) => {
    if (tuple.alive) {
      const consistent = tuple.every((value, index) => {
        if (!domains.get(constraint[0][index]).has(value)) {
          tuple.alive = false;
          constraint.alive--;
          if (reduced) {
            reduced.get(constraint).add(tupleNumber + 1);
          }
          return false;
        }
        return true;
      });

      // populate the new domain sets with the consistent tuples
      if (consistent) {
        tuple.forEach((value, index) => newDomains.get(constraint[0][index]).add(value));
      }
    }
  });

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
