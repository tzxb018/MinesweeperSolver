import Immutable from 'immutable';

import {
  CHANGE_SIZE,
  CHANGE_SMILE,
  CSP,
  PEEK,
  RESET_BOARD,
  REVEAL_CELL,
  TOGGLE_FLAG,
} from 'actions/boardActions';
import { Mines } from 'enums/mines';

import {
  changeSize,
  flagMines,
  placeMines,
  revealMines,
  revealNeighbors,
} from './utils/cellUtils';
import {
  buildConstraint,
  setVariables,
} from './utils/cspGeneration';
import {
  colorCodeComponents,
  enforceUnary,
  normalize,
  separateComponents,
} from './utils/cspReduction';

// default state
let cells = Immutable.List();
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
  cells,
  gameIsRunning: false,
  hasMines: false,
  numFlagged: 0,
  numMines: 40,
  numRevealed: 0,
  size: 'intermediate',
  smile: 'SMILE',
  components: Immutable.List(),
});

/**
 * Reducer for the board
 * @param state Redux state
 * @param action Redux action thrown
 * @returns updated state
 */
const board = (state = initialState, action) => {
  switch (action.type) {

  // changes the board size
  case CHANGE_SIZE:
    return changeSize(state, action.newSize);

  // changes the smile
  case CHANGE_SMILE:
    return state.set('smile', action.newSmile);

  // performs CSP stuff
  case CSP:
    // create a variable for each cell on the fringe
    const variables = setVariables(state.get('cells'));
    // create a constraint for each revealed cell with a number
    let constraints = [];
    for (let i = 0; i < state.get('cells').size; i++) {
      for (let j = 0; j < state.getIn(['cells', 0]).size; j++) {
        if (!state.getIn(['cells', i, j, 'hidden']) && state.getIn(['cells', i, j, 'mines']) > Mines.ZERO) {
          constraints.push(buildConstraint(variables, i, j, state.getIn(['cells', i, j, 'mines'])));
        }
      }
    }
    // normalize the constraints
    constraints = normalize(constraints);
    // enforce unary constraints
    constraints = enforceUnary(constraints);
    // separate variables and constraints into individual components
    let newState = state.set('components', separateComponents(variables, constraints));
    // color code all cells found to be part of a component
    newState = newState.set('cells', colorCodeComponents(newState.get('cells'), newState.get('components')));
    return newState;

  // reveals a random open cell
  case PEEK:
    if (state.get('gameIsRunning') || !state.get('hasMines')) {
      return state.withMutations(s => {
        let row = Math.floor(Math.random() * state.get('cells').size);
        let col = Math.floor(Math.random() * state.getIn(['cells', 0]).size);
        // if there are no mines already, place mines and start the game
        if (!s.get('hasMines')) {
          s.set('cells', placeMines(s.get('cells'), s.get('numMines'), row, col));
          s.set('gameIsRunning', true);
          s.set('hasMines', true);
        } else {
          while (!s.getIn(['cells', row, col, 'hidden']) || s.getIn(['cells', row, col, 'mines']) === Mines.MINE) {
            row = Math.floor(Math.random() * s.get('cells').size);
            col = Math.floor(Math.random() * s.getIn(['cells', 0]).size);
          }
        }
        // reveal the cell
        s.setIn(['cells', row, col, 'hidden'], false);
        s.set('numRevealed', s.get('numRevealed') + 1);
        s.set('smile', 'SMILE');
        // if that cell had zero mines nearby, reveal all neighbors
        if (s.getIn(['cells', row, col, 'mines']) === Mines.ZERO) {
          const temp = revealNeighbors(s.get('cells'), s.get('numRevealed'), row, col);
          s.set('cells', temp.newCells);
          s.set('numRevealed', temp.newNumRevealed);
        }
        // if all the non-bomb cells are revealed, win the game
        if (s.get('numRevealed') === s.get('cells').size * s.getIn(['cells', 0]).size - s.get('numMines')) {
          s.set('cells', flagMines(s.get('cells')));
          s.set('numFlagged', s.get('numMines'));
          s.set('gameIsRunning', false);
          s.set('smile', 'WON');
        }
      });
    }
    return state;

  // resets the board
  case RESET_BOARD:
    if (!state.get('hasMines')) {
      return state;
    }
    return state.withMutations(s => {
      for (let i = 0; i < s.get('cells').size; i++) {
        for (let j = 0; j < s.getIn(['cells', 0]).size; j++) {
          s.setIn(['cells', i, j], Immutable.Map({
            component: 0,
            flagged: false,
            hidden: true,
            mines: Mines.ZERO,
          }));
        }
      }
      s.set('gameIsRunning', false);
      s.set('hasMines', false);
      s.set('numFlagged', 0);
      s.set('numRevealed', 0);
      s.set('smile', 'SMILE');
    });

  // reveals the clicked cell
  case REVEAL_CELL:
    if (state.get('gameIsRunning') || !state.get('hasMines')) {
      return state.withMutations(s => {
        // if there are no mines already, place mines and start the game
        if (!s.get('hasMines')) {
          s.set('cells', placeMines(s.get('cells'), s.get('numMines'), action.row, action.col));
          s.set('gameIsRunning', true);
          s.set('hasMines', true);
        }
        // reveal the cell
        s.setIn(['cells', action.row, action.col, 'hidden'], false);
        s.set('numRevealed', s.get('numRevealed') + 1);
        s.set('smile', 'SMILE');
        // if that cell had zero mines nearby, reveal all neighbors
        if (s.getIn(['cells', action.row, action.col, 'mines']) === Mines.ZERO) {
          const temp = revealNeighbors(s.get('cells'), s.get('numRevealed'), action.row, action.col);
          s.set('cells', temp.newCells);
          s.set('numRevealed', temp.newNumRevealed);
        // else if that cell had a mine, end the game and reveal all mines
        } else if (s.getIn(['cells', action.row, action.col, 'mines']) === Mines.MINE) {
          s.set('cells', revealMines(s.get('cells')));
          s.setIn(['cells', action.row, action.col, 'mines'], Mines.ERROR);
          s.set('gameIsRunning', false);
          s.set('smile', 'LOST');
        }
        // if all the non-bomb cells are revealed, win the game
        if (s.get('numRevealed') === s.get('cells').size * s.getIn(['cells', 0]).size - s.get('numMines')) {
          s.set('cells', flagMines(s.get('cells')));
          s.set('numFlagged', s.get('numMines'));
          s.set('gameIsRunning', false);
          s.set('smile', 'WON');
        }
      });
    }
    return state;

  // toggles the flag of the cell
  case TOGGLE_FLAG:
    return state.withMutations(s => {
      if (s.get('gameIsRunning') === true) {
        if (s.getIn(['cells', action.row, action.col, 'flagged']) === false
            && s.get('numFlagged') < s.get('numMines')) {
          s.setIn(['cells', action.row, action.col, 'flagged'], true);
          s.set('numFlagged', s.get('numFlagged') + 1);
        } else if (s.getIn(['cells', action.row, action.col, 'flagged']) === true) {
          s.setIn(['cells', action.row, action.col, 'flagged'], false);
          s.set('numFlagged', s.get('numFlagged') - 1);
        }
      }
    });

  default:
    return state;
  }
};

export default board;
