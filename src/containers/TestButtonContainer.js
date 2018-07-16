import { connect } from 'react-redux';

import TestButton from 'components/TestButton';
import { test } from 'actions/boardActions';

const mapStateToProps = state => ({
  canTest: !state.board.present.get('isGameRunning') && state.board.present.getIn(['minefield', 'numRevealed']) === 0,
});

const mapDispatchToProps = dispatch => ({
  test: (numIterations, allowCheats, stopOnError) => {
    dispatch(test(numIterations, allowCheats, stopOnError));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestButton);
