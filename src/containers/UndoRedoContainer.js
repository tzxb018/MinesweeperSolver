import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import UndoRedo from 'components/UndoRedo';

const mapStateToProps = state => ({
  canUndo: state.board.past.length > 1,
  canRedo: state.board.future.length > 0,
});

const mapDispatchToProps = dispatch => ({
  onUndo: () => {
    dispatch(ActionCreators.undo());
  },

  onRedo: () => {
    dispatch(ActionCreators.redo());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UndoRedo);
