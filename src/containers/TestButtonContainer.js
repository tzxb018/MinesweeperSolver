import { connect } from 'react-redux';

import TestButton from 'components/TestButton';
import { test } from 'actions/boardActions';

const mapStateToProps = state => ({
  isGameRunning: state.board.present.get('isGameRunning'),
});

const mapDispatchToProps = dispatch => ({
  test: numIterations => {
    dispatch(test(numIterations));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestButton);
