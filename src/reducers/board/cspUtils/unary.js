/**
 * Finds unary (scope of only one variable) constraints.
 * @param {Array<{}>} constraints array of constraint objects
 * @returns {Map<number, boolean>} solvable map of variable keys with their solution
 */
const findUnary = constraints => {
  const unary = new Map();
  // for each unary constraint
  constraints.forEach(constraint => {
    if (constraint[0].length === 1 && constraint.alive === 1) {
      unary.set(constraint[0][0], constraint[1][0]);
    }
  });

  return unary;
};

/**
 * Enforces unary variables on the constraints.
 * @param {Map<number, boolean>} unary map of unary variables
 * @param {Array<{}>} constraints list of constraint objects
 * @returns {Array<{}>} constraints with unary consistency
 */
const enforceUnary = (unary, constraints) => {
  unary.forEach((value, key) => {
    constraints.forEach((constraint, i) => {
      const index = constraint[0].indexOf(key);
      if (index !== -1) {
        for (let j = 1; j < constraint.length; j++) {
          if (constraints[i][j].alive && constraint[j][index] !== value) {
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
 * @param {Immutable.Map} csp immutable state of the csp model
 * @returns {Immutable.Map} new csp model with unary consistency
 */
export default csp => {
  // create a mutable copy of the csp constraints
  let constraints = csp.get('constraints').slice();

  // find and enforce unary consistency
  const unary = findUnary(constraints);
  if (unary.length === 0) {
    return csp.deleteIn(['solvable', 'Unary']);
  }
  constraints = enforceUnary(unary, constraints);

  return csp.withMutations(c => {
    c.set('constraints', constraints);
    const solvable = [];
    unary.forEach((value, key) => {
      const variable = c.get('variables').find(element => element.key === key);
      solvable.push({
        col: variable.col,
        key,
        row: variable.row,
        value,
      });
    });
    if (solvable.length > 0) {
      c.setIn(['solvable', 'Unary'], solvable);
    }
  });
};
