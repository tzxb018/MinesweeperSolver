import { connect } from 'react-redux';

import Cell from 'components/Cell/index.jsx';
import {
  revealCell,
  toggleFlag,
} from 'actions/cellActions.js';

const mapStateToProps = (state, ownProps) => ({
  flagged: state.board.get('cells').get(ownProps.row).get(ownProps.col).get('flagged'),
  hidden: state.board.get('cells').get(ownProps.row).get(ownProps.col).get('hidden'),
  mines: state.board.get('cells').get(ownProps.row).get(ownProps.col).get('mines'),

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
