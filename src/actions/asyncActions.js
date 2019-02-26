import { Actions } from 'enums';

export const reportErrorEnd = response => ({
  type: Actions.REPORT_ERROR_END,
  response,
});

export const reportErrorStart = () => ({
  type: Actions.REPORT_ERROR_START,
});

export const reportErrorTimeout = () => ({
  type: Actions.REPORT_ERROR_TIMEOUT,
});

export const loadStart = () => ({
  type: Actions.LOAD_START,
});

export const loadEnd = (xmlDoc, filename) => ({
  type: Actions.LOAD_END,
  filename,
  xmlDoc,
});

export const loadFail = error => ({
  type: Actions.LOAD_FAIL,
  error,
});

export const testStart = () => ({
  type: Actions.TEST_START,
});

export const testEnd = newState => ({
  type: Actions.TEST_END,
  newState,
});
