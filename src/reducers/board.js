import Immutable from 'immutable';

import {
  CHANGE_SIZE,
  CHANGE_SMILE,
  CSP,
  PEEK,
  RESET_BOARD,
  REVEAL_CELL,
  SOLVE,
  TOGGLE_FLAG,
} from 'actions/boardActions';
import { Mines } from 'enums/mines';

import {
  changeSize,
  placeMines,
  revealCell,
} from './utils/cellUtils';
import {
  colorSolvable,
  solve,
} from './utils/cspSatisfaction';
import unaryConsistency from './consistency algorithms/unary';
import normalize from './consistency algorithms/normalize';
import generateCSP from './utils/generateCSP';
import separateComponents from './utils/separateComponents';

// default state
let cells = Immutable.List();
cells = cells.set('numFlagged', 0);
for (let i = 0; i < 16; i++) {
  let row = Immutable.List();
  for (let j = 0; j < 16; j++) {
    row = row.push(Immutable.Map({
      component: 0,
      flagged: false,
      hidden: true,
      mines: Mines.ZERO,
    }));
  }
  cells = cells.push(row);
}
const initialState = Immutable.Map({
  csp: Immutable.Map({
    constraints: [],
    inconsistent: Immutable.List(),
    solvable: Immutable.List(),
    variables: [],
  }),
  gameIsRunning: false,
  hasMines: false,
  minefield: Immutable.Map({
    cells,
    numFlagged: 0,
    numRevealed: 0,
  }),
  numMines: 40,
  size: 'intermediate',
  smile: 'SMILE',
});

/**
 * Reducer for the board
 * @param state Redux state
 * @param action Redux action thrown
 * @returns updated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
  // changes the board size
  case CHANGE_SIZE:
    return changeSize(state, action.newSize);

  // changes the smile
  case CHANGE_SMILE:
    return state.set('smile', action.newSmile);

  // performs CSP stuff
  case CSP:
    return state.withMutations(s => {
      // generate the csp model of the minefield
      s.set('csp', generateCSP(s));

      // enforce unary consistency
      s.update('csp', c => unaryConsistency(c));
      s.updateIn(['minefield', 'cells'], c => colorSolvable(c, s.get('csp'), 1));

      // normalize the constraints
      s.update('csp', c => normalize(c));

      // separate variables and constraints into individual components
      s.set('components', separateComponents(s.get('csp')));
    });

  // reveals a random open cell
  case PEEK:
    if (state.get('gameIsRunning') || !state.get('hasMines')) {
      return state.withMutations(s => {
        let row = Math.floor(Math.random() * state.getIn(['minefield', 'cells']).size);
        let col = Math.floor(Math.random() * state.getIn(['minefield', 'cells', 0]).size);
        // if there are no mines already, place mines and start the game
        if (!s.get('hasMines')) {
          s.updateIn(['minefield', 'cells'], c => placeMines(c, s.get('numMines'), row, col));
          s.set('gameIsRunning', true);
          s.set('hasMines', true);
        } else {
          while (!s.getIn(['minefield', 'cells', row, col, 'hidden'])
              || s.getIn(['minefield', 'cells', row, col, 'mines']) === -1) {
            row = Math.floor(Math.random() * s.getIn(['minefield', 'cells']).size);
            col = Math.floor(Math.random() * s.getIn(['minefield', 'cells', 0]).size);
          }
        }
        return revealCell(s, row, col);
      });
    }
    return state;

  // resets the board
  case RESET_BOARD:
    if (!state.get('hasMines')) {
      return state;
    }
    return state.withMutations(s => {
      for (let i = 0; i < s.getIn(['minefield', 'cells']).size; i++) {
        for (let j = 0; j < s.getIn(['minefield', 'cells', 0]).size; j++) {
          s.setIn(['minefield', 'cells', i, j], Immutable.Map({
            component: 0,
            flagged: false,
            hidden: true,
            mines: 0,
          }));
        }
      }
      s.set('gameIsRunning', false);
      s.set('hasMines', false);
      s.setIn(['minefield', 'numFlagged'], 0);
      s.setIn(['minefield', 'numRevealed'], 0);
      s.set('smile', 'SMILE');
    });

  // reveals the clicked cell
  case REVEAL_CELL:
    if (state.get('gameIsRunning') || !state.get('hasMines')) {
      const newState = state.withMutations(s => {
        // if there are no mines already, place mines and start the game
        if (!s.get('hasMines')) {
          s.updateIn(['minefield', 'cells'], c => placeMines(c, s.get('numMines'), action.row, action.col));
          s.set('gameIsRunning', true);
          s.set('hasMines', true);
        }
      });
      return revealCell(newState, action.row, action.col);
    }
    return state;

  // solves all solvable cells
  case SOLVE:
    if (state.getIn(['csp', 'solvable']).size > 0) {
      return solve(state);
    }
    return state;

  // toggles the flag of the cell
  case TOGGLE_FLAG:
    return state.withMutations(s => {
      if (s.get('gameIsRunning') === true) {
        if (s.getIn(['minefield', 'cells', action.row, action.col, 'flagged']) === false
            && s.getIn(['minefield', 'numFlagged']) < s.get('numMines')) {
          s.setIn(['minefield', 'cells', action.row, action.col, 'flagged'], true);
          s.updateIn(['minefield', 'numFlagged'], n => n + 1);
        } else if (s.getIn(['minefield', 'cells', action.row, action.col, 'flagged']) === true) {
          s.setIn(['minefield', 'cells', action.row, action.col, 'flagged'], false);
          s.updateIn(['minefield', 'numFlagged'], n => n - 1);
        }
      }
    });

  default:
    return state;
  }
};
