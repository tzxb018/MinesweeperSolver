import generateCSP from './generateCSP';
import normalize from './normalize';
import separateComponents from './separateComponents';
import unaryConsistency from './unary';

/**
 * Checks csp model for any inconsistencies. Any unsatisfied constraints are highlighted red on the board.
 * @param state state of the board
 * @returns updated state
 */
const checkConsistency = state => state.withMutations(s => {
  // remove previous inconsistency if there was any
  if (!s.getIn(['csp', 'isConsistent'])) {
    for (let row = 0; row < s.getIn(['minefield', 'cells']).size; row++) {
      for (let col = 0; col < s.getIn(['minefield', 'cells', 0]).size; col++) {
        if (s.getIn(['minefield', 'cells', row, col, 'component']) === -1) {
          s.setIn(['minefield', 'cells', row, col, 'component'], 0);
        }
      }
    }
  }
  s.setIn(['csp', 'isConsistent'], true);

  // color any inconsistent constraints
  s.getIn(['csp', 'components']).forEach(component => {
    component.constraints.forEach(constraint => {
      if (constraint.alive === 0) {
        s.setIn(['minefield', 'cells', constraint.row, constraint.col, 'component'], -1);
        s.setIn(['csp', 'isConsistent'], false);
      }
    });
  });
});

/**
 * Color codes all cells that are solvable.
 * @param cells matrix of cell objects
 * @param csp state of the csp model
 * @param color cell color to make the solvable cells
 * @returns updated version of cells
 */
const colorSolvable = (cells, csp, color) => cells.withMutations(c => {
  // color the solvable cells
  csp.get('solvable').forEach(solution => {
    if (c.getIn([solution.row, solution.col, 'component']) === 0) {
      c.setIn([solution.row, solution.col, 'component'], color);
    }
  });
});

/**
 * Generates the csp model of the minefield. Enforces unary consistency and normalizes the constraints. Separates the
 * model into its distinct component problems. Enforces any further consistency algorithms specified by the state.
 * Checks that the proposed solution is consistent with all constraints.
 * @param state state of the board
 * @returns state with csp model, solvable cells colored, and any inconsistencies colored
 */
export default state => state.withMutations(s => {
  // generate the csp model of the minefield
  s.set('csp', generateCSP(s));

  // enforce unary consistency
  s.update('csp', c => unaryConsistency(c));
  s.updateIn(['minefield', 'cells'], c => colorSolvable(c, s.get('csp'), 1));

  // normalize the constraints
  s.update('csp', c => normalize(c));

  // separate variables and constraints into individual components
  s.set('csp', separateComponents(s.get('csp')));

  // check for consistency
  return checkConsistency(s);
});
