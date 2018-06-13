import {
  changeSize,
  cheat,
  initialize,
  loop,
  loseGame,
  reset,
  revealCell,
  step,
  toggleActive,
  toggleFlag,
} from './reducerFunctions';

const initialState = initialize();

/**
 * Reducer for the board
 * @param state Redux state
 * @param action Redux action thrown
 * @returns updated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
  case 'CHANGE_SIZE': return changeSize(state, action.newSize);
  case 'CHANGE_SMILE': return state.set('smile', action.newSmile);
  case 'CHEAT': return cheat(state);
  case 'LOOP': return loop(state);
  case 'LOSE_GAME': return loseGame(state, action.row, action.col);
  case 'RESET': return reset(state);
  case 'REVEAL_CELL': return revealCell(state, action.row, action.col);
  case 'STEP': return step(state);
  case 'TOGGLE_ACTIVE': return toggleActive(state, action.algorithm);
  case 'TOGGLE_FLAG': return toggleFlag(state, action.row, action.col);
  case 'TOGGLE_PEEK': return state.update('isPeeking', isPeeking => !isPeeking);
  default: return state;
  }
};
