import { combineReducers } from 'redux';

import board from './board.js';
import constraints from './constraints';

const reducer = combineReducers({
  board,
  constraints,
});
export default reducer;
