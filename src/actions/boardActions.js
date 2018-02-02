export const CHANGE_SMILE = 'CHANGE_SMILE';
export const GENERATE_CSP_VARIABLES = 'GENERATE_CSP_VARIABLES';
export const RESET_BOARD = 'RESET_BOARD';
export const REVEAL_CELL = 'REVEAL_CELL';
export const CHANGE_SIZE = 'CHANGE_SIZE';
export const TOGGLE_FLAG = 'TOGGLE_FLAG';

export const changeSmile = newSmile => ({
  type: CHANGE_SMILE,
  newSmile,
});

export const generateCSPVariables = () => ({
  type: GENERATE_CSP_VARIABLES,
});

export const resetBoard = () => ({
  type: RESET_BOARD,
});

export const revealCell = (row, col) => ({
  type: REVEAL_CELL,
  col,
  row,
});

export const changeSize = (newSize) => ({
  type: CHANGE_SIZE,
  newSize,
});

export const toggleFlag = (row, col) => ({
  type: TOGGLE_FLAG,
  col,
  row,
});
