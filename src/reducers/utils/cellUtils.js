import Immutable from 'immutable';

/**
 * Flags all hidden cells that have mines for when the game is won.
 * @param cells matrix of cell objects
 * @return new cells
 */
const flagMines = cells => cells.withMutations(c => {
  for (let row = 0; row < c.size; row++) {
    for (let col = 0; col < c.get(0).size; col++) {
      if (c.getIn([row, col, 'mines']) === -1 && !c.getIn([row, col, 'flagged'])) {
        c.setIn([row, col, 'flagged'], true);
      }
    }
  }
});

/**
 * Updates the number of nearby mines of the cells around mines.
 * @param cells matrix of cell objects
 * @param mines list of mine locations
 * @return new cells
 */
const placeNumbers = (cells, mines) => {
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
  const numRows = cells.size;
  const numCols = cells.get(0).size;

  return cells.withMutations(c => {
    mines.forEach(mine => {
      coords.forEach(element => {
        const x = mine.x + element[0];
        const y = mine.y + element[1];
        const numMines = c.getIn([x, y, 'mines']);
        // if the coordinate exists on the board and doesn't have a mine, add to its number
        if (x >= 0
            && x < numRows
            && y >= 0
            && y < numCols
            && numMines !== -1) {
          c.setIn([x, y, 'mines'], numMines + 1);
        }
      });
    });
  });
};

/**
 * Reveals all mines that weren't found and any flags that were in the wrong place for when the game is lost.
 * @param cells matrix of cell objects
 * @returns new cells
 */
const revealMines = cells => cells.withMutations(c => {
  for (let row = 0; row < c.size; row++) {
    for (let col = 0; col < c.get(0).size; col++) {
      if (c.getIn([row, col, 'mines']) === -1) {
        c.setIn([row, col, 'hidden'], false);
      } else if (c.getIn([row, col, 'flagged'])) {
        c.setIn([row, col, 'mines'], -2);
      }
      c.setIn([row, col, 'component'], 0);
    }
  }
});

/**
 * Reveals all hidden cells near a cell that was revealed and found to be blank.
 * @param minefield state of the minefield
 * @param row row of revealed cell
 * @param col column of revealed cell
 * @returns new minefield
 */
const revealNeighbors = (minefield, row, col) => {
  const cellQueue = [];
  cellQueue.push({
    x: row,
    y: col,
  });
  const numRows = minefield.get('cells').size;
  const numCols = minefield.getIn(['cells', 0]).size;
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
  return minefield.withMutations(m => {
    do {
      const currentCell = cellQueue.pop();
      coords.forEach(element => {
        const x = currentCell.x + element[0];
        const y = currentCell.y + element[1];
        // if the coordinate exists on the board and isn't already revealed, reveal it
        if (x >= 0
            && x < numRows
            && y >= 0
            && y < numCols
            && m.getIn(['cells', x, y, 'hidden'])) {
          m.setIn(['cells', x, y, 'hidden'], false);
          m.update('numRevealed', n => n + 1);
          // if this cell is also empty, add it to the queue so its neighbors can also be revealed
          if (m.getIn(['cells', x, y, 'mines']) === 0) {
            cellQueue.push({
              x,
              y,
            });
          }
        }
      });
    } while (cellQueue.length > 0);
  });
};

/**
 * Changes the size of the board.
 * @param state state of the board
 * @param newSize new size to make the board
 * @return new state
 */
export const changeSize = (state, newSize) => state.withMutations(s => {
  let numRows;
  let numCols;
  let numMines;
  // change settings based on new size
  switch (newSize) {
  case 'beginner':
    numRows = 9;
    numCols = 9;
    numMines = 10;
    break;
  case 'intermediate':
    numRows = 16;
    numCols = 16;
    numMines = 40;
    break;
  case 'expert':
    numRows = 16;
    numCols = 30;
    numMines = 99;
    break;
  default:
    numRows = 16;
    numCols = 16;
    numMines = 40;
  }

  // reset all cells
  let cells = Immutable.List();
  for (let i = 0; i < numRows; i++) {
    let row = Immutable.List();
    for (let j = 0; j < numCols; j++) {
      row = row.push(Immutable.Map({
        component: 0,
        flagged: false,
        hidden: true,
        mines: 0,
      }));
    }
    cells = cells.push(row);
  }
  s.set('csp', Immutable.Map({
    constraints: [],
    solvable: Immutable.List(),
    variables: [],
  }));
  s.setIn(['minefield', 'cells'], cells);
  s.setIn(['minefield', 'numFlagged'], 0);
  s.setIn(['minefield', 'numRevealed'], 0);
  s.set('numMines', numMines);
  s.set('size', newSize);
  s.set('gameIsRunning', false);
  s.set('hasMines', false);
  s.set('smile', 'SMILE');
});

/**
 * Checks if the game has been lost and acts accordingly.
 * @param state state of the board
 * @param row row of revealed cell
 * @param col column of revealed cell
 */
export const checkLossCondition = (state, row, col) => {
  // if the revealed cell had a mine, lose the game
  if (state.getIn(['minefield', 'cells', row, col, 'mines']) === -1) {
    return state.withMutations(s => {
      s.updateIn(['minefield', 'cells'], c => revealMines(c));
      s.setIn(['minefield', 'cells', row, col, 'mines'], -2);
      s.set('gameIsRunning', false);
      s.set('smile', 'LOST');
    });
  }
  return state;
};

/**
 * Checks if the game has been won and acts accordingly.
 * @param state state of the board
 * @returns new state
 */
export const checkWinCondition = state => {
  // if all the non-bomb cells are revealed, win the game
  if (state.getIn(['minefield', 'numRevealed'])
      === (state.getIn(['minefield', 'cells']).size * state.getIn(['minefield', 'cells', 0]).size)
      - state.get('numMines')) {
    return state.withMutations(s => {
      s.updateIn(['minefield', 'cells'], c => flagMines(c));
      s.setIn(['minefield', 'numFlagged'], s.get('numMines'));
      s.set('gameIsRunning', false);
      s.set('smile', 'WON');
    });
  }
  return state;
};

/**
 * Places mines randomly on the board, avoiding the given safe cell.
 * @param cells matrix of cell objects
 * @param numMines number of mines to be placed
 * @param row row of safe cell
 * @param col column of safe cell
 * @returns new cells
 */
export const placeMines = (cells, numMines, row, col) => {
  let minesLeft = numMines;
  const numRows = cells.size;
  const numCols = cells.get(0).size;
  const mines = [];

  const newCells = cells.withMutations(c => {
    while (minesLeft > 0) {
      const x = Math.floor(Math.random() * numRows);
      const y = Math.floor(Math.random() * numCols);
      // if a random cell doesn't already have a mine and is not within range of the safe cell, then place a mine there
      if (c.getIn([x, y, 'mines']) !== -1
        && !((x >= row - 1 && x <= row + 1) && (y >= col - 1 && y <= col + 1))) {
        c.setIn([x, y, 'mines'], -1);
        mines.push({
          x,
          y,
        });
        minesLeft--;
      }
    }
  });

  return placeNumbers(newCells, mines);
};

/**
 * Reveals the cell.
 * @param minefield state of the minefield
 * @param row row of cell
 * @param col column of cell
 * @returns updated state of minefield
 */
export const revealCell = (minefield, row, col) => minefield.withMutations(m => {
  // reveal the cell
  m.setIn(['cells', row, col, 'hidden'], false);
  m.update('numRevealed', n => n + 1);

  // if that cell had zero mines nearby, reveal all neighbors
  if (m.getIn(['cells', row, col, 'mines']) === 0) {
    return revealNeighbors(m, row, col);
  }

  return m;
});
