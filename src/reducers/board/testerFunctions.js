import Immutable from 'immutable';
import unary from 'algorithms/unary';
import {
  checkWinCondition,
  placeMines,
  revealNeighbors,
} from './cellUtils';
import generateCSP from './csp/generateCSP';
import { getDomains } from './csp/index';
import { reduceComponents } from './csp/reduceComponents';

/**
 * Reveals a random safe cell so the test can resume.
 * @param {Map<string, *>} minefield state of the virtual board
 * @returns {Map<string, *>} new minefield with a random safe cell revealed
 */
const cheat = minefield => {
  const numRows = minefield.get('cells').size;
  const numCols = minefield.getIn(['cells', 0]).size;

  // find a random safe cell that can be revealed
  let x = Math.floor(Math.random() * numRows);
  let y = Math.floor(Math.random() * numCols);
  while (!minefield.getIn(['cells', x, y, 'isHidden']) || minefield.getIn(['cells', x, y, 'content']) === -1) {
    x = Math.floor(Math.random() * numRows);
    y = Math.floor(Math.random() * numCols);
  }

  // reveal the cell
  return minefield.withMutations(m => {
    m.setIn(['cells', x, y, 'isHidden'], false);
    m.update('numRevealed', n => n + 1);
    if (m.getIn(['cells', x, y, 'content']) === 0) {
      return revealNeighbors(m, x, y);
    }
    return m;
  });
};

/**
 * Creates and initializes a new virtual minesweeper puzzle.
 * @param {number} numRows number of rows on the virtual board
 * @param {number} numCols number of cols on the virtual board
 * @param {number} numMines number of mines on the virtual board
 * @returns {{*}} immutable minesweeper puzzle
 */
const initializeBoard = (numRows, numCols, numMines) => {
  // create the empty cell matrix
  let cells = Immutable.List().withMutations(c => {
    for (let i = 0; i < numRows; i++) {
      const row = Immutable.List().withMutations(r => {
        for (let j = 0; j < numCols; j++) {
          r.push(Immutable.Map({
            content: 0,
            isFlagged: false,
            isHidden: true,
          }));
        }
      });
      c.push(row);
    }
  });

  // create the puzzle
  const x = Math.floor(Math.random() * numRows);
  const y = Math.floor(Math.random() * numCols);
  cells = placeMines(cells, numMines, x, y);

  // wrap the cells in the minefield with metadata
  let minefield = Immutable.Map({
    cells,
    numFlagged: 0,
    numMines,
    numRevealed: 0,
  });

  // start the puzzle
  minefield = minefield.withMutations(m => {
    m.setIn(['cells', x, y, 'isHidden'], false);
    m.update('numRevealed', n => n + 1);
    if (m.getIn(['cells', x, y, 'content']) === 0) {
      return revealNeighbors(m, x, y);
    }
    return m;
  });

  return minefield;
};

/**
 * Solves the given solvable cells, updating the minefield and checking for errors.
 * @param {Map<string, *>} minefield state of the virtual board
 * @param {Map<number, {row: number, col: number, value: boolean}>} solvableCells variable keys mapped to their
 * solution information
 * @returns {Map<string, *>} new minefield with all solvable cells solved
 * @throws if a mine is revealed or a safe cell is flagged
 */
const solve = (minefield, solvableCells) => {
  const revealNeighborQueue = [];

  // solve all the solvable cells, checking for errors along the way
  let newMinefield = minefield.withMutations(m => {
    solvableCells.forEach(object => {
      let cell = m.getIn(['cells', object.row, object.col]);
      if (object.value) {
        cell = cell.set('isFlagged', true);
        m.update('numFlagged', n => n + 1);
        if (cell.get('content') !== -1) {
          throw new Error();
        }
      } else {
        cell = cell.set('isHidden', false);
        if (cell.get('content') === -1) {
          throw new Error();
        } else if (cell.get('content') === 0) {
          revealNeighborQueue.push([object.row, object.col]);
        }
      }
      m.setIn(['cells', object.row, object.col], cell);
    });
  });

  // reveal the neighbors of any empty cells solved
  revealNeighborQueue.forEach(coord => {
    newMinefield = revealNeighbors(newMinefield, coord[0], coord[1]);
  });

  return newMinefield;
};

/**
 * Performs one processing cycle on the minefield, returning the result.
 * @param {{*}} state immutable state of the virtual board
 * @param {Function} algorithm method of solving the csp
 * @param {{*}} diagnostics object with properties of the algorithm to be recorded
 * @returns {{*}} updated state with solved CSP and any minefield changes
 * @throws if an error is made during solving
 */
const step = (state, algorithm, diagnostics) => {
  let csp = generateCSP(new Immutable.Map(), state.getIn(['minefield', 'cells']));
  csp = algorithm(csp, diagnostics);
  if (csp.get('solvable').size > 0) {
    return state.update('minefield', m => solve(m, csp.get('solvable'))).set('csp', csp);
  }
  return state;
};

/**
 * Solves the initial minefield with the given algorithm, returning the diagnostics of the test.
 * @param {Map<string, *>} initialMinefield state of the virtual board
 * @param {Function} algorithm method of solving the csp
 * @param {Array<string>} diagnosticKeys array of diagnostic keys to record
 * @param {boolean} [allowCheats=true] true if cheats are allowed, false otherwise
 * @returns {{*}} diagnostics object
 */
const test = (initialMinefield, algorithm, diagnosticKeys, allowCheats = true) => {
  let state = Immutable.Map({
    minefield: initialMinefield,
  });
  const diagnostics = {};
  diagnosticKeys.forEach(key => { diagnostics[key] = 0; });

  let oldState = state;
  let puzzleIsSolved = false;
  try {
    while (!puzzleIsSolved) {
      do {
        oldState = state;
        state = step(oldState, algorithm);
        puzzleIsSolved = checkWinCondition(state.get('minefield'));
      } while (oldState !== state && !puzzleIsSolved);
      if (allowCheats && !puzzleIsSolved) {
        state = state.update('minefield', m => cheat(m));
      }
    }
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }
  diagnostics.success = true;
  return diagnostics;
};

/**
 * Wraps the provided algorithms into one function that can then be tested repeatedly.
 * @param {boolean} checkUnary true if unary constraints should be dealt with beforehand, false to ignore them
 * @param {...Function} algorithms methods of solving the csp in order of execution
 * @returns {Function} wrapper function that takes csp and diagnostics as arguments
 */
const wrapAlgorithms = (checkUnary, ...algorithms) => (csp, diagnostics) => {
  let newCSP;
  if (checkUnary) {
    newCSP = unary(csp);
  } else {
    newCSP = csp;
  }
  newCSP = reduceComponents(newCSP);
  const constraints = [];
  newCSP.get('components').forEach(component => constraints.push(...component.constraints));
  newCSP = newCSP.set('domains', getDomains(constraints));

  algorithms.forEach(algorithm => { newCSP = algorithm(newCSP, diagnostics); });
  return newCSP;
};
