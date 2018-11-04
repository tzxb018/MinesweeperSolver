import Immutable from 'immutable';

/**
 * Handles the initialize board action.
 * @param {number} numRows number of rows in the board
 * @param {number} numCols number of columns in the board
 */
const initialState = (numRows, numCols) => Immutable.List().withMutations(c => {
  for (let i = 0; i < numRows; i++) {
    const row = Immutable.List().withMutations(r => {
      for (let j = 0; j < numCols; j++) {
        r.push(false);
      }
    });
    c.push(row);
  }
});

/**
 * Handles the highlight action
 * @param {Immutable.List<Immutable.List<boolean>>} state state of the cell highlight
 * @param {Array<{row: number, col: number}>} cells cells to be highlighted
 * @returns {Immutable.List<Immutable.List<boolean>>} new state
 */
const highlight = (state, cells) =>
  state.withMutations(s => cells.forEach(cell => s.setIn([cell.row, cell.col], true)));

/**
 * Handles the clear action
 * @param {Immutable.List<Immutable.List<boolean>>} state state of the cell highlight
 * @returns {Immutable.List<Immutable.List<boolean>>} new state
 */
const clear = state => state.withMutations(s => s.forEach((row, rowIndex) => {
  for (let i = 0; i < row.size; i++) {
    s.setIn([rowIndex, i], false);
  }
}));

/**
 * Handles the change size action
 * @param {object} newSize new size to make the cell highlight
 * @returns {Immutable.List<Immutable.List<boolean>>} new state
 */
const changeSize = newSize => initialState(newSize.rows, newSize.cols);

/**
 * Reducer for the cell highlight
 * @param state state of the cell highlight
 * @param action redux action
 * @returns updated state
 */
export default (state = initialState(16, 16), action) => {
  switch (action.type) {
  case 'CHANGE_SIZE': return changeSize(action.newSize);
  case 'CLEAR': return clear(state);
  case 'HIGHLIGHT': return highlight(state, action.cells);
  default: return state;
  }
};
