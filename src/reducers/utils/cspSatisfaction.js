import Immutable from 'immutable';

import { revealCell } from './cellUtils';

/**
 * Checks csp model for any inconsistencies. Any unsatisfied constraints are highlighted red on the board.
 * @param cells matrix of cell objects
 * @param components state of the csp model components
 * @returns updated version of cells
 */
export const checkConsistency = (cells, components) => cells.withMutations(c => {
  // remove previous inconsistency
  for (let row = 0; row < c.size; row++) {
    for (let col = 0; col < c.get(0).size; col++) {
      if (c.getIn([row, col, 'component']) === -1) {
        c.setIn([row, col, 'component'], 0);
      }
    }
  }

  // color any inconsistent constraints
  components.forEach(component => {
    component.constraints.forEach(constraint => {
      if (constraint.alive === 0) {
        c.setIn([constraint.row, constraint.col, 'component'], -1);
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
export const colorSolvable = (cells, csp, color) => cells.withMutations(c => {
  // color the cells
  csp.get('solvable').forEach(solution => {
    c.setIn([solution.row, solution.col, 'component'], color);
  });
});

/**
 * Solves all cells found to be solvable
 * @param state state of board
 * @return updated state
 */
export const solve = state => {
  let newState = state;

  state.getIn(['csp', 'solvable']).forEach(cell => {
    // if the cell has a mine, flag it
    if (cell.value && !newState.getIn(['minefield', 'cells', cell.row, cell.col, 'flagged'])) {
      newState = newState.setIn(['minefield', 'cells', cell.row, cell.col, 'flagged'], true);
      newState = newState.updateIn(['minefield', 'numFlagged'], n => n + 1);
    // else, reveal it
    } else if (!cell.value) {
      newState = revealCell(newState, cell.row, cell.col);
    }
  });

  newState = newState.setIn(['csp', 'solvable'], Immutable.List());
  return newState;
};
