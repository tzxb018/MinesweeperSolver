import undoable from 'redux-undo';

import board from './index.js';

export default undoable(board, {
  clearHistoryType: ['CHANGE_SIZE', 'RESET'],
  neverSkipReducer: true,
});
