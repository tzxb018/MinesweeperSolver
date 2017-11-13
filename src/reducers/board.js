import {
  placeMines,
  revealMines,
  revealNeighbors,
} from './functions.js';

// default state for first render
const cells = [];
for (let i = 0; i < 16; i++) {
  cells.push([]);
  for (let j = 0; j < 16; j++) {
    cells[i].push({
      flagged: false,
      hidden: true,
      mines: 0,
    });
  }
}
const defaultState = {
  cells,
  gameIsRunning: false,
  hasMines: false,
  numFlagged: 0,
  numMines: 40,
  numRevealed: 0,
};

// reducer for the board property of state
export default function board(state = defaultState, action) {
  switch (action.type) {

  // resets the board
  case 'RESET_BOARD':
    const reset = state;
    for (let i = 0; i < reset.cells.length; i++) {
      for (let j = 0; j < reset.cells[0].length; j++) {
        reset.cells[i][j] = {
          flagged: false,
          hidden: true,
          mines: 0,
        };
      }
    }
    reset.gameIsRunning = false;
    reset.numFlagged = 0;
    reset.numRevealed = 0;
    return reset;

  // reveals the clicked cell
  case 'REVEAL_CELL':
    let reveal = state;
    // if there are no mines already, places mines and starts the game
    if (reveal.hasMines === false) {
      reveal.cells = placeMines(reveal.cells, action.row, action.col);
      reveal.gameIsRunning = true;
      reveal.hasMines = true;
    }
    reveal[action.row][action.col].hidden = false;
    reveal.numRevealed += 1;
   // if that cell had zero mines nearby, reveals all neighbors
    if (reveal.cells[action.row][action.col].mines === 0) {
      reveal = revealNeighbors(reveal, action.row, action.col);
    // else if that cell had a mine, ends the game and reveals all mines
    } else if (reveal.cells[action.row][action.col].mines === -1) {
      reveal.cells = revealMines(reveal.cells);
      reveal.gameIsRunning = false;
    }
    return reveal;

  // if the game is running and there aren't too many flags, toggles the flag
  case 'TOGGLE_FLAGGED':
    const toggle = state;
    if (toggle.gameIsRunning === true) {
      if (toggle[action.row][action.col].flagged === false && toggle.numFlagged < toggle.numMines) {
        toggle[action.row][action.col].flagged = true;
        toggle.numFlagged += 1;
      } else if (toggle[action.row][action.col].flagged === true) {
        toggle[action.row][action.col].flagged = false;
        toggle.numFlagged -= 1;
      }
    }
    return toggle;

  default:
    return state;
  }
}
