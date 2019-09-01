import Immutable from 'immutable';
import { BoardSizes } from 'enums';
import HistoryLogItem from 'objects/HistoryLogItem';

/**
 * Mocks the state of the board with the given settings such that the tests can operate on a separate version of the
 * state.
 * @param {number} numRows number of rows in the minefield
 * @param {number} numCols number of columns in the minefield
 * @param {number} numMines number of mines in the minefield
 * @param {Immutable.Map} algorithms algorithm structure to test with
 * @returns {Immutable.Map} mocked version of state for testing with the given settings
 */
export const initTestState = ({ numRows, numCols, numMines, algorithms }) => {
  // create the cell matrix
  const cells = Immutable.List().withMutations(c => {
    for (let i = 0; i < numRows; i++) {
      const row = Immutable.List().withMutations(r => {
        for (let j = 0; j < numCols; j++) {
          r.push(Immutable.Map({
            color: 0,
            content: 0,
            isFlagged: false,
            isHidden: true,
          }));
        }
      });
      c.push(row);
    }
  });

  // wrap the cells in the minefield
  const minefield = Immutable.Map({
    cells,
    numFlagged: 0,
    numMines,
    numRevealed: 0,
  });

  // create the csp model
  const csp = Immutable.Map({
    algorithms,
    diagnostics: Immutable.Map(),
    isConsistent: true,
    solvable: Immutable.Map(),
  });

  // return the initial state map
  return Immutable.Map({
    csp,
    historyLog: Immutable.List(),
    isGameRunning: false,
    minefield,
    size: BoardSizes.CUSTOM,
  });
};

/**
 * Posts the test results to the history log of state.
 * @param state state of the board
 * @param results mocked state containing test result logs
 * @returns newState with the test results posted
 */
export const postResults = (state, results) => {
  // serialize the history logs back into HistoryLogItem
  const historyLogs = results.get('historyLog').map(o => {
    const log = new HistoryLogItem(o.get('_message'), o.get('_style'), o.get('_canJump'));
    o.get('_details').forEach(detail => {
      log.addDetail(detail, true);
    });
    return log;
  });
  return state.update('historyLog', h => h.push(...historyLogs));
};
