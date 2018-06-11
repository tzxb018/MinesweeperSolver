import Immutable from 'immutable';

import {
  changeSize,
  cheat,
  loop,
  loseGame,
  reset,
  revealCell,
  step,
  toggleFlag,
} from './reducerFunctions';
import processCSP from './cspUtils/index.js';

// default state
let cells = Immutable.List();
cells = cells.set('numFlagged', 0);
for (let i = 0; i < 16; i++) {
  let row = Immutable.List();
  for (let j = 0; j < 16; j++) {
    row = row.push(Immutable.Map({
      color: 0,
      content: 0,
      isFlagged: false,
      isHidden: true,
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
  historyLog: Immutable.List(),
  isGameRunning: false,
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
  case 'CHANGE_SIZE': return changeSize(state, action.newSize);

  // changes the smile
  case 'CHANGE_SMILE': return state.set('smile', action.newSmile);

  // reveals a random open cell
  case 'CHEAT': return cheat(state);

  // solves and advances the csp model until it can't go any further or the game ends
  case 'LOOP': return loop(state);

  // stops the game when it has been lost
  case 'LOSE_GAME': return loseGame(state, action.row, action.col);

  // resets the board
  case 'RESET': return reset(state);

  // reveals the clicked cell
  case 'REVEAL_CELL': return revealCell(state, action.row, action.col);

  // solves the current csp model and advances it
  case 'STEP': return step(state);

  // toggles the active algorithms
  case 'TOGGLE_ACTIVE':
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

  // toggles the flag of the cell
  case 'TOGGLE_FLAG': return toggleFlag(state, action.row, action.col);

  // toggles the peeking feature
  case 'TOGGLE_PEEK': return state.update('isPeeking', isPeeking => !isPeeking);

  default:
    return state;
  }
};
