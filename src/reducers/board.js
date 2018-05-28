import Immutable from 'immutable';

import {
  CHANGE_SIZE,
  CHANGE_SMILE,
  CHEAT,
  LOOP,
  RESET_BOARD,
  REVEAL_CELL,
  STEP,
  TOGGLE_ACTIVE,
  TOGGLE_FLAG,
  TOGGLE_PEEK,
} from 'actions/boardActions';

import {
  changeSize,
  checkLossCondition,
  checkWinCondition,
  loseGame,
  placeMines,
  revealCell,
  winGame,
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
    isActive: Immutable.Map({
      Unary: true,
      STR: true,
      PWC: true,
    }),
    isConsistent: true,
    solvable: Immutable.Map(),
    variables: [],
  }),
  gameIsRunning: false,
  hasMines: false,
  historyLog: Immutable.List(),
  isPeeking: false,
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

  // changes the board size
  case CHANGE_SIZE:
    return changeSize(state, action.newSize);

  // changes the smile
  case CHANGE_SMILE:
    return state.set('smile', action.newSmile);

  // reveals a random open cell
  case CHEAT:
    if (state.get('gameIsRunning') || !state.get('hasMines')) {
      return state.withMutations(s => {
        let row = Math.floor(Math.random() * s.getIn(['minefield', 'cells']).size);
        let col = Math.floor(Math.random() * s.getIn(['minefield', 'cells', 0]).size);
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
        // post the action to the history log
        const oldNumRevealed = s.getIn(['minefield', 'numRevealed']);
        s.update('minefield', m => revealCell(m, row, col));
        const numCellsRevealed = s.getIn(['minefield', 'numRevealed']) - oldNumRevealed;
        const logString = `Cheat revealed ${numCellsRevealed} cell(s) at [${row}, ${col}]`;
        s.update('historyLog', h => h.push(logString));
        if (checkWinCondition(s.get('minefield'), s.get('numMines'))) {
          return winGame(s);
        }
        return processCSP(s);
      });
    }
    return state;

  // solves and advances the csp model until it can't go any further
  case LOOP:
    if (state.get('gameIsRunning')
    && state.getIn(['csp', 'isConsistent'])
    && state.getIn(['csp', 'solvable']).size > 0) {
      let newState = state;
      while (newState.getIn(['csp', 'isConsistent'])
      && newState.getIn(['csp', 'solvable']).size > 0) {
        newState = solveCSP(newState);
        if (checkWinCondition(newState.get('minefield'), newState.get('numMines'))) {
          return winGame(newState);
        }
        newState = processCSP(newState);
      }
      return newState;
    }
    return state;

  // toggles the peeking feature
  case TOGGLE_PEEK:
    return state.update('isPeeking', isPeeking => !isPeeking);

  // resets the board
  case RESET_BOARD:
    if (!state.get('hasMines')) {
      return state.set('smile', 'SMILE');
    }
    return state.withMutations(s => {
      s.deleteIn(['csp', 'components']);
      s.setIn(['csp', 'constraints'], []);
      s.setIn(['csp', 'isConsistent'], true);
      s.setIn(['csp', 'variables'], []);
      s.updateIn(['csp', 'solvable'], o => o.clear());
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
      s.update('historyLog', h => h.clear());
      s.setIn(['minefield', 'numFlagged'], 0);
      s.setIn(['minefield', 'numRevealed'], 0);
      s.set('smile', 'SMILE');
    });

  // reveals the clicked cell
  case REVEAL_CELL:
    if (state.get('gameIsRunning') || !state.get('hasMines')) {
      return state.withMutations(s => {
        // if there are no mines already, place mines and start the game
        if (!s.get('hasMines')) {
          s.updateIn(['minefield', 'cells'], c => placeMines(c, s.get('numMines'), action.row, action.col));
          s.set('gameIsRunning', true);
          s.set('hasMines', true);
        }
        // post the action to the history log
        const oldNumRevealed = s.getIn(['minefield', 'numRevealed']);
        s.update('minefield', m => revealCell(m, action.row, action.col));
        const numCellsRevealed = s.getIn(['minefield', 'numRevealed']) - oldNumRevealed;
        const logString = `User revealed ${numCellsRevealed} cell(s) at [${action.row}, ${action.col}]`;
        s.update('historyLog', h => h.push(logString));
        s.set('smile', 'SMILE');
        // check the end conditions
        if (checkWinCondition(s.get('minefield'), s.get('numMines'))) {
          return winGame(s);
        }
        if (checkLossCondition(s.get('minefield'), action.row, action.col)) {
          return loseGame(s);
        }
        // set the new csp model
        return processCSP(s);
      });
    }
    return state;

  // solves the current csp model and advances it
  case STEP:
    if (state.get('gameIsRunning')
    && state.getIn(['csp', 'isConsistent'])
    && state.getIn(['csp', 'solvable']).size > 0) {
      const newState = solveCSP(state);
      if (checkWinCondition(newState.get('minefield'), newState.get('numMines'))) {
        return winGame(newState);
      }
      return processCSP(newState);
    }
    return state;

  // toggles the flag of the cell
  case TOGGLE_FLAG:
    if (state.get('gameIsRunning')) {
      return state.withMutations(s => {
        if (!s.getIn(['minefield', 'cells', action.row, action.col, 'flagged'])
            && s.getIn(['minefield', 'numFlagged']) < s.get('numMines')) {
          s.setIn(['minefield', 'cells', action.row, action.col, 'flagged'], true);
          s.updateIn(['minefield', 'numFlagged'], n => n + 1);
          const logString = `User flagged cell at [${action.row}, ${action.col}]`;
          s.update('historyLog', h => h.push(logString));
        } else if (s.getIn(['minefield', 'cells', action.row, action.col, 'flagged'])) {
          s.setIn(['minefield', 'cells', action.row, action.col, 'flagged'], false);
          s.updateIn(['minefield', 'numFlagged'], n => n - 1);
          const logString = `User unflagged cell at [${action.row}, ${action.col}]`;
          s.update('historyLog', h => h.push(logString));
        }
        return processCSP(s);
      });
    }
    return state;

  // toggles the active algorithms
  case TOGGLE_ACTIVE:
    return state.withMutations(s => {
      switch (action.name) {
      case 'Unary':
        s.updateIn(['csp', 'isActive', 'Unary'], a => !a);
        break;
      case 'STR':
        s.updateIn(['csp', 'isActive', 'STR'], a => !a);
        break;
      case 'PWC':
        s.updateIn(['csp', 'isActive', 'PWC'], a => !a);
        break;
      default:
      }
      if (s.get('gameIsRunning')) {
        s.update('historyLog', h => h.pop());
        return processCSP(s);
      }
      return s;
    });
  default:
    return state;
  }
};
