import { changeSize } from 'reducers/board/reducerFunctions';
import {
  placeNumbers,
  revealNeighbors,
} from 'reducers/board/cellUtils';
import processCSP from 'csp';
import {
  BoardSizes,
  HistoryLogStyles,
} from 'enums';
import HistoryLogItem from './HistoryLogItem';

/**
 * Translates the minefield into an XML Document.
 * @param {Immutable.Map<string, any>} minefield state of the minefield
 * @returns {Document} xml representation of the minefield
 */
export const createXMLDocument = minefield => {
  const doc = new Document();
  const xmlDoc = doc.implementation.createDocument(null, 'xml');
  const field = doc.createElement('field');

  // get the dimensions of the board
  const dimensions = doc.createElement('dimensions');
  dimensions.setAttribute('x', minefield.getIn(['cells', 0]).size);
  dimensions.setAttribute('y', minefield.get('cells').size);
  field.appendChild(dimensions);

  // get the bombs and known cells
  const bombs = doc.createElement('bombs');
  const knownSquares = doc.createElement('knownsquares');
  minefield.get('cells').forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.get('content') === -1) {
        const bomb = doc.createElement('bomb');
        bomb.setAttribute('x', x);
        bomb.setAttribute('y', y);
        bombs.appendChild(bomb);
        if (cell.get('isFlagged')) {
          const square = doc.createElement('square');
          square.setAttribute('x', x);
          square.setAttribute('y', y);
          knownSquares.appendChild(square);
        }
      } else if (!cell.get('isHidden')) {
        const square = doc.createElement('square');
        square.setAttribute('x', x);
        square.setAttribute('y', y);
        knownSquares.appendChild(square);
      }
    });
  });
  field.appendChild(bombs);
  field.appendChild(knownSquares);
  xmlDoc.documentElement.appendChild(field);

  return xmlDoc;
};

/**
 * Translates the new size specifications of the board into the state.
 * @param state state of the board
 * @param {object} newSize object describing the properties of the new board
 * @param {number} newSize.rows number of rows
 * @param {number} newSize.cols number of columns
 * @param {number} newSize.numMines number of mines
 * @returns newState
 */
const parseSize = (state, newSize) => {
  if (newSize.rows <= 9 && newSize.cols <= 9) {
    newSize.rows = 9;
    newSize.cols = 9;
    newSize.size = BoardSizes.BEGINNER;
  } else if (newSize.rows <= 16 && newSize.cols <= 16) {
    newSize.rows = 16;
    newSize.cols = 16;
    newSize.size = BoardSizes.INTERMEDIATE;
  } else if (newSize.rows <= 16 && newSize.cols <= 30) {
    newSize.rows = 16;
    newSize.cols = 30;
    newSize.size = BoardSizes.EXPERT;
  } else {
    newSize.size = BoardSizes.CUSTOM;
  }
  return changeSize(state, newSize);
};

/**
 * Loads the minefield given in the xml DOM into the state.
 * @param state state of the board
 * @param {Document} xmlDoc xml DOM representing a minefield
 * @param {string} [filename] name of the file that was fetched so it can be logged, undefined if the filename should
 * not be logged
 * @returns newState with the minefield loaded
 */
export const loadXMLDocument = (state, xmlDoc, filename) => {
  // parse the size of the board
  const newSize = {};
  const minSize = xmlDoc.getElementsByTagName('dimensions')[0];
  newSize.rows = minSize.getAttribute('y');
  newSize.cols = minSize.getAttribute('x');
  const bombs = xmlDoc.getElementsByTagName('bomb');
  newSize.numMines = bombs.length;
  const newState = parseSize(state, newSize);

  // load the minefield
  return newState.withMutations(s => {
    // place the mines
    const mines = [];
    s.updateIn(['minefield', 'cells'], cells => cells.withMutations(c => {
      for (let i = 0; i < bombs.length; i++) {
        const row = parseInt(bombs[i].getAttribute('y'), 10);
        const col = parseInt(bombs[i].getAttribute('x'), 10);
        c.setIn([row, col, 'content'], -1);
        mines.push({
          row,
          col,
        });
      }
    }));
    s.setIn(['minefield', 'numMines'], mines.length);

    // place the numbers
    s.updateIn(['minefield', 'cells'], c => placeNumbers(c, mines));

    // reveal the known squares
    s.set('isGameRunning', true);
    const knownSquares = xmlDoc.getElementsByTagName('square');
    const neighborQueue = [];
    s.update('minefield', minefield => minefield.withMutations(m => {
      for (let i = 0; i < knownSquares.length; i++) {
        const row = parseInt(knownSquares[i].getAttribute('y'), 10);
        const col = parseInt(knownSquares[i].getAttribute('x'), 10);
        if (m.getIn(['cells', row, col, 'content']) === 0) {
          neighborQueue.push({
            row,
            col,
          });
          m.setIn(['cells', row, col, 'isHidden'], false);
          m.update('numRevealed', n => n + 1);
        } else if (m.getIn(['cells', row, col, 'content']) === -1) {
          m.setIn(['cells', row, col, 'isFlagged'], true);
          m.update('numFlagged', n => n + 1);
        } else {
          m.setIn(['cells', row, col, 'isHidden'], false);
          m.update('numRevealed', n => n + 1);
        }
      }
    }));
    neighborQueue.forEach(({ row, col }) => s.update('minefield', m => revealNeighbors(m, row, col)));
    if (filename) {
      const message = `Successfully loaded ${filename}`;
      const log = new HistoryLogItem(message, HistoryLogStyles.GREEN, 'false');
      s.update('historyLog', h => h.push(log));
    }

    return processCSP(s, true);
  });
};

/**
 * Extracts the coord from the xml DOM string.
 * @param {string} xmlDoc xml DOM string
 * @param {number} index index to begin search
 * @returns {object} object with row and col coord properties and the index to continue searching
 */
const extractCoord = (xmlDoc, index) => {
  const coord = {};
  let start = xmlDoc.indexOf('"', index) + 1;
  let end = xmlDoc.indexOf('"', start);
  coord.col = parseInt(xmlDoc.substring(start, end), 10);

  start = xmlDoc.indexOf('"', end + 1) + 1;
  end = xmlDoc.indexOf('"', start);
  coord.row = parseInt(xmlDoc.substring(start, end), 10);

  coord.index = end + 1;
  return coord;
};

/**
 * Extracts the coords of all the nodes of the given type.
 * @param {string} xmlDoc xml DOM string
 * @param {string} searchTerm node type to search for all instances of
 * @returns {array} list of the coords of all the specified nodes
 */
const extractAllCoords = (xmlDoc, searchTerm) => {
  const coords = [];
  let index = xmlDoc.indexOf(searchTerm);
  while (index !== -1) {
    const coord = extractCoord(xmlDoc, index);
    coords.push({
      row: coord.row,
      col: coord.col,
    });
    index = xmlDoc.indexOf(searchTerm, coord.index);
  }
  return coords;
};

/**
 * Loads the minefield given in the xml string into the state.
 * @param state state of the board
 * @param {string} xmlDoc string representing the xml DOM
 */
export const loadXMLString = (state, xmlDoc) => {
  // get the dimensions of the board
  const dimensions = extractCoord(xmlDoc, xmlDoc.indexOf('dimensions'));
  const newSize = {
    rows: dimensions.row,
    cols: dimensions.col,
    size: BoardSizes.CUSTOM,
  };

  // get the bombs
  const mines = extractAllCoords(xmlDoc, '<bomb ');
  newSize.numMines = mines.length;

  // load the minefield
  return changeSize(state, newSize).withMutations(s => {
    s.set('isGameRunning', true);
    // place the mines and numbers
    s.updateIn(['minefield', 'cells'], cells => cells.withMutations(c => {
      mines.forEach(mine => { c.setIn([mine.row, mine.col, 'content'], -1); });
      return placeNumbers(c, mines);
    }));
    s.setIn(['minefield', 'numMines'], newSize.numMines);

    // reveal the known squares
    const squares = extractAllCoords(xmlDoc, '<square ');
    const neighborQueue = [];
    s.update('minefield', minefield => minefield.withMutations(m => {
      squares.forEach(square => {
        if (m.getIn(['cells', square.row, square.col, 'content']) === 0) {
          neighborQueue.push({
            row: square.row,
            col: square.col,
          });
          m.setIn(['cells', square.row, square.col, 'isHidden'], false);
          m.update('numRevealed', n => n + 1);
        } else if (m.getIn(['cells', square.row, square.col, 'content']) === -1) {
          m.setIn(['cells', square.row, square.col, 'isFlagged'], true);
          m.update('numFlagged', n => n + 1);
        } else {
          m.setIn(['cells', square.row, square.col, 'isHidden'], false);
          m.update('numRevealed', n => n + 1);
        }
      });
    }));
    neighborQueue.forEach(({ row, col }) => s.update('minefield', m => revealNeighbors(m, row, col)));

    return processCSP(s, true);
  });
};
