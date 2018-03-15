import { check } from '../utils/cspUtils';

/**
 * Normalizes the constraints.
 * Any constraint that is a subset of another constraint is removed, reducing the total number of constraints. Any
 * constraint that completely envelopes that subset has its solutions reduced to only those that also satisfy the
 * subset. If a constraint that envolopes the subset has no solutions that also satisfy the subset, the subset is
 * replaced, all its variables become inconsistencies, and all its affects on other constraints are reverted.
 * @param csp constraint model of the minesweeper board
 * @returns normalized csp with any inconsistencies found
 */
export default csp => {
  let newCsp = csp;
  // create a mutable copy of the constraints
  const constraints = csp.get('constraints').slice();

  // for all constraints check if all their variables are contained in another constraint
  constraints.slice().forEach((subset, subsetIndex) => {
    let wasSubset = false;  // flag for if this constraint was enveloped by another
    const removed = [];
    try {
      constraints.slice().forEach((constraint, constraintIndex) => {
        const keyIndex = [];
        removed.push([]);
        // check if constraint envelopes the subset
        if (subsetIndex !== constraintIndex
            && subset[0].every(key => {
              const index = constraint[0].indexOf(key);
              if (index === -1) {
                return false;
              }
              keyIndex.push(index);
              return true;
            })) {
          // filter out any possibilities not supported by the subset
          for (let i = 1; i < constraint.length; i++) {
            const solution = [];
            keyIndex.forEach(key => solution.push(constraint[i][key]));
            if (!check(solution, subset)) {
              removed[constraintIndex].push(constraints[constraintIndex].splice(i, 1)[0]);
              i--;
              if (constraints[constraintIndex].length < 2) {
                throw new Error();
              }
            }
          }
          wasSubset = true;
        }
      });
    } catch (e) {
      removed.forEach((element, removedIndex) => constraints[removedIndex].push(...element));
      const keys = [];
      subset[0].forEach(key => {
        if (!csp.get('inconsistent').some(obj => obj.key === key)) {
          const variable = csp.get('variables').find(v => v.key === key);
          keys.push({
            col: variable.col,
            key,
            row: variable.row,
          });
        }
      });
      newCsp = newCsp.update('inconsistent', list => list.push(...keys));
      wasSubset = false;
    }
    if (wasSubset) {
      constraints.splice(subsetIndex, 1);
    }
  });

  return newCsp;
};
