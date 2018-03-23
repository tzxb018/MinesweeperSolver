import undoable, { excludeAction } from 'redux-undo';

import {
  CHANGE_SIZE,
  RESET_BOARD,
  CHANGE_SMILE,
 } from 'actions/boardActions';

import board from './board';

export default undoable(board, {
  clearHistoryType: [CHANGE_SIZE, RESET_BOARD],
  filter: excludeAction(CHANGE_SMILE),
  neverSkipReducer: true,
});
