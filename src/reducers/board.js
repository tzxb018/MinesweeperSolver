import Immutable from 'immutable';

import {
  INCREMENT_TIMER,
  RESET_BOARD,
} from 'actions/boardActions';
import {
  REVEAL_CELL,
  TOGGLE_FLAG,
} from 'actions/cellActions';

import {
  flagMines,
  placeMines,
  revealMines,
  revealNeighbors,
} from './functions';

// default state for first render
let cells = Immutable.List();
for (let i = 0; i < 16; i++) {
  let row = Immutable.List();
  for (let j = 0; j < 16; j++) {
    row = row.push(Immutable.Map({
      flagged: false,
      hidden: true,
      mines: 0,
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
  timer: 0,
});

// reducer for the board property of state
const board = (state = initialState, action) => {
  switch (action.type) {

  // increments the timer
  case INCREMENT_TIMER:
    return state.withMutations(s => {
      s.set('timer', s.get('timer') + 1);
    });

  // resets the board
  case RESET_BOARD:
    return state.withMutations(s => {
      for (let i = 0; i < s.get('cells').size; i++) {
        for (let j = 0; j < s.getIn(['cells', 0]).size; j++) {
          s.setIn(['cells', i, j], Immutable.Map({
            flagged: false,
            hidden: true,
            mines: 0,
          }));
        }
      }
      s.set('gameIsRunning', false);
      s.set('hasMines', false);
      s.set('numFlagged', 0);
      s.set('numRevealed', 0);
      s.set('timer', 0);
    });

  // reveals the clicked cell
  case REVEAL_CELL:
    if (state.get('gameIsRunning') === true || state.get('hasMines') === false) {
      return state.withMutations(s => {
        // if there are no mines already, place mines and start the game
        if (s.get('hasMines') === false) {
          s.set('cells', placeMines(s.get('cells'), s.get('numMines'), action.row, action.col));
          s.set('gameIsRunning', true);
          s.set('hasMines', true);
        }

        // reveal the cell
        s.setIn(['cells', action.row, action.col, 'hidden'], false);
        s.set('numRevealed', s.get('numRevealed') + 1);

        // if that cell had zero mines nearby, reveal all neighbors
        if (s.getIn(['cells', action.row, action.col, 'mines']) === 0) {
          const temp = revealNeighbors(s.get('cells'), s.get('numRevealed'), action.row, action.col);
          s.set('cells', temp.cells);
          s.set('numRevealed', temp.newNumRevealed);

        // else if that cell had a mine, end the game and reveal all mines
        } else if (s.getIn(['cells', action.row, action.col, 'mines']) === -1) {
          s.set('cells', revealMines(s.get('cells')));
          s.set('gameIsRunning', false);
        }

        // if all the non-bomb cells are revealed, win the game
        if (s.get('numRevealed') === s.get('cells').size * s.getIn(['cells', 0]).size - s.get('numMines')) {
          s.set('cells', flagMines(s.get('cells')));
          s.set('gameIsRunning', false);
        }
      });
    }
    return state;

  // if the game is running and there aren't too many flags, toggle the flag
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
