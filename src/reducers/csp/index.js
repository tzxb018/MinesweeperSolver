// import backbone from './backbone';
import generateCSP from './generateCSP';
import normalize from './normalize';
import separateComponents from './separateComponents';
import unaryConsistency from './unary';

/**
 * Checks csp model for any inconsistencies. Any unsatisfied constraints are highlighted red on the board and solving is
 * disabled to avoid errors.
 * @param state state of the board
 * @returns updated state with any inconsistencies highlighted red and any solving disabled
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
    s.setIn(['csp', 'isConsistent'], true);
  }

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
 * @returns updated version of cells
 */
const colorSolvable = (cells, csp) => cells.withMutations(c => {
  // get the sets of solvable cells
  const solvableSets = csp.get('solvable');
  if (solvableSets === undefined) {
    return cells;
  }

  // unary are colored blue (1)
  let set = solvableSets.get('unary');
  if (set !== undefined) {
    set.forEach(solvableCell => {
      if (c.getIn([solvableCell.row, solvableCell.col, 'component']) === 0) {
        c.setIn([solvableCell.row, solvableCell.col, 'component'], 1);
      }
    });
  }

  // STR are colored darkGreen (2)
  set = solvableSets.get('STR');
  if (set !== undefined) {
    set.forEach(solvableCell => {
      if (c.getIn([solvableCell.row, solvableCell.col, 'component']) === 0) {
        c.setIn([solvableCell.row, solvableCell.col, 'component'], 2);
      }
    });
  }

  return c;
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
  s.set('csp', generateCSP(s.getIn(['minefield', 'cells'])));

  // enforce unary consistency
  s.update('csp', c => unaryConsistency(c));

  // normalize the constraints
  s.update('csp', c => normalize(c));

  // separate variables and constraints into individual components
  s.update('csp', c => separateComponents(c));
  /* Backbone is shutdown until STR is completed.
  // find the backbone
  s.update('csp', c => backbone(c));
  */
  // color the solvable cells
  s.updateIn(['minefield', 'cells'], c => colorSolvable(c, s.get('csp')));

  // check for consistency
  return checkConsistency(s);
});
