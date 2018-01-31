import Immutable from 'immutable';

/**
 * Changes the size of the board
 * @param {*} state board state to be changed
 * @param {*} newSize passed from action
 */
export const changeSize = (state, newSize) => state.withMutations(s => {
  let rows = 0;
  let cols = 0;
  let numMines = 0;
  switch (newSize) {
  case 'beginner':
    rows = 9;
    cols = 9;
    numMines = 10;
    break;
  case 'intermediate':
    rows = 16;
    cols = 16;
    numMines = 40;
    break;
  case 'expert':
    rows = 16;
    cols = 30;
    numMines = 99;
    break;
  default:
    rows = 16;
    cols = 16;
    numMines = 40;
  }
  let cells = Immutable.List();
  for (let i = 0; i < rows; i++) {
    let row = Immutable.List();
    for (let j = 0; j < cols; j++) {
      row = row.push(Immutable.Map({
        component: 0,
        flagged: false,
        hidden: true,
        mines: 0,
      }));
    }
    cells = cells.push(row);
  }
  s.set('cells', cells);
  s.set('numMines', numMines);
  s.set('size', newSize);
  s.set('gameIsRunning', false);
  s.set('hasMines', false);
  s.set('numFlagged', 0);
  s.set('numRevealed', 0);
  s.set('smile', 'SMILE');
});

/**
 * Flags all hidden cells that have mines
 * @param {*} cells array of cell objects
 */
export const flagMines = cells => cells.withMutations(c => {
  for (let i = 0; i < c.size; i++) {
    for (let j = 0; j < c.get(0).size; j++) {
      if (c.getIn([i, j, 'mines']) === -1 && c.getIn([i, j, 'flagged']) === false) {
        c.setIn([i, j, 'flagged'], true);
      }
    }
  }
  return c;
});

/**
 * Updates the numbers around the mine placed at row: i, col: j
 * @param {*} cells array of cell objects
 * @param {*} i row
 * @param {*} j column
 */
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

/**
 * Places mines randomly with a safe cell at row: x, col: y
 * @param {*} cells array of cell objects
 * @param {*} numMines number of mines to be placed
 * @param {*} x row of safe cell
 * @param {*} y col of safe cell
 */
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

/**
 * Reveals all hidden cells that have mines
 * @param {*} cells array of cell objects
 */
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

/**
 * Reveals all hidden cells around cell at row: i, col: j
 * @param {*} cells array of cell objects
 * @param {*} numRevealed number of revealed cells
 * @param {*} i row
 * @param {*} j col
 */
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
      newNumRevealed = temp.newNumRevealed;
    }
  }
  // top-mid
  if (i - 1 >= 0 && copy.getIn([i - 1, j, 'hidden']) !== false) {
    copy = copy.setIn([i - 1, j, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i - 1, j, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i - 1, j);
      copy = temp.cells;
      newNumRevealed = temp.newNumRevealed;
    }
  }
  // top-right
  if (i - 1 >= 0 && j + 1 < copy.get(0).size && copy.getIn([i - 1, j + 1, 'hidden']) !== false) {
    copy = copy.setIn([i - 1, j + 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i - 1, j + 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i - 1, j + 1);
      copy = temp.cells;
      newNumRevealed = temp.newNumRevealed;
    }
  }
  // mid-right
  if (j + 1 < copy.get(0).size && copy.getIn([i, j + 1, 'hidden']) !== false) {
    copy = copy.setIn([i, j + 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i, j + 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i, j + 1);
      copy = temp.cells;
      newNumRevealed = temp.newNumRevealed;
    }
  }
  // bottom-right
  if (i + 1 < copy.size && j + 1 < copy.get(0).size && copy.getIn([i + 1, j + 1, 'hidden']) !== false) {
    copy = copy.setIn([i + 1, j + 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i + 1, j + 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i + 1, j + 1);
      copy = temp.cells;
      newNumRevealed = temp.newNumRevealed;
    }
  }
  // bottom-mid
  if (i + 1 < copy.size && copy.getIn([i + 1, j, 'hidden']) !== false) {
    copy = copy.setIn([i + 1, j, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i + 1, j, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i + 1, j);
      copy = temp.cells;
      newNumRevealed = temp.newNumRevealed;
    }
  }
  // bottom-left
  if (i + 1 < copy.size && j - 1 >= 0 && copy.getIn([i + 1, j - 1, 'hidden']) !== false) {
    copy = copy.setIn([i + 1, j - 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i + 1, j - 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i + 1, j - 1);
      copy = temp.cells;
      newNumRevealed = temp.newNumRevealed;
    }
  }
  // mid-left
  if (j - 1 >= 0 && copy.getIn([i, j - 1, 'hidden']) !== false) {
    copy = copy.setIn([i, j - 1, 'hidden'], false);
    newNumRevealed += 1;
    if (copy.getIn([i, j - 1, 'mines']) === 0) {
      const temp = revealNeighbors(copy, newNumRevealed, i, j - 1);
      copy = temp.cells;
      newNumRevealed = temp.newNumRevealed;
    }
  }
  return {
    cells: copy,
    newNumRevealed,
  };
};
