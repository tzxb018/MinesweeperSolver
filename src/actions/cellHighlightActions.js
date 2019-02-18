import { Actions } from 'enums';

export const clear = () => ({
  type: Actions.CLEAR,
});

export const highlight = cells => ({
  type: Actions.HIGHLIGHT,
  cells,
});
