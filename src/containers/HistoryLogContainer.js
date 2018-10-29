import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import HistoryLog from 'components/HistoryLog';
import {
  clear,
  highlight,
} from 'actions/cellHighlightActions';

const mapStateToProps = state => ({
  historyLog: state.board.present.get('historyLog'),
});

const mapDispatchToProps = dispatch => ({
  clear: () => {
    dispatch(clear());
  },

  highlight: cells => {
    dispatch(highlight(cells));
  },

  jump: numSteps => {
    dispatch(ActionCreators.jump(-numSteps));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryLog);
