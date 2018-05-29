import {
  checkLossCondition,
  loseGame,
  revealCell,
} from '../utils/cellUtils';

/**
 * Solves all cells found to be solvable, losing the game if a cell that had a mine was incorrectly revealed.
 * @param state state of board
 * @return updated state
 */
export default state => state.withMutations(s => {
  // solve each cell, keeping track of which algorithm it was found by
  const solvedCellCounter = new Map();
  const oldNumFlagged = s.getIn(['minefield', 'numFlagged']);
  const oldNumRevealed = s.getIn(['minefield', 'numRevealed']);
  let lostGame = false;
  s.getIn(['csp', 'solvable']).forEach((solvableSet, setKey) => {
    const numRevealed = s.getIn(['minefield', 'numRevealed']);
    let numFlagged = 0;
    solvableSet.forEach(cell => {
      // if the cell should have a mine and isn't already flagged and there are not too many flags already, flag it
      if (cell.value
      && !s.getIn(['minefield', 'cells', cell.row, cell.col, 'flagged'])
      && s.getIn(['minefield', 'numFlagged']) < s.get('numMines')) {
        s.setIn(['minefield', 'cells', cell.row, cell.col, 'flagged'], true);
        s.updateIn(['minefield', 'numFlagged'], n => n + 1);
        numFlagged++;
      // else if it is not already revealed, reveal it
      } else if (!cell.value && s.getIn(['minefield', 'cells', cell.row, cell.col, 'hidden'])) {
        s.update('minefield', m => revealCell(m, cell.row, cell.col));
        if (checkLossCondition(s.get('minefield'), cell.row, cell.col)) {
          lostGame = true;
        }
      }
    });
    solvedCellCounter.set(setKey, {
      numFlagged,
      numRevealed: s.getIn(['minefield', 'numRevealed']) - numRevealed,
    });
  });
  s.updateIn(['csp', 'solvable'], o => o.clear());
  // if a mine was revealed, lose the game
  if (lostGame) {
    return loseGame(s);
  }

  // log the action if it did anything in addition to previous algorithms
  const numCellsFlagged = s.getIn(['minefield', 'numFlagged']) - oldNumFlagged;
  const numCellsRevealed = s.getIn(['minefield', 'numRevealed']) - oldNumRevealed;
  let logString = `Found ${numCellsFlagged} mine(s) and revealed ${numCellsRevealed} cell(s)`;
  solvedCellCounter.forEach((counter, setKey) => {
    if (counter.numFlagged + counter.numRevealed > 0) {
      logString += `\n\t${setKey} found ${counter.numFlagged} mine(s) and revealed ${counter.numRevealed} cell(s)`;
    }
  });
  s.update('historyLog', h => h.pop().push(logString));
  return s;
});
