import undoable from 'redux-undo';

import { loadXMLDocument } from 'objects/XMLParser';
import { Actions } from 'enums';
import {
  changeSize,
  cheat,
  initialize,
  loop,
  loadFail,
  logErrorReport,
  loseGame,
  reset,
  revealCell,
  step,
  toggleActive,
  toggleFlag,
} from './reducerFunctions';
import { postResults } from './testFunctions';

const initialState = initialize();

/**
 * Reducer for the board
 * @param {Immutable.Map<string, any>} state Redux state
 * @param {{type: string, ...}} action Redux action thrown
 * @returns {Immutable.Map<string, any>} updated state
 */
const board = (state = initialState, action) => {
  switch (action.type) {
    case Actions.CHANGE_SIZE: return changeSize(state, action.newSize);
    case Actions.CHEAT: return cheat(state, action.isRandom);
    case Actions.LOOP: return loop(state);
    case Actions.LOAD_END: return loadXMLDocument(state, action.xmlDoc, action.filename);
    case Actions.LOAD_FAIL: return loadFail(state, action.error);
    case Actions.LOSE_GAME: return loseGame(state, action.row, action.col);
    case Actions.RESET: return reset(state);
    case Actions.REVEAL_CELL: return revealCell(state, action.row, action.col);
    case Actions.REPORT_ERROR_END: return logErrorReport(state, action.response);
    case Actions.STEP: return step(state);
    case Actions.TEST_END: return postResults(state, action.newState);
    case Actions.TOGGLE_ACTIVE: return toggleActive(state, action.algorithm, action.modifier);
    case Actions.TOGGLE_FLAG: return toggleFlag(state, action.row, action.col);
    default: return state;
  }
};

export default undoable(board, {
  clearHistoryType: ['CHANGE_SIZE', 'RESET'],
  neverSkipReducer: true,
});
