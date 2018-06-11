import undoable, { excludeAction } from 'redux-undo';

import {
  CHANGE_SIZE,
  CHANGE_SMILE,
  RESET_BOARD,
  TOGGLE_PEEK,
 } from 'actions/boardActions';

import board from './board/index.js';

export default undoable(board, {
  clearHistoryType: [CHANGE_SIZE, RESET_BOARD],
  filter: excludeAction([CHANGE_SMILE, TOGGLE_PEEK]),
  neverSkipReducer: true,
});
