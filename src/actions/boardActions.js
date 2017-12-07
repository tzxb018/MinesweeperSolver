export const CHANGE_SMILE = 'CHANGE_SMILE';
export const GENERATE_CSP_VARIABLES = 'GENERATE_CSP_VARIABLES';
export const RESET_BOARD = 'RESET_BOARD';
export const REVEAL_CELL = 'REVEAL_CELL';
export const TOGGLE_BOARD_SIZE = 'TOGGLE_BOARD_SIZE';
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

export const toggleBoardSize = (rows, cols) => ({
  type: TOGGLE_BOARD_SIZE,
  cols,
  rows,
});

export const toggleFlag = (row, col) => ({
  type: TOGGLE_FLAG,
  col,
  row,
});
