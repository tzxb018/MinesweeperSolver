import Immutable from 'immutable';
import HistoryLog from 'HistoryLog';
import { logDiagnostics as logBT } from 'algorithms/BT';
import { logDiagnostics as logSTR2 } from 'algorithms/STR2';
import { logDiagnostics as logmWC } from 'algorithms/mWC';

import processCSP from './csp/index';
import solveCSP from './csp/solve';
import {
  checkWinCondition,
  flagMines,
  getChangedCells,
  placeMines,
  revealMines,
  revealNeighbors,
} from './cellUtils';

export const algorithms = ['Unary', 'BT', 'STR2', 'mWC-1', 'mWC-2', 'mWC-3', 'mWC-4'];

/**
 * Handles the reset action by reverting the cells, csp model, and undo history to their starting states.
 * @param state state of the board
 * @returns newState
 */
export const reset = state => state.withMutations(s => {
  // reset all the cells
  for (let i = 0; i < s.getIn(['minefield', 'cells']).size; i++) {
    for (let j = 0; j < s.getIn(['minefield', 'cells', 0]).size; j++) {
      s.setIn(['minefield', 'cells', i, j], Immutable.Map({
        color: 0,
        content: 0,
        isFlagged: false,
        isHidden: true,
      }));
    }
  }

  // clear out the csp model
  s.deleteIn(['csp', 'components']);
  s.setIn(['csp', 'isConsistent'], true);
  s.updateIn(['csp', 'solvable'], o => o.clear());

  // reset the other settings
  s.update('historyLog', h => h.clear());
  s.set('isGameRunning', false);
  s.setIn(['minefield', 'numFlagged'], 0);
  s.setIn(['minefield', 'numRevealed'], 0);
});

/**
 * Wins the game.
 * @param state
 * @return new state
 */
export const winGame = state => state.withMutations(s => {
  s.updateIn(['minefield', 'cells'], c => flagMines(c));
  s.setIn(['minefield', 'numFlagged'], s.getIn(['minefield', 'numMines']));
  s.set('isGameRunning', false);
});

/**
 * Handles the reveal cell action as performed by the user or by cheat.
 * @param state state of the board
 * @param {number} row row of the cell
 * @param {number} col col of the cell
 * @returns newState
 */
export const revealCell = (state, row, col) => {
  // if there are no mines already, place mines and start the game
  let oldCells = state.getIn(['minefield', 'cells']);
  let newState;
  let popFromHistory = true;
  if (state.getIn(['minefield', 'numRevealed']) === 0) {
    newState = state.updateIn(['minefield', 'cells'], c =>
      placeMines(c, state.getIn(['minefield', 'numMines']), row, col));
    newState = newState.set('isGameRunning', true);
    oldCells = newState.getIn(['minefield', 'cells']);
    popFromHistory = false;
  }

  // if the game is running, reveal the cell, else do nothing and return the old state
  if (state.get('isGameRunning') || !popFromHistory) {
    newState = popFromHistory ? state.set('isGameRunning', true) : newState.set('isGameRunning', true);
    return newState.withMutations(s => {
      // reveal the cell
      const oldNumRevealed = s.getIn(['minefield', 'numRevealed']);
      s.setIn(['minefield', 'cells', row, col, 'isHidden'], false);
      s.updateIn(['minefield', 'numRevealed'], n => n + 1);
      if (s.getIn(['minefield', 'cells', row, col, 'content']) === 0) {
        s.update('minefield', m => revealNeighbors(m, row, col));
      }
      const numCellsRevealed = s.getIn(['minefield', 'numRevealed']) - oldNumRevealed;

      // post the action to the history log
      let cellOrCells = 'cells';
      if (numCellsRevealed === 1) {
        cellOrCells = 'cell';
      }
      const message = `[${row},${col}] revealed ${numCellsRevealed} ${cellOrCells}`;
      if (popFromHistory) {
        s.update('historyLog', h => h.pop());
      }
      const log = new HistoryLog(message, 'log', true, getChangedCells(oldCells, s.getIn(['minefield', 'cells'])));
      s.update('historyLog', h => h.push(log));

      // check if the game has been won, and reprocess the csp
      if (checkWinCondition(s.get('minefield'))) {
        return winGame(s);
      }
      // set the new csp model
      return processCSP(s);
    });
  }
  return state;
};

/**
 * Handles the step action by solving and advancing the csp once if possible.
 * @param state state of the board
 * @param {boolean} [isLogged] default solveCSP will be logged, false if log isn't wanted
 * @returns newState, or oldState if no changes could be made
 */
export const step = (state, isLogged = true) => {
  // if the csp model is consistent and there is at least one solvable cell, advance the csp
  if (state.getIn(['csp', 'isConsistent'])
  && state.getIn(['csp', 'solvable']).size > 0) {
    // solve the current csp
    const newState = solveCSP(state, isLogged);

    // check if the game has been lost
    if (!newState.get('isGameRunning')) {
      return newState;
    }

    // check if the game has been won and reprocess the csp
    if (checkWinCondition(newState.get('minefield'))) {
      return winGame(newState);
    }
    return processCSP(newState);
  }
  return state;
};

/**
 * Converts the change size action to a reset action.
 * @param state state of the board
 * @param {string} newSize new size to make the board
 * @return newState
 */
export const changeSize = (state, newSize) => state.withMutations(s => {
  s.updateIn(['minefield', 'cells'], c => c.setSize(newSize.rows));
  for (let i = 0; i < newSize.rows; i++) {
    s.setIn(['minefield', 'cells', i], Immutable.List().setSize(newSize.cols));
  }
  s.setIn(['minefield', 'numMines'], newSize.numMines);
  s.set('size', newSize.size);

  // reset the board
  return reset(s);
});

/**
 * Converts the cheat action into a reveal cell action.
 * @param state state of the board
 * @param {boolean} [isRandom=true] true if pick cheat cell randomly, false if prioritize unsolvable cells on the fringe
 * @returns newState
 */
export const cheat = (state, isRandom = true) => {
  let row = Math.floor(Math.random() * state.getIn(['minefield', 'cells']).size);
  let col = Math.floor(Math.random() * state.getIn(['minefield', 'cells', 0]).size);

  // if selection style is not random, prioritize the fringe
  let cellFound = false;
  if (!isRandom && state.get('isGameRunning')) {
    const solvable = new Set();
    state.getIn(['csp', 'solvable']).forEach(set => set.forEach(e => solvable.add(e.key)));
    let variables = [];
    state.getIn(['csp', 'components']).forEach(component => variables.push(...component.variables));
    variables = variables.filter(variable =>
      state.getIn(['minefield', 'cells', variable.row, variable.col, 'content']) !== -1 && !solvable.has(variable.key));
    cellFound = variables[Math.floor(Math.random() * variables.length)];
    if (cellFound) {
      row = cellFound.row;
      col = cellFound.col;
    }
  }
  // else find a random safe cell
  if (!cellFound) {
    while (!state.getIn(['minefield', 'cells', row, col, 'isHidden'])
    || state.getIn(['minefield', 'cells', row, col, 'content']) === -1) {
      row = Math.floor(Math.random() * state.getIn(['minefield', 'cells']).size);
      col = Math.floor(Math.random() * state.getIn(['minefield', 'cells', 0]).size);
    }
  }

  // reveal the cell
  return revealCell(state, row, col);
};

/**
 * Handles the default action that sets up the initial state of the board.
 * @returns initial state
 */
export const initialize = () => {
  // create the cell matrix
  const cells = Immutable.List().withMutations(c => {
    for (let i = 0; i < 16; i++) {
      const row = Immutable.List().withMutations(r => {
        for (let j = 0; j < 16; j++) {
          r.push(Immutable.Map({
            color: 0,
            content: 0,
            isFlagged: false,
            isHidden: true,
          }));
        }
      });
      c.push(row);
    }
  });

  // wrap the cells in the minefield
  const minefield = Immutable.Map({
    cells,
    numFlagged: 0,
    numMines: 40,
    numRevealed: 0,
  });

  // create the csp model
  const csp = Immutable.Map({
    algorithms: Immutable.Map({
      BT: Immutable.Map({
        subSets: Immutable.Map({
          BC: true,
          FC: true,
          'FC-STR': true,
        }),
        isActive: false,
      }),
      STR2: Immutable.Map({
        isActive: false,
      }),
      mWC: Immutable.Map({
        isActive: true,
        m: 2,
      }),
    }),
    diagnostics: Immutable.Map(),
    isConsistent: true,
    solvable: Immutable.Map(),
  });

  // return the initial state map
  return Immutable.Map({
    csp,
    historyLog: Immutable.List(),
    isGameRunning: false,
    minefield,
    size: 'INTERMEDIATE',
  });
};

/**
 * Converts the loop action into a series of step actions that advance the csp as far as possible.
 * @param state state of the board
 * @param {boolean} [isLogged] true (default) solve action will be logged, false if logging should be ignored
 * @returns newState, or oldState if no changes could be made
 */
export const loop = (state, isLogged = true) => {
  // solve the csp until step can no longer make any changes
  let oldState = state;
  let newState;
  if (oldState.getIn(['csp', 'solvable']).size > 0) {
    if (!oldState.getIn(['csp', 'count'])) {
      newState = oldState.setIn(['csp', 'count'], new Map());
    } else {
      newState = oldState;
      oldState = undefined;
    }
  } else {
    if (!isLogged) {
      return oldState.setIn(['csp', 'count'], new Map());
    }
    return oldState;
  }
  while (newState !== oldState) {
    oldState = newState;
    newState = step(oldState, false);
  }

  // record the action in the history log
  if (isLogged) {
    const numFlagged = newState.getIn(['minefield', 'numFlagged']) - state.getIn(['minefield', 'numFlagged']);
    const numRevealed = newState.getIn(['minefield', 'numRevealed']) - state.getIn(['minefield', 'numRevealed']);
    let cellOrCells = 'cells';
    if (numFlagged + numRevealed === 1) {
      cellOrCells = 'cell';
    }
    let message = `Solved ${numFlagged + numRevealed} ${cellOrCells}, ${numFlagged}[flag]`;
    const log = new HistoryLog(
      message,
      'log',
      true,
      getChangedCells(state.getIn(['minefield', 'cells']), newState.getIn(['minefield', 'cells']))
    );
    algorithms.forEach((algorithm) => {
      if (newState.getIn(['csp', 'count']).has(algorithm)) {
        const count = newState.getIn(['csp', 'count']).get(algorithm);
        cellOrCells = 'cells';
        if (count.numFlagged + count.numRevealed === 1) {
          cellOrCells = 'cell';
        }
        const detail =
          `${algorithm} solved ${count.numFlagged + count.numRevealed} ${cellOrCells}, ${count.numFlagged}[flag]`;
        log.addDetail(detail);
      }
    });
    if (newState.get('isGameRunning')) {
      newState = newState.update('historyLog', h => h.pop().push(log));
      message = 'Finds 0 solvable cells';
      newState = newState.update('historyLog', h => h.push(new HistoryLog(message, 'log', false)));
    } else {
      newState = newState.update('historyLog', h => h.push(log));
    }
    // clean up the results of the loop
    return newState.deleteIn(['csp', 'count']);
  }
  return newState;
};

/**
 * Loses the game.
 * @param state state of the board
 * @param {number} [row] row of the cell that caused the loss
 * @param {number} [col] col of the cell that caused the loss
 * @returns newState
 */
export const loseGame = (state, row, col) => state.withMutations(s => {
  if (row && col) {
    s.setIn(['minefield', 'cells', row, col, 'isHidden'], false);
  }
  s.update('minefield', m => revealMines(m));
  s.set('isGameRunning', false);
});

/**
 * Handles the test action by running the game multiple times and recording how efficiently the active algorithms solved
 * each problem.
 * @param state state of the board
 * @param {number} numIterations number of times to run the game
 * @param {boolean} allowCheats true (default) if cheats are allowed, false if processing should be stopped when cheats
 * are needed to continue
 * @param {boolean} stopOnError true if processing should be stopped on error, false (default) if failure should be
 * recorded but skipped
 * @returns newState
 */
export const test = (state, numIterations, allowCheats = true, stopOnError = false) => {
  let newState = state;
  const logs = [];
  const startTime = performance.now();
  let numRuns = 0;
  let numFails = 0;
  let totalCheats = 0;
  for (let i = 0; i < numIterations; i++) {
    numRuns++;
    try {
      // attempt to solve the puzzle
      newState = cheat(newState);
      newState = loop(newState, false);
      let numCheats = 0;
      if (allowCheats) {
        while (newState.get('isGameRunning') && newState.getIn(['csp', 'isConsistent'])) {
          newState = cheat(newState, false);
          numCheats++;
          newState = loop(newState, false);
        }
        totalCheats += numCheats;
      }

      // determine the results
      let log;
      let error = false;
      let isRed = false;

      if (newState.get('isGameRunning')) {
        isRed = true;
        numFails++;
        // stopped due to inconsistencies
        if (!newState.getIn(['csp', 'isConsistent'])) {
          const message = newState.get('historyLog').last().message;
          log = new HistoryLog(message, 'red', false);
          error = true;
        // could not solve without cheats
        } else {
          const numFlagged = newState.getIn(['minefield', 'numFlagged']);
          const numRevealed = newState.getIn(['minefield', 'numRevealed']);
          let cellOrCells = 'cells';
          if (numFlagged + numRevealed === 1) {
            cellOrCells = 'cell';
          }
          const message = `Solved ${numFlagged + numRevealed} ${cellOrCells}, ${numFlagged}[flag]`;
          log = new HistoryLog(message, 'red', false);
          log.addDetail('Cheats needed to advance further');
        }
      } else {
        // solved the puzzle
        if (checkWinCondition(newState.get('minefield'))) {
          const message = 'Successfully solved the puzzle';
          log = new HistoryLog(message, 'green', false);
        // made an error while solving
        } else {
          const message = 'Error made during solving';
          log = new HistoryLog(message, 'red', false);
          numFails++;
          error = true;
          isRed = true;
        }
      }

      newState = newState.update('historyLog', h => h.pop());
      if (isRed || numIterations <= 100) {
        newState.getIn(['csp', 'count']).forEach((counter, setKey) => {
          let cellOrCells = 'cells';
          if (counter.numFlagged + counter.numRevealed === 1) {
            cellOrCells = 'cell';
          }
          log.addDetail(
            `${setKey} solved ${counter.numFlagged + counter.numRevealed} ${cellOrCells}, ${counter.numFlagged}[flag]`
          );
        });
        if (numCheats > 0) {
          let cellOrCells = 'times';
          if (numCheats === 1) {
            cellOrCells = 'time';
          }
          log.addDetail(`Cheat used ${numCheats} ${cellOrCells}`);
        }
        logs.push(log);
        if (error && stopOnError) {
          break;
        }
      }
    } catch (e) {
      const message = 'Error thrown during solving';
      const log = new HistoryLog(message, 'red', false);
      log.addDetail(`${e.toString()}`);
      numFails++;
      logs.push(log);
      if (stopOnError) {
        throw e;
      }
    }
    newState = newState.deleteIn(['csp', 'count']);
    newState = reset(newState);
  }

  // log the results
  const accuracy = (numRuns - numFails) / numRuns * 100;
  const message = `Testing was ${Math.round(accuracy)}% successful`;
  const log = new HistoryLog(message, 'log', false);
  const executionTime = Math.round((performance.now() - startTime) / 10) / 100;
  log.addDetail(`\nExecution Time: ${executionTime} seconds`, true);
  if (allowCheats) {
    const averageCheats = Math.round(totalCheats / numRuns * 100) / 100;
    log.addDetail(`\nAverage cheats used: ${averageCheats}`, true);
  }
  logs.push(log);

  // search logging
  if (newState.getIn(['csp', 'algorithms', 'BT', 'isActive'])) {
    const search = logBT(newState.get('csp'), numRuns);
    logs.push(search);
  }

  // STR2 logging
  if (newState.getIn(['csp', 'algorithms', 'STR2', 'isActive'])) {
    const str2 = logSTR2(newState.get('csp'), numRuns);
    logs.push(str2);
  }

  // mWC logging
  if (newState.getIn(['csp', 'algorithms', 'mWC', 'isActive'])) {
    const mWC = logmWC(newState.get('csp'), numRuns);
    logs.push(mWC);
  }

  newState = newState.updateIn(['csp', 'diagnostics'], d => d.clear());
  return newState.update('historyLog', h => h.push(...logs));
};

/**
 * Handles the toggle active action by changed the active status of the specified algorithm.
 * @param state state of the board
 * @param {string} algorithm name of the algorithm to toggle
 * @param {string|number} [modifier] modifier to apply to the algorithm change
 * @returns newState
 */
export const toggleActive = (state, algorithm, modifier) => state.withMutations(s => {
  if (modifier) {
    switch (algorithm) {
      case 'BT': s.updateIn(['csp', 'algorithms', 'BT', 'subSets', modifier], a => !a); break;
      case 'mWC': s.setIn(['csp', 'algorithms', 'mWC', 'm'], modifier); break;
      default:
    }
  } else {
    s.updateIn(['csp', 'algorithms', algorithm, 'isActive'], a => !a);
  }
  if (s.get('isGameRunning')) {
    s.update('historyLog', h => h.pop());
    return processCSP(s, true);
  }
  return s;
});

/**
 * Handles the toggle flag action by changing the flag status of the cell if possible
 * @param state state of the board
 * @param {number} row row of the cell
 * @param {number} col col of the cell
 * @returns newState
 */
export const toggleFlag = (state, row, col) => {
  if (state.get('isGameRunning')) {
    return state.withMutations(s => {
      let message;

      // if the cell is not already flagged and there are flags available to be placed, place the flag
      if (!s.getIn(['minefield', 'cells', row, col, 'isFlagged'])
      && s.getIn(['minefield', 'numFlagged']) < s.getIn(['minefield', 'numMines'])) {
        s.setIn(['minefield', 'cells', row, col, 'isFlagged'], true);
        s.updateIn(['minefield', 'numFlagged'], n => n + 1);
        message = `[${row},${col}] flagged`;

      // else if the cell is already flagged, remove the flag
      } else if (s.getIn(['minefield', 'cells', row, col, 'isFlagged'])) {
        s.setIn(['minefield', 'cells', row, col, 'isFlagged'], false);
        s.updateIn(['minefield', 'numFlagged'], n => n - 1);
        message = `[${row},${col}] unflagged`;
      }

      // record the event in the history log and reprocess the csp
      s.update('historyLog', h => h.pop().push(new HistoryLog(message, 'log', true)));
      return processCSP(s);
    });
  }
  return state;
};
