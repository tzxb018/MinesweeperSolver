import Immutable from 'immutable';

import processCSP from './cspUtils/index';
import solveCSP from './cspUtils/solve';
import {
  checkWinCondition,
  getChangedCells,
  placeMines,
  revealMines,
  revealNeighbors,
  winGame,
} from '../utils/cellUtils';

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
  s.set('smile', 'SMILE');
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
  let newState = state;
  if (newState.getIn(['minefield', 'numRevealed']) === 0) {
    newState = newState.updateIn(['minefield', 'cells'], c => placeMines(c, newState.get('numMines'), row, col));
    newState = newState.set('isGameRunning', true);
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
        cells: getChangedCells(state.getIn(['minefield', 'cells']), s.getIn(['minefield', 'cells'])),
        message: logString,
      }));
      s.set('smile', 'SMILE');

      // check if the game has been won, and reprocess the csp
      if (checkWinCondition(s.get('minefield'), s.get('numMines'))) {
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
 * @param isLogged default solveCSP will be logged, false if log isn't wanted
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
    if (checkWinCondition(newState.get('minefield'), newState.get('numMines'))) {
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
  s.updateIn(['minefield', 'cells', 0], c => c.setSize(numCols));
  s.set('numMines', numMines);
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
};

/**
 * Converts the loop action into a series of step actions that advance the csp as far as possible.
 * @param state state of the board
 * @returns newState, or oldState if no changes could be made
 */
export const loop = state => {
  // solve the csp until step can no longer make any changes
  let oldState = state;
  let newState = state.setIn(['csp', 'count'], new Map());
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
  newState = newState.update('historyLog', h => h.pop().push({
    cells: getChangedCells(state.getIn(['minefield', 'cells']), newState.getIn(['minefield', 'cells'])),
    message: logString,
  }));

  // clean up the results of the loop
  return newState.deleteIn(['csp', 'count']);
};

/**
 * Loses the game.
 * @param state state of the board
 * @param row row of the cell that caused the loss
 * @param col col of the cell that caused the loss
 * @returns newState
 */
export const loseGame = (state, row, col) => state.withMutations(s => {
  s.setIn(['minefield', 'cells', row, col, 'isHidden'], false);
  s.updateIn(['minefield', 'cells'], c => revealMines(c));
  s.set('gameIsRunning', false);
  s.set('smile', 'LOST');
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
      && s.getIn(['minefield', 'numFlagged']) < s.get('numMines')) {
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
