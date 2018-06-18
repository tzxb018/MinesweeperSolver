/**
 * Finds whether the given map contains the given pair as a key using deep equality, returning the key if it is found or
 * undefined if it does not exist in the map.
 * @param {Map<Array<number>, Array<Array<boolean>>>} map
 * @param {Array<number>} pair variable pair
 * @returns {Array<number>} matching map key or else undefined
 */
const findKey = (map, pair) => {
  let key;
  const keys = Array.from(map.keys());
  keys.some(element => {
    if (pair[0] === element[0] && pair[1] === element[1]) {
      key = element;
    }
    return key !== undefined;
  });
  return key;
};

/**
 * Finds all possible pairings of variables that appear in at least two constraints and stores the possible domains that
 * those variables could take on as a pair.
 * @param {Immutable.Map} components constraint model of the minesweeper board
 * @returns {Map<Array<number>, Array<Array<boolean>>>} map of variable pairs and their domains
 */
const getDomains = components => {
  const pairs = new Map();
  const domains = new Map();

  // get all the possible variables pairings and the domains of their pairs
  components.forEach(component => {
    component.constraints.forEach(constraint => {
      for (let i = 0; i < constraint[0].length - 1; i++) {
        let var1 = constraint[0][i];
        for (let j = i + 1; j < constraint[0].length; j++) {
          let var2 = constraint[0][j];
          // swap the variable keys if they are not in numerical order
          if (var2 < var1) {
            let temp = var1;
            var1 = var2;
            var2 = temp;
            temp = i;
            i = j;
            j = temp;
          }
          const pair = [var1, var2];
          let key = findKey(pairs, pair);
          if (key === undefined) {
            pairs.set(pair, false);
            key = pair;
            domains.set(key, []);
          } else {
            pairs.set(key, true);
          }
          // add all the possible pair solutions to the map
          for (let k = 1; k < constraint.length; k++) {
            if (constraint[k].alive) {
              const solution = [constraint[k][i], constraint[k][j]];
              // if the solution isn't already in the map, add it
              if (!domains.get(key).some(element => element[0] === solution[0] && element[1] === solution[1])) {
                domains.get(key).push(solution);
              }
            }
          }
          // if the keys were swapped, swap them back
          if (j < i) {
            const temp = j;
            j = i;
            i = temp;
          }
        }
      }
    });
  });

  // remove any variable pairs that only appear in one constraint
  pairs.forEach((value, key) => {
    if (!value) {
      domains.delete(key);
    }
  });
  return domains;
};

/**
 * Revises a constraint with the given domains. Returning a mpa of the new domain sets that the constraint agrees with.
 * @param {Array<Array<boolean>>} constraint a table constraint to be revised
 * @param {Map<Array<number>, Array<Array<boolean>>>} domains the map of variable pair domains
 * @returns {Map<Array<number>, Array<Array<boolean>>>}
 * map of the new domains sets that the revised constraint allows for
 */
const revise = (constraint, domains) => {
  // set up the domain map
  const newDomains = new Map();
  for (let i = 0; i < constraint[0].length - 1; i++) {
    let var1 = constraint[0][i];
    for (let j = i + 1; j < constraint[0].length; j++) {
      let var2 = constraint[0][j];
      // swap the variable keys if they are not in numerical order
      if (var2 < var1) {
        const temp = var1;
        var1 = var2;
        var2 = temp;
      }
      const pair = [var1, var2];
      const key = findKey(domains, pair);
      if (key !== undefined) {
        newDomains.set(key, []);
      }
    }
  }

  for (let i = 1; i < constraint.length; i++) {
    // revise the alive tuples with the old domain sets
    if (constraint[i].alive) {
      Array.from(newDomains.keys()).every(pair => {
        const key1 = constraint[0].indexOf(pair[0]);
        const key2 = constraint[0].indexOf(pair[1]);
        const solution = [constraint[i][key1], constraint[i][key2]];
        if (!domains.get(pair).some(element => element[0] === solution[0] && element[1] === solution[1])) {
          constraint[i].alive = false;
          constraint.alive--;
          return false;
        }
        return true;
      });

      // populate the new domain sets with the consistent tuples
      if (constraint[i].alive) {
        newDomains.forEach((set, pair) => {
          const solution =
            [constraint[i][constraint[0].indexOf(pair[0])], constraint[i][constraint[0].indexOf(pair[1])]];
          if (!set.some(element => element[0] === solution[0] && element[1] === solution[1])) {
            set.push(solution);
          }
        });
      }
    }
  }

  return newDomains;
};

/**
 * Implementation of pair-wise consistency (PWC) using a similar method to simple tabular reduction. Revises constraint
 * tuples and variable pair domain sets, enforcing PWC across all constraint tables. Any pairs with a domain of only one
 * combination are added to the list of solvable cells.
 * @param {Immutable.Map} csp model of the minefield
 * @returns {Immutable.Map} csp with PWC and any solvable cells identified
 */
export default csp => csp.withMutations(c => {
  const PWC = [];
  // get the initial valid variable pairs and their domains
  const domains = getDomains(c.get('components'));

  c.get('components').forEach(component => {
    const queue = [];
    component.constraints.forEach(element => queue.push(element));

    try {
      // continually check constraints until no more changes can be made
      while (queue.length > 0) {
        // revise the next constraint in the queue
        const constraint = queue.shift();
        const newDomains = revise(constraint, domains);

        newDomains.forEach((domainSet, varPair) => {
          // if the new domain set is different, intersect the new and old domain sets
          if (domains.get(varPair).length !== domainSet.length) {
            domains.set(varPair, domains.get(varPair).filter(x => domainSet.some(y => y[0] === x[0] && y[1] === x[1])));
            // add any constraints affected by this pair back to the queue
            component.constraints.forEach(element => {
              if (element !== constraint
              && element[0].includes(varPair[0]) && element[0].includes(varPair[1])
              && !queue.includes(element)) {
                queue.push(element);
              }
            });
          }
          // if the domain is inconsistent, break
          if (domains.get(varPair).length === 0) {
            throw varPair;
          }
        });
      }
    } catch (error) {
      component.constraints.forEach(element => {
        if (element[0].includes(error[0]) && element[0].includes(error[1])) {
          element.alive = 0;
        }
      });
    }

    // solve any pairs with a domain of only one value
    domains.forEach((pairDomain, varPair) => {
      let var1;
      let var2;
      if (pairDomain.length === 1) {
        var1 = component.variables.find(element => element.key === varPair[0]);
        var2 = component.variables.find(element => element.key === varPair[1]);
      } else if (pairDomain.length > 0 && pairDomain.every(solution => solution[0] === pairDomain[0][0])) {
        var1 = component.variables.find(element => element.key === varPair[0]);
      } else if (pairDomain.length > 0 && pairDomain.every(solution => solution[1] === pairDomain[0][1])) {
        var2 = component.variables.find(element => element.key === varPair[1]);
      }
      if (var1 !== undefined) {
        PWC.push({
          col: var1.col,
          key: varPair[0],
          row: var1.row,
          value: pairDomain[0][0],
        });
      }
      if (var2 !== undefined) {
        PWC.push({
          col: var2.col,
          key: varPair[1],
          row: var2.row,
          value: pairDomain[0][1],
        });
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
