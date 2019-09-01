import { Actions } from 'enums';

export const changeSmile = newSmile => ({
  type: Actions.CHANGE_SMILE,
  newSmile,
});

export const increment = () => ({
  type: Actions.INCREMENT,
});

export const start = newTimer => ({
  type: Actions.START,
  newTimer,
});

export const stop = () => ({
  type: Actions.STOP,
});

export const togglePeek = () => ({
  type: Actions.TOGGLE_PEEK,
});
