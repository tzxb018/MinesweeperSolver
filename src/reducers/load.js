import 'babel-polyfill';

const initialState = false;

/**
 * Reducer for the loading feature
 * @param state loading state
 * @param action redux action
 * @returns upated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_END': return false;
    case 'LOAD_FAIL': console.log(action.error); return false;
    case 'LOAD_START': return true;
    default: return state;
  }
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
