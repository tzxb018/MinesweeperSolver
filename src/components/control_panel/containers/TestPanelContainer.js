import { connect } from 'react-redux';

import TestPanel from 'components/control_panel/test_panel/TestPanel';
import {
  testEnd,
  testStart,
} from 'actions/asyncActions';

const mapStateToProps = state => ({
  algorithms: state.board.present.getIn(['csp', 'algorithms']),
  isTesting: state.isTesting,
  numCols: state.board.present.getIn(['minefield', 'cells', 0]).size,
  numMines: state.board.present.getIn(['minefield', 'numMines']),
  numRows: state.board.present.getIn(['minefield', 'cells']).size,
});

const mapDispatchToProps = dispatch => ({
  testEnd: newState => {
    dispatch(testEnd(newState));
  },

  testStart: () => {
    dispatch(testStart());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestPanel);
