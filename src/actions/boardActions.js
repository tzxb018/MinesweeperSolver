export const RESET_BOARD = 'RESET_BOARD';
export const TOGGLE_BOARD_SIZE = 'TOGGLE_BOARD_SIZE';
export const WIN_GAME = 'WIN_GAME';

export const resetBoard = () => ({
  type: RESET_BOARD,
});

export const toggleBoardSize = (rows, cols) => ({
  type: TOGGLE_BOARD_SIZE,
  cols,
  rows,
});

export const winGame = () => ({
  type: WIN_GAME,
});
