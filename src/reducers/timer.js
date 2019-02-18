import Immutable from 'immutable';
import { Actions } from 'enums';

const initialState = Immutable.Map({
  counter: 0,
  timer: null,
});

/**
 * Resets the counter and stops the timer
 * @param {Immutable.Map<string, any>} state state of the timer
 * @returns {Immutable.Map<string, any>} new state
 */
const resetTimer = state => state.set('counter', 0).update('timer', t => clearInterval(t));

/**
 * Reducer for the timer feature
 * @param state timer state
 * @param action redux action
 * @returns updated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.CHANGE_SIZE: return resetTimer(state);
    case Actions.INCREMENT: return state.update('counter', c => c + 1);
    case Actions.RESET: return resetTimer(state);
    case Actions.START: return state.set('timer', action.newTimer);
    case Actions.STOP: return state.update('timer', t => clearInterval(t));
    default: return state;
  }
};
