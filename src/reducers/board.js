import Immutable from 'immutable';

import {
  CASCADE,
  CHANGE_SIZE,
  CHANGE_SMILE,
  PEEK,
  RESET_BOARD,
  REVEAL_CELL,
  STEP,
  TOGGLE_FLAG,
} from 'actions/boardActions';

import {
  changeSize,
  checkLossCondition,
  checkWinCondition,
  placeMines,
  revealCell,
} from './utils/cellUtils';
import solveCSP from './csp/solve';
import processCSP from './csp/index.js';

// default state
let cells = Immutable.List();
cells = cells.set('numFlagged', 0);
for (let i = 0; i < 16; i++) {
  let row = Immutable.List();
  for (let j = 0; j < 16; j++) {
    row = row.push(Immutable.Map({
      component: 0,
      flagged: false,
      hidden: true,
      mines: 0,
    }));
  }
  cells = cells.push(row);
}
const initialState = Immutable.Map({
  csp: Immutable.Map({
    constraints: [],
    isConsistent: true,
    solvable: Immutable.List(),
    variables: [],
  }),
  gameIsRunning: false,
  hasMines: false,
  minefield: Immutable.Map({
    cells,
    numFlagged: 0,
    numRevealed: 0,
  }),
  numMines: 40,
  size: 'intermediate',
  smile: 'SMILE',
});

/**
 * Reducer for the board
 * @param state Redux state
 * @param action Redux action thrown
 * @returns updated state
 */
export default (state = initialState, action) => {
  switch (action.type) {

  // solves and advances the csp model until it can't go any further
  case CASCADE:
    if (state.get('gameIsRunning')
    && state.getIn(['csp', 'isConsistent'])
    && state.getIn(['csp', 'solvable']).size > 0) {
      let newState = state;
      while (newState.get('gameIsRunning')
      && newState.getIn(['csp', 'isConsistent'])
      && newState.getIn(['csp', 'solvable']).size > 0) {
        newState = solveCSP(newState);
        newState = checkWinCondition(newState);
        newState = processCSP(newState);
      }
      return newState;
    }
    return state;

  // changes the board size
  case CHANGE_SIZE:
    return changeSize(state, action.newSize);

  // changes the smile
  case CHANGE_SMILE:
    return state.set('smile', action.newSmile);

  // reveals a random open cell
  case PEEK:
    if (state.get('gameIsRunning') || !state.get('hasMines')) {
      const newState = state.withMutations(s => {
        let row = Math.floor(Math.random() * state.getIn(['minefield', 'cells']).size);
        let col = Math.floor(Math.random() * state.getIn(['minefield', 'cells', 0]).size);
        // if there are no mines already, place mines and start the game
        if (!s.get('hasMines')) {
          s.updateIn(['minefield', 'cells'], c => placeMines(c, s.get('numMines'), row, col));
          s.set('gameIsRunning', true);
          s.set('hasMines', true);
        } else {
          while (!s.getIn(['minefield', 'cells', row, col, 'hidden'])
              || s.getIn(['minefield', 'cells', row, col, 'mines']) === -1) {
            row = Math.floor(Math.random() * s.getIn(['minefield', 'cells']).size);
            col = Math.floor(Math.random() * s.getIn(['minefield', 'cells', 0]).size);
          }
        }
        s.update('minefield', m => revealCell(m, row, col));
        return checkWinCondition(s);
      });
      if (newState.get('gameIsRunning')) {
        return processCSP(newState);
      }
      return newState;
    }
    return state;

  // resets the board
  case RESET_BOARD:
    if (!state.get('hasMines')) {
      return state.set('smile', 'SMILE');
    }
    return state.withMutations(s => {
      s.set('csp', Immutable.Map({
        constraints: [],
        solvable: Immutable.List(),
        variables: [],
      }));
      for (let i = 0; i < s.getIn(['minefield', 'cells']).size; i++) {
        for (let j = 0; j < s.getIn(['minefield', 'cells', 0]).size; j++) {
          s.setIn(['minefield', 'cells', i, j], Immutable.Map({
            component: 0,
            flagged: false,
            hidden: true,
            mines: 0,
          }));
        }
      }
      s.set('gameIsRunning', false);
      s.set('hasMines', false);
      s.setIn(['minefield', 'numFlagged'], 0);
      s.setIn(['minefield', 'numRevealed'], 0);
      s.set('smile', 'SMILE');
    });

  // reveals the clicked cell
  case REVEAL_CELL:
    if (state.get('gameIsRunning') || !state.get('hasMines')) {
      let newState = state.withMutations(s => {
        // if there are no mines already, place mines and start the game
        if (!s.get('hasMines')) {
          s.updateIn(['minefield', 'cells'], c => placeMines(c, s.get('numMines'), action.row, action.col));
          s.set('gameIsRunning', true);
          s.set('hasMines', true);
        }
        s.update('minefield', m => revealCell(m, action.row, action.col));
        s.set('smile', 'SMILE');
      });
      // check the end conditions
      newState = checkWinCondition(newState);
      newState = checkLossCondition(newState, action.row, action.col);
      // if the game isn't over then make the csp model
      if (newState.get('gameIsRunning')) {
        return processCSP(newState);
      }
      return newState;
    }
    return state;

  // solves the current csp model and advances it
  case STEP:
    if (state.get('gameIsRunning')
        && state.getIn(['csp', 'isConsistent'])
        && state.getIn(['csp', 'solvable']).size > 0) {
      let newState = solveCSP(state);
      newState = checkWinCondition(newState);
      if (newState.get('gameIsRunning')) {
        return processCSP(newState);
      }
      return newState;
    }
    return state;

  // toggles the flag of the cell
  case TOGGLE_FLAG:
    return state.withMutations(s => {
      if (s.get('gameIsRunning') === true) {
        if (s.getIn(['minefield', 'cells', action.row, action.col, 'flagged']) === false
            && s.getIn(['minefield', 'numFlagged']) < s.get('numMines')) {
          s.setIn(['minefield', 'cells', action.row, action.col, 'flagged'], true);
          s.updateIn(['minefield', 'numFlagged'], n => n + 1);
        } else if (s.getIn(['minefield', 'cells', action.row, action.col, 'flagged']) === true) {
          s.setIn(['minefield', 'cells', action.row, action.col, 'flagged'], false);
          s.updateIn(['minefield', 'numFlagged'], n => n - 1);
        }
      }
    });

  default:
    return state;
  }
};
