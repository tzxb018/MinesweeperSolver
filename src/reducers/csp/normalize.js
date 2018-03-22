import { check } from '../utils/cspUtils';

/**
 * Normalizes the constraints.
 * Any constraint that is a subset of another constraint is removed, reducing the total number of constraints. Any
 * constraint that completely envelopes that subset has its solutions reduced to only those that also satisfy the
 * subset.
 * @param csp constraint model of the minesweeper board
 * @returns normalized csp
 */
export default csp => {
  // create a mutable copy of the constraints
  const constraints = csp.get('constraints').slice();

  // for all constraints check if all their variables are contained in another constraint
  constraints.forEach((subset, subsetIndex) => {
    let wasSubset = false;  // flag for if this constraint was enveloped by another
    constraints.forEach((constraint, i) => {
      const keyIndex = [];
      // check if constraint envelopes the subset
      if (subsetIndex !== i
          && subset[0].every(key => {
            const index = constraint[0].indexOf(key);
            if (index === -1) {
              return false;
            }
            keyIndex.push(index);
            return true;
          })) {
        // filter out any possibilities not supported by the subset
        for (let j = 1; j < constraint.length; j++) {
          if (constraint[j].alive) {
            const solution = [];
            keyIndex.forEach(key => solution.push(constraint[j][key]));
            if (!check(solution, subset)) {
              constraints[i][j].alive = false;
              constraints[i].alive--;
            }
          }
        }
        wasSubset = true;
      }
    });
    if (wasSubset) {
      constraints.splice(subsetIndex, 1);
    }
  });

  return csp.set('constraints', constraints);
};
