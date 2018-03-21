import { revealCell } from '../utils/cellUtils';

/**
 * Solves all cells found to be solvable
 * @param state state of board
 * @return updated state
 */
export default state => state.withMutations(s => {
  s.getIn(['csp', 'solvable']).forEach(cell => {
    // if the cell has a mine, flag it
    if (cell.value) {
      s.setIn(['minefield', 'cells', cell.row, cell.col, 'flagged'], true);
      s.updateIn(['minefield', 'numFlagged'], n => n + 1);
    // else, reveal it
    } else {
      s.update('minefield', m => revealCell(m, cell.row, cell.col));
    }
    s.updateIn(['csp', 'solvable'], o => o.clear());
  });
});
