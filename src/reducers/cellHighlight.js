import Immutable from 'immutable';
import { Actions } from 'enums';

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
 * Handles the load end action
 * @param {Document} xmlDoc xml DOM representing a minefield
 * @returns {Immutable.List<Immutable.List<boolean>>} new state
 */
const loadXMLDocument = xmlDoc => {
  let rows;
  let cols;
  const minSize = xmlDoc.getElementsByTagName('dimensions')[0];
  rows = minSize.getAttribute('y');
  cols = minSize.getAttribute('x');
  if (rows <= 9 && cols <= 9) {
    rows = 9;
    cols = 9;
  } else if (rows <= 16 && cols <= 16) {
    rows = 16;
    cols = 16;
  } else if (rows <= 16 && cols <= 30) {
    rows = 16;
    cols = 30;
  }
  return initialState(rows, cols);
};

/**
 * Reducer for the cell highlight
 * @param state state of the cell highlight
 * @param action redux action
 * @returns updated state
 */
export default (state = initialState(16, 16), action) => {
  switch (action.type) {
    case Actions.CHANGE_SIZE: return changeSize(action.newSize);
    case Actions.CLEAR: return clear(state);
    case Actions.HIGHLIGHT: return highlight(state, action.cells);
    case Actions.LOAD_END: return loadXMLDocument(action.xmlDoc);
    default: return state;
  }
};
