import { writeFile } from 'fs';

import { initTestState } from 'reducers/board/testFunctions';
import { reset, initialize } from 'reducers/board/reducerFunctions';
import {
  placeMines,
  revealNeighbors,
} from 'reducers/board/cellUtils';

const populateMinefield = state => {
  const row = Math.floor(Math.random() * state.getIn(['minefield', 'cells']).size);
  const col = Math.floor(Math.random() * state.getIn(['minefield', 'cells', 0]).size);
  let newState = state.updateIn(['minefield', 'cells'], c =>
    placeMines(c, state.getIn(['minefield', 'numMines']), row, col));
  newState = newState.update('minefield', m => revealNeighbors(m, row, col));
  return newState;
};

const createXMLDocumentString = minefield => {
  const bombs = [];
  const squares = [];
  minefield.get('cells').forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.get('content') === -1) {
        bombs.push({ x, y });
      } else if (!cell.get('isHidden')) {
        squares.push({ x, y });
      }
    });
  });
  let xmlString = '<field>\n';
  xmlString += `\t<dimensions x="${minefield.get('cells').size}" y="${minefield.getIn(['cells', 0]).size}" />\n`;
  xmlString += '\t<bombs>\n';
  bombs.forEach(bomb => {
    xmlString += `\t\t<bomb x="${bomb.x}" y="${bomb.y}" />\n`;
  });
  xmlString += '\t</bombs>\n';
  xmlString += '\t<knownsquares>\n';
  squares.forEach(square => {
    xmlString += `\t\t<square x="${square.x}" y="${square.y}" />\n`;
  });
  xmlString += '\t</knownsquares>\n';
  xmlString += '</field>\n';
  return xmlString;
};

const generateTestCases = (boardSettings, numInstances) => {
  let state = initTestState(boardSettings);
  for (let i = 0; i < numInstances; i++) {
    state = populateMinefield(state);
    const instance = createXMLDocumentString(state.get('minefield'));
    writeFile(`src/tests/cases/instance${i}.xml`, instance, err => { if (err) throw err; });
    state = reset(state);
  }
  console.log('Tests successfully generated');
};

const boardSettings = {
  numRows: 16,
  numCols: 16,
  numMines: 40,
  algorithms: initialize().getIn(['csp', 'algorithms']),
};

generateTestCases(boardSettings, 1000);
