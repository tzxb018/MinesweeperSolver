import { Actions } from 'enums';
import { createXMLDocument } from 'objects/XMLParser';

const initialState = true;

/**
 * Reducer for the loading feature
 * @param state loading state
 * @param action redux action
 * @returns upated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.REPORT_ERROR_TIMEOUT: return true;
    case Actions.REPORT_ERROR_START: return false;
    default: return state;
  }
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
