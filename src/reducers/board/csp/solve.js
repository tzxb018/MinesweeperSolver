import Immutable from 'immutable';
import HistoryLogItem from 'objects/HistoryLogItem';

import {
  getChangedCells,
  revealNeighbors,
} from '../cellUtils';
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

  // separate any old solvable from the list
  const oldSolvable = new Map();
  solvable.forEach((specs, algorithm) => {
    const oldSpecs = [];
    const newSpecs = specs.filter(spec => {
      if (spec.row !== undefined) {
        if (solutions.has(spec.key)) {
          if (solutions.get(spec.key) !== spec.value) {
            contradictions.add(spec.key);
          }
        } else {
          solutions.set(spec.key, spec.value);
          oldSpecs.push(spec);
        }
        return false;
      }
      return true;
    });
    solvable.set(algorithm, newSpecs);
    oldSolvable.set(algorithm, oldSpecs);
  });

  // filter solvable
  solvable.forEach((specs, algorithm) => {
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
  });

  // map solvable specs to their cells
  solvable.forEach((specs, algorithm) => {
    let solvableCells = specs.filter(spec => !contradictions.has(spec.key));
    solvableCells = solvableCells.map(spec => {
      const variable = variables.find(element => element.key === spec.key);
      return {
        key: spec.key,
        value: spec.value,
        row: variable.row,
        col: variable.col,
      };
    });
    solvable.set(algorithm,
      solvableCells.concat(oldSolvable.get(algorithm).filter(spec => !contradictions.has(spec.key))));
  });
  solvable.forEach((specs, algorithm) => {
    if (specs.length === 0) {
      solvable.delete(algorithm);
    }
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
  const oldNumFlagged = s.getIn(['minefield', 'numFlagged']);
  const oldNumRevealed = s.getIn(['minefield', 'numRevealed']);
  let lostGame = false;
  const solvedCount = new Map();
  const neighborQueue = [];

  s.getIn(['csp', 'solvable']).forEach((cells, algorithm) => {
    const numRevealed = s.getIn(['minefield', 'numRevealed']);
    let numFlagged = 0;
    cells.forEach(cell => {
      // if the cell should have a mine and there are not too many flags already, flag it
      if (cell.value && s.getIn(['minefield', 'numFlagged']) < s.getIn(['minefield', 'numMines'])) {
        s.setIn(['minefield', 'cells', cell.row, cell.col, 'isFlagged'], true);
        s.updateIn(['minefield', 'numFlagged'], n => n + 1);
        numFlagged++;
      // else if the cell should be revealed, reveal it
      } else if (!cell.value) {
        s.setIn(['minefield', 'cells', cell.row, cell.col, 'isHidden'], false);
        s.updateIn(['minefield', 'numRevealed'], n => n + 1);
        if (s.getIn(['minefield', 'cells', cell.row, cell.col, 'content']) === 0) {
          neighborQueue.push({
            row: cell.row,
            col: cell.col,
            algorithm,
          });
        } else if (s.getIn(['minefield', 'cells', cell.row, cell.col, 'content']) === -1) {
          lostGame = true;
        }
      }
    });
    // record the results
    solvedCount.set(algorithm, {
      numRevealed: s.getIn(['minefield', 'numRevealed']) - numRevealed,
      numFlagged,
    });
  });
  // handle any neighbors that need revealing
  neighborQueue.forEach(cell => {
    const numRevealed = s.getIn(['minefield', 'numRevealed']);
    s.update('minefield', m => revealNeighbors(m, cell.row, cell.col));
    solvedCount.get(cell.algorithm).numRevealed += s.getIn(['minefield', 'numRevealed']) - numRevealed;
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
    const changedCells = getChangedCells(state.getIn(['minefield', 'cells']), s.getIn(['minefield', 'cells']));
    const log = new HistoryLogItem(message, 'log', true, changedCells);

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
