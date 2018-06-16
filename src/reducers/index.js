import { combineReducers } from 'redux';

import board from './board/undoableBoard';
import isPeeking from './peek';
import smile from './smile';
import timer from './timer';

const reducer = combineReducers({
  board,
  isPeeking,
  smile,
  timer,
});

export default reducer;
