import undoable, { excludeAction } from 'redux-undo';

import {
  CHANGE_SIZE,
  RESET_BOARD,
  CHANGE_SMILE,
 } from 'actions/boardActions';

import board from './board';

export default undoable(board, {
  filter: excludeAction(CHANGE_SMILE),
  initTypes: [CHANGE_SIZE, RESET_BOARD],
});
