/**
 * Finds unary (scope of only one variable) constraints
 * @param constraints array of constraint objects
 * @returns solvable list of variable keys with solution, inconsistent list of keys
 */
const findUnary = constraints => {
  const unary = {
    solvable: [],
    inconsistent: [],
  };

  constraints.forEach(constraint => {
    if (constraint[0].length === 1) {
      const index = unary.solvable.findIndex(element => element.key === constraint[0][0]);
      // if the variable is not already in solvable or inconsistent, add it
      if (index === -1 && !unary.inconsistent.includes(constraint[0][0])) {
        unary.solvable.push({
          key: constraint[0][0],
          value: constraint[1][0],
        });
      // if it is but the values don't match, add to the inconsistencies
      } else if (unary.solvable[index].value !== constraint[1][0]) {
        unary.inconsistent.push(unary.solvable.splice(index, 1)[0].key);
      }
    }
  });

  return unary;
};

/**
 * Enforces unary variables on the constraints
 * @param unary list of unary variables and inconsistencies (may be altered)
 * @param constraints list of constraint objects (may be altered)
 */
const enforceUnary = (unary, constraints) => {
  unary.solvable.slice().forEach(solvable => {
    const removed = [];
    try {
      constraints.forEach((constraint, constraintIndex) => {
        removed.push([]);
        const index = constraint[0].indexOf(solvable.key);
        if (index !== -1) {
          for (let j = 1; j < constraint.length; j++) {
            // remove a solution if it does not match the unary constraint
            if (constraint[j][index] !== solvable.value) {
              removed[constraintIndex].push(constraint.splice(j, 1)[0]);
              j--;
              // if the last solution was removed, stop and fix it
              if (constraint.length < 2) {
                throw new Error();
              }
            }
          }
        }
      });
    } catch (e) {
      // add back all that was removed and cut the false solvable to inconsistent
      removed.forEach((element, removedIndex) => constraints[removedIndex].push(...element));
      if (!unary.inconsistent.includes(solvable.key)) {
        unary.inconsistent.push(unary.solvable.splice(unary.solvable.indexOf(solvable), 1)[0].key);
      }
    }
  });
};

/**
 * Enforces unary consistency.
 * Constraints with a scope of only one variable are tested against all other constraints. If all agree on the state of
 * the variable, it is enforced on the constraints and added to the list of solvable variables. If they do not agree,
 * there is an inconsistency so the variable is added to the list of inconsistencies.
 * @param csp immutable state of the csp model
 * @returns new csp model with unary consistency
 */
export default csp => {
  // create a mutable copy of the csp constraints
  const constraints = csp.get('constraints').slice();

  // find and enforce unary consistency
  const unary = findUnary(constraints);
  enforceUnary(unary, constraints);

  return csp.withMutations(c => {
    c.set('constraints', constraints);
    c.update('solvable', list => list.push(...unary.solvable.map(obj => {
      const variable = c.get('variables').find(element => element.key === obj.key);
      return {
        col: variable.col,
        key: obj.key,
        row: variable.row,
        value: obj.value,
      };
    })));
    c.update('inconsistent', list => list.push(...unary.inconsistent.map(obj => {
      const variable = c.get('variables').find(element => element.key === obj.key);
      return {
        col: variable.col,
        key: obj.key,
        row: variable.row,
      };
    })));
  });
};
