export const changeSize = newSize => ({
  type: 'CHANGE_SIZE',
  newSize,
});

export const cheat = isRandom => ({
  type: 'CHEAT',
  isRandom,
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

export const test = (numIterations, allowCheats, stopOnError) => ({
  type: 'TEST',
  allowCheats,
  numIterations,
  stopOnError,
});

export const toggleActive = (algorithm, modifier) => ({
  type: 'TOGGLE_ACTIVE',
  algorithm,
  modifier,
});

export const toggleFlag = (row, col) => ({
  type: 'TOGGLE_FLAG',
  col,
  row,
});
