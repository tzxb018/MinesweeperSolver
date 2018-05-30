import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import HistoryLog from 'components/HistoryLog';

const mapStateToProps = state => ({
  historyLog: state.board.present.get('historyLog'),
});

const mapDispatchToProps = dispatch => ({
  jump: numSteps => {
    dispatch(ActionCreators.jump(numSteps));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryLog);
