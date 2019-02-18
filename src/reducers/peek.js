import { Actions } from 'enums';

const initialState = false;

/**
 * Reducer for the peeking feature
 * @param state peeking state
 * @param action redux action
 * @returns updated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.TOGGLE_PEEK: return !state;
    default: return state;
  }
};
