import { Actions } from 'enums';

export const changeSize = newSize => ({
  type: Actions.CHANGE_SIZE,
  newSize,
});

export const cheat = isRandom => ({
  type: Actions.CHEAT,
  isRandom,
});

export const loop = () => ({
  type: Actions.LOOP,
});

export const loseGame = (row, col) => ({
  type: Actions.LOSE_GAME,
  col,
  row,
});

export const reset = () => ({
  type: Actions.RESET,
});

export const revealCell = (row, col) => ({
  type: Actions.REVEAL_CELL,
  col,
  row,
});

export const step = () => ({
  type: Actions.STEP,
});

export const test = (numIterations, allowCheats, stopOnError) => ({
  type: Actions.TEST,
  allowCheats,
  numIterations,
  stopOnError,
});

export const toggleActive = (algorithm, modifier) => ({
  type: Actions.TOGGLE_ACTIVE,
  algorithm,
  modifier,
});

export const toggleFlag = (row, col) => ({
  type: Actions.TOGGLE_FLAG,
  col,
  row,
});
