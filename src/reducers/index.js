import { combineReducers } from 'redux';

import board from './board/';
import {
  canReportError,
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
  canReportError,
  cellHighlight,
  isLoading,
  isPeeking,
  isTesting,
  smile,
  timer,
});
