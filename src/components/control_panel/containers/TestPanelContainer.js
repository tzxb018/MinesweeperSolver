import { connect } from 'react-redux';

import TestPanel from 'components/control_panel/test_panel/TestPanel';
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
)(TestPanel);
