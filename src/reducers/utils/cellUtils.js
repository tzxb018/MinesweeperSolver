import Immutable from 'immutable';

/**
 * Changes the size of the board
 * @param state board state to be changed
 * @param newSize passed from action
 * @return new state with mutations
 */
export const changeSize = (state, newSize) => state.withMutations(s => {
  let rows = 0;
  let cols = 0;
  let numMines = 0;
  // change settings based on new size
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

  // reset all cells
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
 * Flags all hidden cells that have mines for when the game is won
 * @param cells array of cell objects
 * @return new state with mutations
 */
export const flagMines = cells => cells.withMutations(c => {
  for (let i = 0; i < c.size; i++) {
    for (let j = 0; j < c.get(0).size; j++) {
      if (c.getIn([i, j, 'mines']) === -1 && !c.getIn([i, j, 'flagged'])) {
        c.setIn([i, j, 'flagged'], true);
      }
    }
  }
});

/**
 * Updates the numbers of cells around a new mine
 * @param cells array of cell objects
 * @param i row of mine placed
 * @param j column of mine placed
 * @return new state with mutations
 */
const placeNumbers = (cells, i, j) => cells.withMutations(c => {
  const coords = [
    [-1, -1],   // top-left
    [-1, 0],    // top-mid
    [-1, 1],    // top-right
    [0, 1],     // mid-right
    [1, 1],     // bottom-right
    [1, 0],     // bottom-mid
    [1, -1],    // bottom-left
    [0, -1],    // mid-left
  ];
  coords.forEach(element => {
    const x = i + element[0];
    const y = j + element[1];
    const mines = c.getIn([x, y, 'mines']);
    // if the coordinate exists on the board and doesn't have a mine, add to its number
    if (x >= 0
        && x < c.size
        && y >= 0
        && y < c.get(0).size
        && mines !== -1) {
      c.setIn([x, y, 'mines'], mines + 1);
    }
  });
});

/**
 * Places mines randomly on the board, avoiding the clicked cell
 * @param cells array of cell objects
 * @param numMines number of mines to be placed
 * @param x row of safe cell
 * @param y col of safe cell
 * @returns new array of cell objects with mines and numbers
 */
export const placeMines = (cells, numMines, x, y) => {
  let newCells = cells;
  let minesLeft = numMines;
  while (minesLeft !== 0) {
    const i = Math.floor(Math.random() * newCells.size);
    const j = Math.floor(Math.random() * newCells.get(0).size);
    // if a random cell doesn't already have a mine
    // and is not within range of the safe cell, then place a mine there
    if (newCells.getIn([i, j, 'mines']) !== -1
      && !((i >= x - 1 && i <= x + 1) && (j >= y - 1 && j <= y + 1))) {
      newCells = newCells.setIn([i, j, 'mines'], -1);
      newCells = placeNumbers(newCells, i, j);
      minesLeft--;
    }
  }
  return newCells;
};

/**
 * Reveals all hidden cells that have mines for when the game is lost
 * @param cells array of cell objects
 * @returns updated array of cell objects
 */
export const revealMines = cells => cells.withMutations(c => {
  for (let i = 0; i < c.size; i++) {
    for (let j = 0; j < c.get(0).size; j++) {
      if (c.getIn([i, j, 'mines']) === -1) {
        c.setIn([i, j, 'hidden'], false);
      } else if (c.getIn([i, j, 'flagged']) === true) {
        c.setIn([i, j, 'mines'], -2);
      }
      c.setIn([i, j, 'component'], 0);
    }
  }
});

/**
 * Reveals all hidden cells around an empty clicked cell
 * @param cells array of cell objects
 * @param numRevealed number of revealed cells
 * @param i row of clicked cell
 * @param j col of clicked cell
 * @returns ({ updated array of cells, updated number of revealed cells })
 */
export const revealNeighbors = (cells, numRevealed, i, j) => {
  let newNumRevealed = numRevealed;
  let newCells = cells;
  const coords = [
    [-1, -1],   // top-left
    [-1, 0],    // top-mid
    [-1, 1],    // top-right
    [0, 1],     // mid-right
    [1, 1],     // bottom-right
    [1, 0],     // bottom-mid
    [1, -1],    // bottom-left
    [0, -1],    // mid-left
  ];

  // reveal all neighboring cells
  coords.forEach(element => {
    const x = i + element[0];
    const y = j + element[1];
    // if the coordinate exists on the board and isn't already revealed, reveal it
    if (x >= 0
        && x < newCells.size
        && y >= 0
        && y < newCells.get(0).size
        && newCells.getIn([x, y, 'hidden'])) {
      newCells = newCells.setIn([x, y, 'hidden'], false);
      newNumRevealed++;
      // if the newly revealed cell is also empty, recursively call revealNeighbors
      if (newCells.getIn([x, y, 'mines']) === 0) {
        const temp = revealNeighbors(newCells, newNumRevealed, x, y);
        newCells = temp.newCells;
        newNumRevealed = temp.newNumRevealed;
      }
    }
  });

  return {
    newCells,
    newNumRevealed,
  };
};
