export const CHANGE_SIZE = 'CHANGE_SIZE';
export const CHANGE_SMILE = 'CHANGE_SMILE';
export const CHEAT = 'CHEAT';
export const LOOP = 'LOOP';
export const RESET_BOARD = 'RESET_BOARD';
export const REVEAL_CELL = 'REVEAL_CELL';
export const STEP = 'STEP';
export const TOGGLE_ACTIVE = 'TOGGLE_ACTIVE';
export const TOGGLE_FLAG = 'TOGGLE_FLAG';
export const TOGGLE_PEEK = 'PEEK';

export const changeSize = newSize => ({
  type: CHANGE_SIZE,
  newSize,
});

export const changeSmile = newSmile => ({
  type: CHANGE_SMILE,
  newSmile,
});

export const cheat = () => ({
  type: CHEAT,
});

export const loop = () => ({
  type: LOOP,
});

export const peek = () => ({
  type: TOGGLE_PEEK,
});

export const resetBoard = () => ({
  type: RESET_BOARD,
});

export const revealCell = (row, col) => ({
  type: REVEAL_CELL,
  col,
  row,
});

export const step = () => ({
  type: STEP,
});

export const toggleActive = name => ({
  type: TOGGLE_ACTIVE,
  name,
});

export const toggleFlag = (row, col) => ({
  type: TOGGLE_FLAG,
  col,
  row,
});
