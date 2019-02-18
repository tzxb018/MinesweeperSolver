import { Actions } from 'enums';

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
