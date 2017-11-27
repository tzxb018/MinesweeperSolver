import { connect } from 'react-redux';

import Cell from 'components/Cell/index.jsx';
import {
  revealCell,
  toggleFlag,
} from 'actions/cellActions.js';

const mapStateToProps = (state, ownProps) => ({
  flagged: state.board.getIn(['cells', ownProps.row, ownProps.col, 'flagged']),
  hidden: state.board.getIn(['cells', ownProps.row, ownProps.col, 'hidden']),
  mines: state.board.getIn(['cells', ownProps.row, ownProps.col, 'mines']),

  ...ownProps,
});

const mapDispatchToProps = dispatch => ({
  revealCell: (row, col) => {
    dispatch(revealCell(row, col));
  },

  toggleFlag: (row, col) => {
    dispatch(toggleFlag(row, col));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cell);
