// coordinate matrix of all adjacent cells
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

/**
 * Determines whether a cell is on the fringe.
 * @param {Immutable.List<Immutable.List<{}>>} cells matrix of cell objects
 * @param {number} i row of cell
 * @param {number } j col of cell
 * @returns {boolean} true if the cell is on the fringe, false otherwise
 */
export const isOnFringe = (cells, i, j) => coords.some(element => {
  const x = i + element[0];
  const y = j + element[1];
  return x >= 0 && x < cells.size && y >= 0 && y < cells.get(0).size && !cells.getIn([x, y, 'isHidden']);
});

/**
 * Updates the number of nearby mines of the cells around mines.
 * @param {Immutable.List<Immutable.List<Immutable.Map>>>} cells matrix of cell objects
 * @param {Array<{x: number, y: number}>} mines list of mine locations
 * @return {Immutable.List<Immutable.List<Immutable.Map>>>} new cells
 */
const placeNumbers = (cells, mines) => {
  const numRows = cells.size;
  const numCols = cells.get(0).size;

  return cells.withMutations(c => {
    mines.forEach(mine => {
      coords.forEach(element => {
        const x = mine.x + element[0];
        const y = mine.y + element[1];
        const numMines = c.getIn([x, y, 'content']);
        // if the coordinate exists on the board and doesn't have a mine, add to its number
        if (x >= 0
            && x < numRows
            && y >= 0
            && y < numCols
            && numMines !== -1) {
          c.setIn([x, y, 'content'], numMines + 1);
        }
      });
    });
  });
};

/**
 * Reveals all mines that weren't found and any flags that were in the wrong place for when the game is lost.
 * @param {Immutable.Map} minefield state of the minefield
 * @returns {Immutable.List<Immutable.List<Immutable.Map>>>} new cells
 */
export const revealMines = minefield => minefield.withMutations(m => {
  for (let row = 0; row < m.get('cells').size; row++) {
    for (let col = 0; col < m.getIn(['cells', 0]).size; col++) {
      // if the cell has a mine
      if (m.getIn(['cells', row, col, 'content']) === -1) {
        // if the mine is already revealed, show it as an error
        if (!m.getIn(['cells', row, col, 'isHidden'])) {
          m.setIn(['cells', row, col, 'content'], -2);
        // else reveal the mine if it isn't flagged
        } else if (!m.getIn(['cells', row, col, 'isFlagged'])) {
          m.setIn(['cells', row, col, 'isHidden'], false);
        }
      // else if the cell is flagged, show it as an error
      } else if (m.getIn(['cells', row, col, 'isFlagged'])) {
        m.setIn(['cells', row, col, 'content'], -2);
        m.setIn(['cells', row, col, 'isHidden'], false);
        m.update('numFlagged', n => n - 1);
      }
      m.setIn(['cells', row, col, 'color'], 0);
    }
  }
});

/**
 * Reveals all hidden cells near a cell that was revealed and found to be blank.
 * @param {Immutable.Map} minefield state of the minefield
 * @param {number} row row of revealed cell
 * @param {number} col column of revealed cell
 * @returns {Immutable.Map} new minefield
 */
export const revealNeighbors = (minefield, row, col) => {
  const cellQueue = [];
  cellQueue.push({
    x: row,
    y: col,
  });
  const numRows = minefield.get('cells').size;
  const numCols = minefield.getIn(['cells', 0]).size;

  // reveal all neighboring cells
  return minefield.withMutations(m => {
    do {
      const currentCell = cellQueue.pop();
      coords.forEach(element => {
        const x = currentCell.x + element[0];
        const y = currentCell.y + element[1];
        // if the coordinate exists on the board and isn't already revealed, reveal it
        if (x >= 0 && x < numRows
        && y >= 0 && y < numCols
        && m.getIn(['cells', x, y, 'isHidden'])) {
          m.setIn(['cells', x, y, 'isHidden'], false);
          m.update('numRevealed', n => n + 1);
          // if this cell is also empty, add it to the queue so its neighbors can also be revealed
          if (m.getIn(['cells', x, y, 'content']) === 0) {
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
 * Checks if the game has been won.
 * @param {Immutable.Map} minefield state of the minefield
 * @returns {boolean} true if game has been won, false otherwise
 */
export const checkWinCondition = minefield => minefield.get('numRevealed') === ((minefield.get('cells').size
  * minefield.getIn(['cells', 0]).size) - minefield.get('numMines'));

/**
 * Gets all the cells that changed from the previous state to the current one. Returning their [row, col] pairs in an
 * array.
 * @param {Immutable.List<Immutable.List<Immutable.Map>>>} oldCells old matrix of cells
 * @param {Immutable.List<Immutable.List<Immutable.Map>>>} newCells new matrix of cells
 * @returns {Array<{col: number, row: number}>} array of cell locations that are different
 */
export const getChangedCells = (oldCells, newCells) => {
  const changedCells = [];
  oldCells.forEach((group, row) => {
    group.forEach((cell, col) => {
      if (cell !== newCells.getIn([row, col])) {
        changedCells.push({
          col,
          row,
        });
      }
    });
  });
  return changedCells;
};

/**
 * Places mines randomly on the board, avoiding the given safe cell.
 * @param {Immutable.List<Immutable.List<Immutable.Map>>>} cells matrix of cell objects
 * @param {number} numMines number of mines to be placed
 * @param {number} row row of safe cell
 * @param {number} col column of safe cell
 * @returns {Immutable.List<Immutable.List<Immutable.Map>>>} new cells
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
      if (c.getIn([x, y, 'content']) !== -1
        && !((x >= row - 1 && x <= row + 1) && (y >= col - 1 && y <= col + 1))) {
        c.setIn([x, y, 'content'], -1);
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
 * Flags all hidden cells that have mines for when the game is won.
 * @param {Immutable.List<Immutable.List<Immutable.Map>>>} cells matrix of cell objects
 * @return {Immutable.List<Immutable.List<Immutable.Map>>>} new cells
 */
export const flagMines = cells => cells.withMutations(c => {
  for (let row = 0; row < c.size; row++) {
    for (let col = 0; col < c.get(0).size; col++) {
      if (c.getIn([row, col, 'content']) === -1 && !c.getIn([row, col, 'isFlagged'])) {
        c.setIn([row, col, 'isFlagged'], true);
      }
    }
  }
});
