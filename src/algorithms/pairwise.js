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
    let tuples = constraints[0].pairDomains(pair);
    constraints.slice(1).forEach(constraint => {
      const newTuples = constraint.pairDomains(pair);
      tuples = tuples.filter(domain =>
        newTuples.some(newDomain => newDomain.every((element, index) => element === domain[index])));
    });
    domains.set(pair, tuples);
  });

  return domains;
};

/**
 * Revises a constraint with the given domains. Returning a map of the new domain sets that the constraint agrees with.
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
      newDomains.set(key, []);
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
              && (element[0].includes(varPair[0]) && element[0].includes(varPair[1]))
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
        c.get('domains').set(varPair[0],
          new Set([...c.get('domains').get(varPair[0])].filter(x => x === pairDomain[0][0])));
      }
      if (var2 !== undefined) {
        PWC.push({
          col: var2.col,
          key: varPair[1],
          row: var2.row,
          value: pairDomain[0][1],
        });
        c.get('domains').set(varPair[1],
          new Set([...c.get('domains').get(varPair[1])].filter(x => x === pairDomain[0][1])));
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
