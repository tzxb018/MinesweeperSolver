/**
 * Finds all unary constraints and returns any unary restrictions as specs. Unary constraints are those with a scope of
 * only one variable
 * @param {Constraint[]} constraints array of Constraints
 * @returns {Object[]} domain specifications {key: number, value: boolean}
 */
const findUnary = constraints => {
  const unary = [];
  // for each unary constraint
  constraints.forEach(constraint => {
    if (constraint.scope.length === 1 && constraint.numAlive === 1) {
      unary.push({
        key: constraint.scope[0],
        value: constraint.tuples[0][0],
      });
    }
  });

  return unary;
};

/**
 * Enforces unary consistency on all constraints. Constraints with a scope of only one variable are tested against all
 * other constraints. Each unary constraint is then enforced on the constraints and added to the list of solvable
 * variables.
 * @param {Immutable.Map} csp immutable state of the csp model
 * @returns {Immutable.Map} new csp model with unary consistency
 */
export default csp => {
  // find all unary variables
  const specs = findUnary(csp.get('constraints'));
  if (specs.length === 0) {
    return csp.deleteIn(['solvable', 'Unary']);
  }

  // enfore unary consistency
  csp.get('constraints').forEach(constraint => constraint.killIf(specs));

  return csp.withMutations(c => {
    const solvable = [];
    specs.forEach(spec => {
      const variable = c.get('variables').find(element => element.key === spec.key);
      solvable.push({
        col: variable.col,
        key: spec.key,
        row: variable.row,
        value: spec.value,
      });
    });
    c.setIn(['solvable', 'Unary'], solvable);
  });
};
