import 'babel-polyfill';
import { Actions } from 'enums';
import { createXMLDocument } from 'objects/XMLParser';

const initialCanReportErrorState = true;
/**
 * Reducer for the error report feature
 * @param state can report error state
 * @param action redux action
 * @returns upated state
 */
export const canReportError = (state = initialCanReportErrorState, action) => {
  switch (action.type) {
    case Actions.REPORT_ERROR_TIMEOUT: return true;
    case Actions.REPORT_ERROR_START: return false;
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
 * @returns Promise with ok status if the email was successfully sent
 */
export const sendReport = async minefield => {
  const url = 'http://localhost:8000/report';
  const xmlDoc = createXMLDocument(minefield);

  return fetch(url, {
    method: 'POST',
    body: new XMLSerializer().serializeToString(xmlDoc),
    headers: {
      'Content-Type': 'text/xml',
    },
  });
};
