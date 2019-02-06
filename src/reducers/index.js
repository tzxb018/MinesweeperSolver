import { combineReducers } from 'redux';

import board from './board/undoableBoard';
import cellHighlight from './cellHighlight';
import isPeeking from './peek';
import load from './load';
import smile from './smile';
import timer from './timer';

const reducer = combineReducers({
  board,
  cellHighlight,
  isPeeking,
  load,
  smile,
  timer,
});

export default reducer;
