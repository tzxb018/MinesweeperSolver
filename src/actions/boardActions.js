export const INCREMENT_TIMER = 'INCREMENT_TIMER';
export const RESET_BOARD = 'RESET_BOARD';
export const TOGGLE_BOARD_SIZE = 'TOGGLE_BOARD_SIZE';

export const incrementTimer = () => ({
  type: INCREMENT_TIMER,
});

export const resetBoard = () => ({
  type: RESET_BOARD,
});

export const toggleBoardSize = (rows, cols) => ({
  type: TOGGLE_BOARD_SIZE,
  cols,
  rows,
});
