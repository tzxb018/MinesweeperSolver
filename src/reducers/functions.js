// given the state.cells and mine at row i col j
// updates the numbers surrounding the mine dropped at (i, j)
const placeNumbers = (state, i, j) => {
  // adds one to mines if the neighboring cells exist and don't already have mines
  const newState = state;
  // top-left
  if (i - 1 >= 0 && j - 1 >= 0 && newState[i - 1][j - 1].mines !== -1) {
    newState[i - 1][j - 1].mines += 1;
  }
  // top-mid
  if (i - 1 >= 0 && newState[i - 1][j].mines !== -1) {
    newState[i - 1][j].mines += 1;
  }
  // top-right
  if (i - 1 >= 0 && j + 1 < newState[0].length && newState[i - 1][j + 1].mines !== -1) {
    newState[i - 1][j + 1].mines += 1;
  }
  // mid-right
  if (j + 1 < newState[0].length && newState[i][j + 1].mines !== -1) {
    newState[i][j + 1].mines += 1;
  }
  // bottom-right
  if (i + 1 < newState.length && j + 1 < newState[0].length && newState[i + 1][j + 1].mines !== -1) {
    newState[i + 1][j + 1].mines += 1;
  }
  // bottom-mid
  if (i + 1 < newState.length && newState[i + 1][j].mines !== -1) {
    newState[i + 1][j].mines += 1;
  }
  // bottom-left
  if (i + 1 < newState.length && j - 1 >= 0 && newState[i + 1][j - 1].mines !== -1) {
    newState[i + 1][j - 1].mines += 1;
  }
  // mid-left
  if (j - 1 >= 0 && newState[i][j - 1].mines !== -1) {
    newState[i][j - 1].mines += 1;
  }
  return newState;
};

// given the state.cells, state.numMines, safe cell at row x col y
// drops random mines avoiding the safe cell, and calls place numbers
export const placeMines = (state, numMines, x, y) => {
  let newState = state;
  // iterates through random rows and cols, dropping mines and calling placeNumbers
  let minesLeft = numMines;
  while (minesLeft !== 0) {
    const i = Math.floor(Math.random() * newState.length);
    const j = Math.floor(Math.random() * newState[0].length);
    // if the cell at row: i col: j doesn't already have a mine
    // and is not within range of the safe cell, then place a mine there
    if (newState[i][j].mines !== -1
      && !((i >= x - 1 && i <= x + 1) && (j >= y - 1 && j <= y + 1))) {
      newState[i][j].mines = -1;
      newState = placeNumbers(newState, i, j);
      minesLeft--;
    }
  }
  return newState;
};

// given the state.cells
// reveals all mines
export const revealMines = (state) => {
  const newState = state;
  for (let i = 0; i < newState.length; i++) {
    for (let j = 0; j < newState[0].length; j++) {
      if (newState[i][j].mines === -1) {
        newState[i][j].hidden = false;
      }
    }
  }
  return newState;
};

// given the state and row i col j
// reveals all neighboring cells of cell at (i, j)
export const revealNeighbors = (state, i, j) => {
  let newState = state;
  // reveals all neighboring cells if they exist and haven't been revealed already
  // if the newly revealed cell also has no mines nearby, recursively calls revealNeighbors
  // top-left
  if (i - 1 >= 0 && j - 1 >= 0 && newState[i - 1][j - 1].hidden !== false) {
    newState[i - 1][j - 1].hidden = false;
    newState.numRevealed += 1;
    if (newState[i - 1][j - 1].mines === 0) {
      newState = revealNeighbors(newState, i - 1, j - 1);
    }
  }
  // top-mid
  if (i - 1 >= 0 && newState[i - 1][j].hidden !== false) {
    newState[i - 1][j].hidden = false;
    newState.numRevealed += 1;
    if (newState[i - 1][j].mines === 0) {
      newState = revealNeighbors(newState, i - 1, j);
    }
  }
  // top-right
  if (i - 1 >= 0 && j + 1 < newState[0].length && newState[i - 1][j + 1].hidden !== false) {
    newState[i - 1][j + 1].hidden = false;
    newState.numRevealed += 1;
    if (newState[i - 1][j + 1].mines === 0) {
      newState = revealNeighbors(newState, i - 1, j + 1);
    }
  }
  // mid-right
  if (j + 1 < newState[0].length && newState[i][j + 1].hidden !== false) {
    newState[i][j + 1].hidden = false;
    newState.numRevealed += 1;
    if (newState[i][j + 1].mines === 0) {
      newState = revealNeighbors(newState, i, j + 1);
    }
  }
  // bottom-right
  if (i + 1 < newState.length && j + 1 < newState[0].length && newState[i + 1][j + 1].hidden !== false) {
    newState[i + 1][j + 1].hidden = false;
    newState.numRevealed += 1;
    if (newState[i + 1][j + 1].mines === 0) {
      newState = revealNeighbors(newState, i + 1, j + 1);
    }
  }
  // bottom-mid
  if (i + 1 < newState.length && newState[i + 1][j].hidden !== false) {
    newState[i + 1][j].hidden = false;
    newState.numRevealed += 1;
    if (newState[i + 1][j].mines === 0) {
      newState = revealNeighbors(newState, i + 1, j);
    }
  }
  // bottom-left
  if (i + 1 < newState.length && j - 1 >= 0 && newState[i + 1][j - 1].hidden !== false) {
    newState[i + 1][j - 1].hidden = false;
    newState.numRevealed += 1;
    if (newState[i + 1][j - 1].mines === 0) {
      newState = revealNeighbors(newState, i + 1, j - 1);
    }
  }
  // mid-left
  if (j - 1 >= 0 && newState[i][j - 1].hidden !== false) {
    newState[i][j - 1].hidden = false;
    newState.numRevealed += 1;
    if (newState[i][j - 1].mines === 0) {
      newState = revealNeighbors(newState, i, j - 1);
    }
  }
  return newState;
};
