import undoable, { excludeAction } from 'redux-undo';

import board from './index.js';

export default undoable(board, {
  clearHistoryType: ['CHANGE_SIZE', 'RESET'],
  filter: excludeAction(['CHANGE_SIZE', 'RESET']),
  neverSkipReducer: true,
});
