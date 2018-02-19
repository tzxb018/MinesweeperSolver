import { combineReducers } from 'redux';

import board from './undoableBoard';

const reducer = combineReducers({
  board,
});

export default reducer;
