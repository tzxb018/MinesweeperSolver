import {
  checkLossCondition,
  loseGame,
  revealCell,
} from '../../utils/cellUtils';

/**
 * Solves all cells found to be solvable, losing the game if a cell that had a mine was incorrectly revealed.
 * @param state state of board
 * @param doLog true if the solve should be logged, false if it should be recorded instead of logged
 * @return updated state
 */
export default (state, doLog) => state.withMutations(s => {
  // solve each cell, keeping track of which algorithm it was found by
  const changedCells = [];
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
      && !s.getIn(['minefield', 'cells', cell.row, cell.col, 'isFlagged'])
      && s.getIn(['minefield', 'numFlagged']) < s.get('numMines')) {
        s.setIn(['minefield', 'cells', cell.row, cell.col, 'isFlagged'], true);
        s.updateIn(['minefield', 'numFlagged'], n => n + 1);
        numFlagged++;
        changedCells.push({
          col: cell.col,
          row: cell.row,
        });
      // else if it is not already revealed, reveal it
      } else if (!cell.value && s.getIn(['minefield', 'cells', cell.row, cell.col, 'isHidden'])) {
        s.update('minefield', m => revealCell(m, cell.row, cell.col));
        if (checkLossCondition(s.get('minefield'), cell.row, cell.col)) {
          lostGame = true;
        }
        changedCells.push({
          col: cell.col,
          row: cell.row,
        });
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

  // log the action if doLog and it did anything in addition to previous algorithms
  s.update('historyLog', h => h.pop());
  if (doLog) {
    const numCellsFlagged = s.getIn(['minefield', 'numFlagged']) - oldNumFlagged;
    const numCellsRevealed = s.getIn(['minefield', 'numRevealed']) - oldNumRevealed;
    let logString = `Flagged ${numCellsFlagged} mine(s) and revealed ${numCellsRevealed} cell(s)`;
    solvedCellCounter.forEach((counter, setKey) => {
      if (counter.numFlagged + counter.numRevealed > 0) {
        logString += `\n\t${setKey} flagged ${counter.numFlagged} mine(s) and revealed ${counter.numRevealed} cell(s)`;
      }
    });
    s.update('historyLog', h => h.push({
      cells: changedCells,
      message: logString,
    }));
  } else {
    solvedCellCounter.forEach((counter, setKey) => {
      if (counter.numFlagged + counter.numRevealed > 0) {
        if (!s.getIn(['csp', 'count']).has(setKey)) {
          s.getIn(['csp', 'count']).set(setKey, {
            numFlagged: 0,
            numRevealed: 0,
          });
        }
        s.getIn(['csp', 'count']).get(setKey).numFlagged += counter.numFlagged;
        s.getIn(['csp', 'count']).get(setKey).numRevealed += counter.numRevealed;
      }
    });
  }
  return s;
});
