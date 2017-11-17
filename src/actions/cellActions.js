export const REVEAL_CELL = 'REVEAL_CELL';
export const TOGGLE_FLAG = 'TOGGLE_FLAG';

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
