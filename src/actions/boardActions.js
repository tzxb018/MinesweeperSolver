export const changeSize = newSize => ({
  type: 'CHANGE_SIZE',
  newSize,
});

export const cheat = () => ({
  type: 'CHEAT',
});

export const loop = () => ({
  type: 'LOOP',
});

export const loseGame = (row, col) => ({
  type: 'LOSE_GAME',
  col,
  row,
});

export const reset = () => ({
  type: 'RESET',
});

export const revealCell = (row, col) => ({
  type: 'REVEAL_CELL',
  col,
  row,
});

export const step = () => ({
  type: 'STEP',
});

export const toggleActive = algorithm => ({
  type: 'TOGGLE_ACTIVE',
  algorithm,
});

export const toggleFlag = (row, col) => ({
  type: 'TOGGLE_FLAG',
  col,
  row,
});
