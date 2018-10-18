import Immutable from 'immutable';
import HistoryLog from 'HistoryLog';

import { revealNeighbors } from '../cellUtils';
import {
  algorithms,
  loseGame,
} from '../reducerFunctions';

/**
 * Filters solvable, removing duplicates and throwing an error if a contradiction is found. A contradiction is any
 * variable with multiple different solutions. The filtered solvable variables are then linked back to the cells they
 * represent.
 * @param {Immutable.Map} solvableSpecs map of algorithms to the solvable specs they found
 * @param {object[]} variables list of current variable cells
 * @param {number} variables[].key unique variable identifier
 * @param {number} variables[].row cell row of the variable
 * @param {number} variables[].col cell col of the variable
 * @returns {Immutable.Map} solvable cells filtered and remapped
 */
export const parseSolvable = (solvableSpecs, variables) => {
  console.assert([...solvableSpecs.keys()].every(key => algorithms.includes(key)),
    'A solvable set was created but not accounted for');
  const solvable = new Map();
  algorithms.forEach(algorithm => {
    if (solvableSpecs.has(algorithm)) {
      solvable.set(algorithm, solvableSpecs.get(algorithm).slice());
    }
  });
  const solutions = new Map();
  const contradictions = new Set();

  // filter solvable
  solvable.forEach((specs, algorithm) => {
    if (solvable.has(algorithm)) {
      const newSolvable = [];
      specs.forEach(spec => {
        if (solutions.has(spec.key)) {
          if (solutions.get(spec.key) !== spec.value) {
            contradictions.add(spec.key);
          }
        } else {
          solutions.set(spec.key, spec.value);
          newSolvable.push(spec);
        }
      });
      solvable.set(algorithm, newSolvable);
    }
  });
  solvable.forEach((specs, algorithm) => {
    if (specs.length === 0) {
      solvable.delete(algorithm);
    }
  });

  // map solvable specs to their cells
  solvable.forEach((specs, algorithm) => {
    let solvableCells = specs.filter(spec => !contradictions.has(spec.key));
    solvableCells = solvableCells.map(spec => {
      const variable = variables.find(element => element.key === spec.key);
      return {
        value: spec.value,
        row: variable.row,
        col: variable.col,
      };
    });
    solvable.set(algorithm, solvableCells);
  });

  return Immutable.Map(solvable);
};

/**
 * Solves all cells found to be solvable, losing the game if a cell that had a mine was incorrectly revealed.
 * @param {Immutable.Map} state state of board
 * @param {boolean} doLog false if solve should be recorded instead of logged, true otherwise
 * @return {Immutable.Map} updated state
 */
export default (state, doLog = true) => state.withMutations(s => {
  // solve each cell
  const changedCells = [];
  const oldNumFlagged = s.getIn(['minefield', 'numFlagged']);
  const oldNumRevealed = s.getIn(['minefield', 'numRevealed']);
  let lostGame = false;
  const solvedCount = new Map();
  s.getIn(['csp', 'solvable']).forEach((cells, algorithm) => {
    const numRevealed = s.getIn(['minefield', 'numRevealed']);
    let numFlagged = 0;
    cells.forEach(cell => {
      // if the cell should have a mine and there are not too many flags already, flag it
      if (cell.value && s.getIn(['minefield', 'numFlagged']) < s.getIn(['minefield', 'numMines'])) {
        s.setIn(['minefield', 'cells', cell.row, cell.col, 'isFlagged'], true);
        s.updateIn(['minefield', 'numFlagged'], n => n + 1);
        numFlagged++;
        changedCells.push({
          col: cell.col,
          row: cell.row,
        });
      // else if the cell should be revealed and hasn't been inadvertently revealed already, reveal it
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
    // record the results
    solvedCount.set(algorithm, {
      numRevealed: s.getIn(['minefield', 'numRevealed']) - numRevealed,
      numFlagged,
    });
  });
  s.updateIn(['csp', 'solvable'], o => o.clear());

  // check that an error wasn't made
  if (lostGame) {
    return loseGame(s);
  }

  // log the results if necessary
  s.update('historyLog', h => h.pop());
  if (doLog) {
    const numRevealed = s.getIn(['minefield', 'numRevealed']) - oldNumRevealed;
    const numFlagged = s.getIn(['minefield', 'numFlagged']) - oldNumFlagged;

    let cellOrCells = 'cells';
    if (numFlagged + numRevealed === 1) {
      cellOrCells = 'cell';
    }
    const message = `Solved ${numFlagged + numRevealed} ${cellOrCells}, ${numFlagged}[flag]`;
    const log = new HistoryLog(message, 'log', true, changedCells);

    solvedCount.forEach((count, algorithm) => {
      cellOrCells = 'cells';
      if (count.numFlagged + count.numRevealed === 1) {
        cellOrCells = 'cell';
      }
      const detail =
        `${algorithm} solved ${count.numFlagged + count.numRevealed} ${cellOrCells}, ${count.numFlagged}[flag]`;
      log.addDetail(detail);
    });
    s.update('historyLog', h => h.push(log));
  // else accumulate the results
  } else {
    solvedCount.forEach((count, algorithm) => {
      if (!s.getIn(['csp', 'count']).has(algorithm)) {
        s.getIn(['csp', 'count']).set(algorithm, {
          numFlagged: 0,
          numRevealed: 0,
        });
      }
      const counter = s.getIn(['csp', 'count']).get(algorithm);
      counter.numFlagged += count.numFlagged;
      counter.numRevealed += count.numRevealed;
    });
  }
  return s;
});
