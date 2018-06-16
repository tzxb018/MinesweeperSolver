import Immutable from 'immutable';

const initialState = Immutable.Map({
  counter: 0,
  timer: null,
});

const resetTimer = state => state.set('counter', 0).update('timer', t => clearInterval(t));

/**
 * Reducer for the timer feature
 * @param state timer state
 * @param action redux action
 * @returns updated state
 */
export default (state = initialState, action) => {
  switch (action.type) {
  case 'CHANGE_SIZE': return resetTimer(state);
  case 'INCREMENT': return state.update('counter', c => c + 1);
  case 'RESET': return resetTimer(state);
  case 'START': return state.set('timer', action.newTimer);
  case 'STOP': return state.update('timer', t => clearInterval(t));
  default: return state;
  }
};
