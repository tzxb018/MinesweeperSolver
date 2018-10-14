import { revealNeighbors } from '../cellUtils';
import {
  algorithms,
  loseGame,
} from '../reducerFunctions';
import HistoryLog from '../../../HistoryLog';

/**
 * Solves all cells found to be solvable, losing the game if a cell that had a mine was incorrectly revealed.
 * @param {Immutable.Map} state state of board
 * @param {boolean} doLog false if solve should be recorded instead of logged, true otherwise
 * @return {Immutable.Map} updated state
 */
export default (state, doLog = true) => state.withMutations(s => {
  // solve each cell, keeping track of which algorithm it was found by
  const changedCells = [];
  const solvedCellCounter = new Map();
  const oldNumFlagged = s.getIn(['minefield', 'numFlagged']);
  const oldNumRevealed = s.getIn(['minefield', 'numRevealed']);
  let lostGame = false;
  const solveOrder = new Map([...s.getIn(['csp', 'solvable']).entries()].sort((a, b) =>
    algorithms.get(a) - algorithms.get(b)));
  solveOrder.forEach((solvableSet, setKey) => {
    const numRevealed = s.getIn(['minefield', 'numRevealed']);
    let numFlagged = 0;
    solvableSet.forEach(cell => {
      // if the cell should have a mine and isn't already flagged and there are not too many flags already, flag it
      if (cell.value
      && !s.getIn(['minefield', 'cells', cell.row, cell.col, 'isFlagged'])
      && s.getIn(['minefield', 'numFlagged']) < s.getIn(['minefield', 'numMines'])) {
        s.setIn(['minefield', 'cells', cell.row, cell.col, 'isFlagged'], true);
        s.updateIn(['minefield', 'numFlagged'], n => n + 1);
        numFlagged++;
        changedCells.push({
          col: cell.col,
          row: cell.row,
        });
      // else if it is not already revealed, reveal it
      } else if (!cell.value && s.getIn(['minefield', 'cells', cell.row, cell.col, 'isHidden'])) {
        s.setIn(['minefield', 'cells', cell.row, cell.col, 'isHidden'], false);
        s.updateIn(['minefield', 'numRevealed'], n => n + 1);
        if (s.getIn(['minefield', 'cells', cell.row, cell.col, 'content']) === 0) {
          s.update('minefield', m => revealNeighbors(m, cell.row, cell.col));
        } else if (s.getIn(['minefield', 'cells', cell.row, cell.col, 'content']) === -1) {
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
    let cellOrCells = 'cells';
    if (numCellsFlagged + numCellsRevealed === 1) {
      cellOrCells = 'cell';
    }
    const message = `Solved ${numCellsFlagged + numCellsRevealed} ${cellOrCells}, ${numCellsFlagged}[flag]`;
    const log = new HistoryLog(message, 'log', true, changedCells);
    solvedCellCounter.forEach((counter, setKey) => {
      if (counter.numFlagged + counter.numRevealed > 0) {
        cellOrCells = 'cells';
        if (counter.numFlagged + counter.numRevealed === 1) {
          cellOrCells = 'cell';
        }
        const detail =
          `${setKey} solved ${counter.numFlagged + counter.numRevealed} ${cellOrCells}, ${counter.numFlagged}[flag]`;
        log.addDetail(detail);
      }
    });
    s.update('historyLog', h => h.push(log));
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
