export const revealCell = (row, col) => ({
  type: 'REVEAL_CELL',
  col,
  row,
});

export const toggleFlagged = (row, col) => ({
  type: 'TOGGLE_FLAGGED',
  col,
  row,
});
