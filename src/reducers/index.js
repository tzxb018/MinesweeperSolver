import { combineReducers } from 'redux';

import board from './board/';
import {
  reportError,
  isLoading,
  isTesting,
} from './async';
import {
  isPeeking,
  smile,
  timer,
} from './misc';
import cellHighlight from './cellHighlight';

export default combineReducers({
  board,
  cellHighlight,
  isLoading,
  isPeeking,
  isTesting,
  reportError,
  smile,
  timer,
});
