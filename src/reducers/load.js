import 'babel-polyfill';
import { Actions } from 'enums';

const initialState = false;

/**
 * Reducer for the loading feature
 * @param state loading state
 * @param action redux action
 * @returns upated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.LOAD_END: return false;
    case Actions.LOAD_FAIL: console.log(action.error); return false;
    case Actions.LOAD_START: return true;
    default: return state;
  }
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
    console.log(`Request returned status ${res.statusText}`);
    if (res.statusText === 'Not Found') {
      throw 'file not found';
    }
    return res.text();
  }).then(response => new DOMParser().parseFromString(response, 'text/xml'));
};
