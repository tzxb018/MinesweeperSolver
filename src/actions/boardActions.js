export const resetBoard = () => ({
  type: 'RESET_BOARD',
});

export const toggleBoardSize = (rows, cols) => ({
  type: 'TOGGLE_BOARD_SIZE',
  cols,
  rows,
});

export const winGame = () => ({
  type: 'WIN_GAME',
});
