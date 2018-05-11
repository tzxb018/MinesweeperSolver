import { revealCell } from '../utils/cellUtils';

/**
 * Solves all cells found to be solvable
 * @param state state of board
 * @return updated state
 */
export default state => state.withMutations(s => {
  s.getIn(['csp', 'solvable']).forEach(solvableSet => {
    solvableSet.forEach(cell => {
      // if the cell should have a mine and isn't already flagged and there are not too many flags already, flag it
      if (cell.value
      && !s.getIn(['minefield', 'cells', cell.row, cell.col, 'flagged'])
      && s.getIn(['minefield', 'numFlagged']) < s.get('numMines')) {
        s.setIn(['minefield', 'cells', cell.row, cell.col, 'flagged'], true);
        s.updateIn(['minefield', 'numFlagged'], n => n + 1);
      // else if it is not already revealed, reveal it
      } else if (!cell.value && s.getIn(['minefield', 'cells', cell.row, cell.col, 'hidden'])) {
        s.update('minefield', m => revealCell(m, cell.row, cell.col));
      }
    });
  });
  s.updateIn(['csp', 'solvable'], o => o.clear());
});
