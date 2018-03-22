/**
 * Finds unary (scope of only one variable) constraints.
 * @param constraints array of constraint objects
 * @returns solvable list of variable keys with solution
 */
const findUnary = constraints => {
  const unary = [];
  // for each unary constraint
  constraints.forEach(constraint => {
    if (constraint[0].length === 1 && constraint.alive === 1) {
      // if the variable is not already in the list, add it
      if (!unary.some(element => element.key === constraint[0][0] && element.value === constraint[1][0])) {
        unary.push({
          key: constraint[0][0],
          value: constraint[1][0],
        });
      }
    }
  });

  return unary;
};

/**
 * Enforces unary variables on the constraints.
 * @param unary list of unary variables
 * @param constraints list of constraint objects
 * @returns constraints with unary consistency
 */
const enforceUnary = (unary, oldConstraints) => {
  const constraints = oldConstraints.slice();
  unary.forEach(solvable => {
    constraints.forEach((constraint, i) => {
      const index = constraint[0].indexOf(solvable.key);
      if (index !== -1) {
        for (let j = 1; j < constraint.length; j++) {
          if (constraint[j].alive && constraint[j][index] !== solvable.value) {
            // kill a solution if it does not match the unary constraint
            constraints[i][j].alive = false;
            constraints[i].alive--;
          }
        }
      }
    });
  });

  return constraints;
};

/**
 * Enforces unary consistency.
 * Constraints with a scope of only one variable are tested against all other constraints. Each unary constraint is then
 * enforced on the constraints and added to the list of solvable variables.
 * @param csp immutable state of the csp model
 * @returns new csp model with unary consistency
 */
export default csp => {
  // create a mutable copy of the csp constraints
  let constraints = csp.get('constraints').slice();

  // find and enforce unary consistency
  const unary = findUnary(constraints);
  constraints = enforceUnary(unary, constraints);

  return csp.withMutations(c => {
    c.set('constraints', constraints);
    c.update('solvable', list => list.push(...unary.map(obj => {
      const variable = c.get('variables').find(element => element.key === obj.key);
      return {
        col: variable.col,
        key: obj.key,
        row: variable.row,
        value: obj.value,
      };
    })));
  });
};
