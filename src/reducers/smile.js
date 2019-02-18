import { Actions } from 'enums';

const initialState = 'SMILE';

/**
 * Reducer for the smile feature
 * @param state smile state
 * @param action redux action
 * @returns updated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.CHANGE_SIZE: return initialState;
    case Actions.CHANGE_SMILE: return action.newSmile;
    case Actions.RESET: return initialState;
    default: return state;
  }
};
