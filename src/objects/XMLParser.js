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
  const xmlDoc = document.implementation.createDocument(null, 'xml');
  const field = document.createElement('field');

  // get the dimensions of the board
  const dimensions = document.createElement('dimensions');
  dimensions.setAttribute('x', minefield.getIn(['cells', 0]).size);
  dimensions.setAttribute('y', minefield.get('cells').size);
  field.appendChild(dimensions);

  // get the bombs and known cells
  const bombs = document.createElement('bombs');
  const knownSquares = document.createElement('knownsquares');
  minefield.get('cells').forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.get('content') === -1) {
        const bomb = document.createElement('bomb');
        bomb.setAttribute('x', x);
        bomb.setAttribute('y', y);
        bombs.appendChild(bomb);
        if (cell.get('isFlagged')) {
          const square = document.createElement('square');
          square.setAttribute('x', x);
          square.setAttribute('y', y);
          knownSquares.appendChild(square);
        }
      } else if (!cell.get('isHidden')) {
        const square = document.createElement('square');
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
 * Loads the minefield given in the xml DOM into the state.
 * @param state state of the board
 * @param {Document} xmlDoc xml DOM representing a minefield
 * @param {string} filename name of the file that was fetched
 * @returns newState with the minefield loaded
 */
export const loadXMLDocument = (state, xmlDoc, filename) => {
  // parse the size of the board
  const newSize = {};
  const minSize = xmlDoc.getElementsByTagName('dimensions')[0];
  newSize.rows = minSize.getAttribute('y');
  newSize.cols = minSize.getAttribute('x');
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
  const bombs = xmlDoc.getElementsByTagName('bomb');
  newSize.numMines = bombs.length;
  const newState = changeSize(state, newSize);

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
        } else if (m.getIn(['cells', row, col, 'content']) === -1) {
          m.setIn(['cells', row, col, 'isFlagged'], true);
          m.update('numFlagged', n => n + 1);
        } else {
          m.setIn(['cells', row, col, 'isHidden'], false);
        }
      }
      m.set('numRevealed', knownSquares.length);
    }));
    neighborQueue.forEach(({ row, col }) => s.update('minefield', m => revealNeighbors(m, row, col)));
    const message = `Successfully loaded ${filename}`;
    const log = new HistoryLogItem(message, HistoryLogStyles.GREEN, 'false');
    s.update('historyLog', h => h.push(log));

    return processCSP(s, true);
  });
};
