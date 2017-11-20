// given the state.cells
// flags all mines
export const flagMines = (cells) => cells.withMutations(c => {
  for (let i = 0; i < c.size; i++) {
    for (let j = 0; j < c.get(0).size; j++) {
      if (c.getIn([i, j, 'mines']) === -1 && c.getIn([i, j, 'flagged']) === false) {
        c.setIn([i, j, 'flagged'], true);
      }
    }
  }
  return c;
});

// given the state.cells and mine at row i col j
// updates the numbers surrounding the mine dropped at (i, j)
const placeNumbers = (cells, i, j) => cells.withMutations(c => {
  // top-left
  if (i - 1 >= 0 && j - 1 >= 0 && c.getIn([i - 1, j - 1, 'mines']) !== -1) {
    c.setIn([i - 1, j - 1, 'mines'], c.getIn([i - 1, j - 1, 'mines']) + 1);
  }
  // top-mid
  if (i - 1 >= 0 && c.getIn([i - 1, j, 'mines']) !== -1) {
    c.setIn([i - 1, j, 'mines'], c.getIn([i - 1, j, 'mines']) + 1);
  }
  // top-right
  if (i - 1 >= 0 && j + 1 < c.get(0).size && c.getIn([i - 1, j + 1, 'mines']) !== -1) {
    c.setIn([i - 1, j + 1, 'mines'], c.getIn([i - 1, j + 1, 'mines']) + 1);
  }
  // mid-right
  if (j + 1 < c.get(0).size && c.getIn([i, j + 1, 'mines']) !== -1) {
    c.setIn([i, j + 1, 'mines'], c.getIn([i, j + 1, 'mines']) + 1);
  }
  // bottom-right
  if (i + 1 < c.size && j + 1 < c.get(0).size && c.getIn([i + 1, j + 1, 'mines']) !== -1) {
    c.setIn([i + 1, j + 1, 'mines'], c.getIn([i + 1, j + 1, 'mines']) + 1);
  }
  // bottom-mid
  if (i + 1 < c.size && c.getIn([i + 1, j, 'mines']) !== -1) {
    c.setIn([i + 1, j, 'mines'], c.getIn([i + 1, j, 'mines']) + 1);
  }
  // bottom-left
  if (i + 1 < c.size && j - 1 >= 0 && c.getIn([i + 1, j - 1, 'mines']) !== -1) {
    c.setIn([i + 1, j - 1, 'mines'], c.getIn([i + 1, j - 1, 'mines']) + 1);
  }
  // mid-left
  if (j - 1 >= 0 && c.getIn([i, j - 1, 'mines']) !== -1) {
    c.setIn([i, j - 1, 'mines'], c.getIn([i, j - 1, 'mines']) + 1);
  }
  return c;
});

// given the state.cells, state.numMines, safe cell at row x col y
// drops random mines avoiding the safe cell, and calls place numbers
export const placeMines = (cells, numMines, x, y) => {
  let copy = cells;
  let minesLeft = numMines;
  while (minesLeft !== 0) {
    const i = Math.floor(Math.random() * copy.size);
    const j = Math.floor(Math.random() * copy.get(0).size);
    // if the cell at row: i col: j doesn't already have a mine
    // and is not within range of the safe cell, then place a mine there
    if (copy.getIn([i, j, 'mines']) !== -1
      && !((i >= x - 1 && i <= x + 1) && (j >= y - 1 && j <= y + 1))) {
      copy = copy.setIn([i, j, 'mines'], -1);
      copy = placeNumbers(copy, i, j);
      minesLeft--;
    }
  }
  return copy;
};

// given the state.cells
// reveals all mines
export const revealMines = (cells) => cells.withMutations(c => {
  for (let i = 0; i < c.size; i++) {
    for (let j = 0; j < c.get(0).size; j++) {
      if (c.getIn([i, j, 'mines']) === -1) {
        c.setIn([i, j, 'hidden'], false);
      }
    }
  }
  return c;
});

// given the state and row i col j
// reveals all neighboring cells of cell at (i, j)
export const revealNeighbors = (cells, numRevealed, i, j) => {
  let newNumRevealed = numRevealed;
  let copy = cells;
  // reveals all neighboring cells if they exist and haven't been revealed already
  // if the newly revealed cell also has no mines nearby, recursively calls revealNeighbors
  // top-left
  if (i - 1 >= 0 && j - 1 >= 0 && copy.getIn([i - 1, j - 1, 'hidden']) !== false) {
    copy = copy.setIn([i - 1, j - 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i - 1, j - 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i - 1, j - 1);
      copy = temp.cells;
      newNumRevealed = temp.numRevealed;
    }
  }
  // top-mid
  if (i - 1 >= 0 && copy.getIn([i - 1, j, 'hidden']) !== false) {
    copy = copy.setIn([i - 1, j, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i - 1, j, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i - 1, j);
      copy = temp.cells;
      newNumRevealed = temp.numRevealed;
    }
  }
  // top-right
  if (i - 1 >= 0 && j + 1 < copy.get(0).size && copy.getIn([i - 1, j + 1, 'hidden']) !== false) {
    copy = copy.setIn([i - 1, j + 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i - 1, j + 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i - 1, j + 1);
      copy = temp.cells;
      newNumRevealed = temp.numRevealed;
    }
  }
  // mid-right
  if (j + 1 < copy.get(0).size && copy.getIn([i, j + 1, 'hidden']) !== false) {
    copy = copy.setIn([i, j + 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i, j + 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i, j + 1);
      copy = temp.cells;
      newNumRevealed = temp.numRevealed;
    }
  }
  // bottom-right
  if (i + 1 < copy.size && j + 1 < copy.get(0).size && copy.getIn([i + 1, j + 1, 'hidden']) !== false) {
    copy = copy.setIn([i + 1, j + 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i + 1, j + 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i + 1, j + 1);
      copy = temp.cells;
      newNumRevealed = temp.numRevealed;
    }
  }
  // bottom-mid
  if (i + 1 < copy.size && copy.getIn([i + 1, j, 'hidden']) !== false) {
    copy = copy.setIn([i + 1, j, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i + 1, j, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i + 1, j);
      copy = temp.cells;
      newNumRevealed = temp.numRevealed;
    }
  }
  // bottom-left
  if (i + 1 < copy.size && j - 1 >= 0 && copy.getIn([i + 1, j - 1, 'hidden']) !== false) {
    copy = copy.setIn([i + 1, j - 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i + 1, j - 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i + 1, j - 1);
      copy = temp.cells;
      newNumRevealed = temp.numRevealed;
    }
  }
  // mid-left
  if (j - 1 >= 0 && copy.getIn([i, j - 1, 'hidden']) !== false) {
    copy = copy.setIn([i, j - 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i, j - 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i, j - 1);
      copy = temp.cells;
      newNumRevealed = temp.numRevealed;
    }
  }
  return {
    cells: copy,
    newNumRevealed,
  };
};
