import 'babel-polyfill';
import Immutable from 'immutable';
import { Actions } from 'enums';
import { createXMLDocument } from 'objects/XMLParser';

/**
 * Handles the highlight action when error reporting is active.
 * @param state state of the error report
 * @param {Immutable.List<object>} cells list of affected cells to add/remove
 * @returns newState with affected cells added/removed
 */
const highlight = (state, cells) => {
  let newState = state;
  cells.forEach(cell => {
    const index = newState.get('cells').findIndex(c => c.row === cell.row && c.col === cell.col);
    if (index !== -1) {
      newState = newState.update('cells', c => c.delete(index));
    } else {
      newState = newState.update('cells', c => c.push(cell));
    }
  });
  return newState;
};
const initialReportErrorState = new Immutable.Map({
  canReportError: true,
  cells: new Immutable.List(),
  isReportingError: false,
});
/**
 * Reducer for the error report feature
 * @param state can report error state
 * @param action redux action
 * @returns upated state
 */
export const reportError = (state = initialReportErrorState, action) => {
  switch (action.type) {
    case Actions.CHANGE_SIZE: return state.update('cells', c => c.clear());
    case Actions.HIGHLIGHT: return state.get('isReportingError') ? highlight(state, action.cells) : state;
    case Actions.REPORT_ERROR_START: return state.set('canReportError', false);
    case Actions.REPORT_ERROR_TIMEOUT: return state.set('canReportError', true).update('cells', c => c.clear());
    case Actions.REPORT_ERROR_TOGGLE: return state.set('isReportingError', action.newValue);
    case Actions.RESET: return state.update('cells', c => c.clear());
    default: return state;
  }
};

const initialIsLoadingState = false;
/**
 * Reducer for the loading feature
 * @param state loading state
 * @param action redux action
 * @returns upated state
 */
export const isLoading = (state = initialIsLoadingState, action) => {
  switch (action.type) {
    case Actions.LOAD_END: return false;
    case Actions.LOAD_FAIL: return false;
    case Actions.LOAD_START: return true;
    default: return state;
  }
};

const initialIsTestingState = false;
/**
 * Reducer for the testing feature
 * @param state testing state
 * @param action redux action
 * @returns upated state
 */
export const isTesting = (state = initialIsTestingState, action) => {
  switch (action.type) {
    case Actions.TEST_END: return false;
    case Actions.TEST_START: return true;
    default: return state;
  }
};


/* helper functions */

/**
 * Parses the list of affected cells into a string representation.
 * @param {Immutable.List<object>} cells list of affected cells
 * @return {string} string representation of the affected cells
 */
export const cellsToString = cells => {
  let s = '';
  if (!cells.isEmpty()) {
    const first = cells.first();
    s += `(${first.row},${first.col})`;
    cells.skip(1).forEach(cell => {
      s += `, (${cell.row},${cell.col})`;
    });
  }
  return s;
};

/**
 * Handles the load start action by loading the user specified file.
 * @param {File} file user specified XML file to be loaded
 * @returns Promise of Document representation of the specified file
 */
export const loadFile = async file => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject('file load failed');
    };
    reader.onload = () => { resolve(reader.result); };
    reader.readAsText(file);
  })
  .then(response => new DOMParser().parseFromString(response, 'text/xml'));
};

/**
 * Handles the load start action by fetching the requested file.
 * @param state state of the board
 * @param {string} filename XML file to be loaded
 * @returns Promise of Document representation of the requested file
 */
export const loadProblem = async filename => {
  const url = `http://localhost:8000/${filename}`;

  return fetch(url, {
    method: 'GET',
  })
  .then(res => {
    if (!res.ok) {
      throw Error(res.statusText);
    }
    return res.text();
  }).then(response => new DOMParser().parseFromString(response, 'text/xml'));
};

/**
 * Handles the sendReport action by posting the current state to the server for emailing to the administrator.
 * @param minefield state of the minefield
 * @param {string} description description of the issue
 * @param {string} cells list of cells that are affected by the issue
 * @returns Promise with ok status if the email was successfully sent
 */
export const sendReport = async (minefield, description, cells) => {
  const url = 'http://localhost:8000/report';
  const xmlDoc = createXMLDocument(minefield);
  const body = {
    cells,
    description,
    xmlDoc: new XMLSerializer().serializeToString(xmlDoc),
  };

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
