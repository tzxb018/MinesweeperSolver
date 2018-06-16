import Immutable from 'immutable';

import processCSP from './cspUtils/index';
import solveCSP from './cspUtils/solve';
import {
  checkWinCondition,
  flagMines,
  getChangedCells,
  placeMines,
  revealMines,
  revealNeighbors,
} from './cellUtils';

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
  s.setIn(['csp', 'constraints'], []);
  s.setIn(['csp', 'isConsistent'], true);
  s.setIn(['csp', 'variables'], []);
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
 * @param row row of the cell
 * @param col col of the cell
 * @returns newState
 */
export const revealCell = (state, row, col) => {
  // if there are no mines already, place mines and start the game
  let oldCells = state.getIn(['minefield', 'cells']);
  let newState = state;
  if (newState.getIn(['minefield', 'numRevealed']) === 0) {
    newState = newState.updateIn(['minefield', 'cells'], c =>
      placeMines(c, newState.getIn(['minefield', 'numMines']), row, col));
    newState = newState.set('isGameRunning', true);
    oldCells = newState.getIn(['minefield', 'cells']);
  }

  // if the game is running, reveal the cell, else do nothing and return the old state
  if (newState.get('isGameRunning')) {
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
      const logString = `Revealed ${numCellsRevealed} cell(s) at [${row}, ${col}]`;
      s.update('historyLog', h => h.pop().push({
        cells: getChangedCells(oldCells, s.getIn(['minefield', 'cells'])),
        message: logString,
      }));

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
 * @param isLogged default solveCSP will be logged, false if log isn't wanted (optional)
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
 * @param newSize new size to make the board
 * @return newState
 */
export const changeSize = (state, newSize) => state.withMutations(s => {
  // change size settings based on new size
  let numRows;
  let numCols;
  let numMines;
  switch (newSize) {
  case 'beginner':
    numRows = 9;
    numCols = 9;
    numMines = 10;
    break;
  case 'expert':
    numRows = 16;
    numCols = 30;
    numMines = 99;
    break;
  default:
    numRows = 16;
    numCols = 16;
    numMines = 40;
  }
  s.updateIn(['minefield', 'cells'], c => c.setSize(numRows));
  for (let i = 0; i < numRows; i++) {
    s.setIn(['minefield', 'cells', i], Immutable.List().setSize(numCols));
  }
  s.setIn(['minefield', 'numMines'], numMines);
  s.set('size', newSize);

  // reset the board
  return reset(s);
});

/**
 * Converts the cheat action into a reveal cell action.
 * @param state state of the board
 * @returns newState
 */
export const cheat = state => {
  if (state.get('isGameRunning') || state.getIn(['minefield', 'numRevealed']) === 0) {
    // pick a random cell that can be safely revealed
    let row = Math.floor(Math.random() * state.getIn(['minefield', 'cells']).size);
    let col = Math.floor(Math.random() * state.getIn(['minefield', 'cells', 0]).size);
    while (!state.getIn(['minefield', 'cells', row, col, 'isHidden'])
    || state.getIn(['minefield', 'cells', row, col, 'content']) === -1) {
      row = Math.floor(Math.random() * state.getIn(['minefield', 'cells']).size);
      col = Math.floor(Math.random() * state.getIn(['minefield', 'cells', 0]).size);
    }

    // reveal the cell
    return revealCell(state, row, col);
  }
  return state;
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
    constraints: [],
    isActive: Immutable.Map({
      PWC: true,
      STR: true,
      Unary: true,
    }),
    isConsistent: true,
    solvable: Immutable.Map(),
    variables: [],
  });

  // return the initial state map
  return Immutable.Map({
    csp,
    historyLog: Immutable.List(),
    isGameRunning: false,
    minefield,
    size: 'intermediate',
  });
};

/**
 * Converts the loop action into a series of step actions that advance the csp as far as possible.
 * @param state state of the board
 * @returns newState, or oldState if no changes could be made
 */
export const loop = state => {
  // solve the csp until step can no longer make any changes
  let oldState = state;
  let newState;
  if (oldState.getIn(['csp', 'solvable']).size > 0) {
    newState = state.setIn(['csp', 'count'], new Map());
  } else {
    return oldState;
  }
  while (newState !== oldState) {
    oldState = newState;
    newState = step(oldState, false);
  }

  // record the action in the history log
  const numFlagged = newState.getIn(['minefield', 'numFlagged']) - state.getIn(['minefield', 'numFlagged']);
  const numRevealed = newState.getIn(['minefield', 'numRevealed']) - state.getIn(['minefield', 'numRevealed']);
  let logString = `Flagged ${numFlagged} mine(s) and revealed ${numRevealed} cell(s)`;
  newState.getIn(['csp', 'count']).forEach((counter, setKey) => {
    logString += `\n\t ${setKey} flagged ${counter.numFlagged} mine(s) and revealed ${counter.numRevealed} cell(s)`;
  });
  if (newState.get('isGameRunning')) {
    newState = newState.update('historyLog', h => h.pop().push({
      cells: getChangedCells(state.getIn(['minefield', 'cells']), newState.getIn(['minefield', 'cells'])),
      message: logString,
    }));
    logString = 'Found 0 solvable cell(s)';
    newState = newState.update('historyLog', h => h.push({
      cells: [],
      message: logString,
    }));
  } else {
    newState = newState.update('historyLog', h => h.push({
      cells: getChangedCells(state.getIn(['minefield', 'cells']), newState.getIn(['minefield', 'cells'])),
      message: logString,
    }));
  }

  // clean up the results of the loop
  return newState.deleteIn(['csp', 'count']);
};

/**
 * Loses the game.
 * @param state state of the board
 * @param row row of the cell that caused the loss (optional)
 * @param col col of the cell that caused the loss (optional)
 * @returns newState
 */
export const loseGame = (state, row = undefined, col = undefined) => state.withMutations(s => {
  if (row !== undefined && col !== undefined) {
    s.setIn(['minefield', 'cells', row, col, 'isHidden'], false);
  }
  s.update('minefield', m => revealMines(m));
  s.set('isGameRunning', false);
});

/**
 * Handles the toggle active action by changed the active status of the specified algorithm.
 * @param state state of the board
 * @param algorithm name of the algorithm to toggle
 * @returns newState
 */
export const toggleActive = (state, algorithm) => state.withMutations(s => {
  switch (algorithm) {
  case 'Unary': s.updateIn(['csp', 'isActive', 'Unary'], a => !a); break;
  case 'STR': s.updateIn(['csp', 'isActive', 'STR'], a => !a); break;
  case 'PWC': s.updateIn(['csp', 'isActive', 'PWC'], a => !a); break;
  default:
  }
  if (s.get('gameIsRunning')) {
    s.update('historyLog', h => h.pop());
    return processCSP(s);
  }
  return s;
});

/**
 * Handles the toggle flag action by changing the flag status of the cell if possible
 * @param state state of the board
 * @param row row of the cell
 * @param col col of the cell
 * @returns newState
 */
export const toggleFlag = (state, row, col) => {
  if (state.get('isGameRunning')) {
    return state.withMutations(s => {
      let logString;

      // if the cell is not already flagged and there are flags available to be placed, place the flag
      if (!s.getIn(['minefield', 'cells', row, col, 'isFlagged'])
      && s.getIn(['minefield', 'numFlagged']) < s.getIn(['minefield', 'numMines'])) {
        s.setIn(['minefield', 'cells', row, col, 'isFlagged'], true);
        s.updateIn(['minefield', 'numFlagged'], n => n + 1);
        logString = `Flagged cell at [${row}, ${col}]`;

      // else if the cell is already flagged, remove the flag
      } else if (s.getIn(['minefield', 'cells', row, col, 'isFlagged'])) {
        s.setIn(['minefield', 'cells', row, col, 'isFlagged'], false);
        s.updateIn(['minefield', 'numFlagged'], n => n - 1);
        logString = `Unflagged cell at [${row}, ${col}]`;
      }

      // record the event in the history log and reprocess the csp
      s.update('historyLog', h => h.pop().push({
        cells: [{ col, row }],
        message: logString,
      }));
      return processCSP(s);
    });
  }
  return state;
};