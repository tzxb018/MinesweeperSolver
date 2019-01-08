const initialState = 'SMILE';

/**
 * Reducer for the smile feature
 * @param state smile state
 * @param action redux action
 * @returns updated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_SIZE': return initialState;
    case 'CHANGE_SMILE': return action.newSmile;
    case 'RESET': return initialState;
    default: return state;
  }
};
