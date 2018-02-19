import undoable, { excludeAction } from 'redux-undo';

import {
  CHANGE_SIZE,
  RESET_BOARD,
  REVEAL_CELL,
 } from 'actions/boardActions';

import board from './board';

const undoableBoard = undoable(board, {
  filter: excludeAction([CHANGE_SIZE, REVEAL_CELL]),
  initTypes: [CHANGE_SIZE, RESET_BOARD],
});

export default undoableBoard;
