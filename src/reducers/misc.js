import Immutable from 'immutable';
import {
  Actions,
  Smiles,
} from 'enums';

/**
 * Resets the counter and stops the timer
 * @param {Immutable.Map<string, any>} state state of the timer
 * @returns {Immutable.Map<string, any>} new state
 */
const resetTimer = state => state.set('counter', 0).update('timer', t => clearInterval(t));


const initialIsPeekingState = false;
/**
 * Reducer for the peeking feature
 * @param state peeking state
 * @param action redux action
 * @returns updated state
 */
export const isPeeking = (state = initialIsPeekingState, action) => {
  switch (action.type) {
    case Actions.TOGGLE_PEEK: return !state;
    default: return state;
  }
};

const initialSmileState = Smiles.SMILE;
/**
 * Reducer for the smile feature
 * @param state smile state
 * @param action redux action
 * @returns updated state
 */
export const smile = (state = initialSmileState, action) => {
  switch (action.type) {
    case Actions.CHANGE_SIZE: return initialSmileState;
    case Actions.CHANGE_SMILE: return action.newSmile;
    case Actions.RESET: return initialSmileState;
    default: return state;
  }
};

const initialTimerState = Immutable.Map({
  counter: 0,
  timer: null,
});
/**
 * Reducer for the timer feature.
 * @param state timer state
 * @param action redux action
 * @returns updated state
 */
export const timer = (state = initialTimerState, action) => {
  switch (action.type) {
    case Actions.CHANGE_SIZE: return resetTimer(state);
    case Actions.INCREMENT: return state.update('counter', c => c + 1);
    case Actions.RESET: return resetTimer(state);
    case Actions.START: return state.set('timer', action.newTimer);
    case Actions.STOP: return state.update('timer', t => clearInterval(t));
    default: return state;
  }
};
