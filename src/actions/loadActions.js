import { Actions } from 'enums';

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
