export const CHANGE_SIZE = 'CHANGE_SIZE';
export const CHANGE_SMILE = 'CHANGE_SMILE';
export const CSP = 'CSP';
export const PEEK = 'PEEK';
export const RESET_BOARD = 'RESET_BOARD';
export const REVEAL_CELL = 'REVEAL_CELL';
export const TOGGLE_FLAG = 'TOGGLE_FLAG';

export const changeSize = (newSize) => ({
  type: CHANGE_SIZE,
  newSize,
});

export const changeSmile = newSmile => ({
  type: CHANGE_SMILE,
  newSmile,
});

export const csp = () => ({
  type: CSP,
});

export const peek = () => ({
  type: PEEK,
});

export const resetBoard = () => ({
  type: RESET_BOARD,
});

export const revealCell = (row, col) => ({
  type: REVEAL_CELL,
  col,
  row,
});

export const toggleFlag = (row, col) => ({
  type: TOGGLE_FLAG,
  col,
  row,
});
