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
    case Actions.TEST_END: return false;
    case Actions.TEST_START: return true;
    default: return state;
  }
};
