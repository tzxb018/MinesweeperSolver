import {
  changeSize,
  cheat,
  initialize,
  loop,
  loseGame,
  reset,
  revealCell,
  step,
  test,
  toggleActive,
  toggleFlag,
} from './reducerFunctions';

const initialState = initialize();

/**
 * Reducer for the board
 * @param {Immutable.Map<string, any>} state Redux state
 * @param {{type: string, ...}} action Redux action thrown
 * @returns {Immutable.Map<string, any>} updated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
  case 'CHANGE_SIZE': return changeSize(state, action.newSize);
  case 'CHEAT': return cheat(state);
  case 'LOOP': return loop(state);
  case 'LOSE_GAME': return loseGame(state, action.row, action.col);
  case 'RESET': return reset(state);
  case 'REVEAL_CELL': return revealCell(state, action.row, action.col);
  case 'STEP': return step(state);
  case 'TEST': return test(state, action.numIterations);
  case 'TOGGLE_ACTIVE': return toggleActive(state, action.algorithm);
  case 'TOGGLE_FLAG': return toggleFlag(state, action.row, action.col);
  default: return state;
  }
};
