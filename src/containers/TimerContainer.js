import { connect } from 'react-redux';

import Timer from 'components/Timer';
import {
  increment,
  start,
  stop,
} from 'actions/timerActions';

const mapStateToProps = state => ({
  counter: state.timer.get('counter'),
  isGameRunning: state.board.present.get('isGameRunning'),
});

const mapDispatchToProps = dispatch => ({
  increment: () => {
    dispatch(increment());
  },

  start: newTimer => {
    dispatch(start(newTimer));
  },

  stop: () => {
    dispatch(stop());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timer);
