import { connect } from 'react-redux';

import Cell from 'components/Cell';
import {
  changeSmile,
  revealCell,
  toggleFlag,
} from 'actions/boardActions';

const mapStateToProps = (state, ownProps) => ({
  component: state.board.present.getIn(['minefield', 'cells', ownProps.row, ownProps.col, 'component']),
  flagged: state.board.present.getIn(['minefield', 'cells', ownProps.row, ownProps.col, 'flagged']),
  hidden: state.board.present.getIn(['minefield', 'cells', ownProps.row, ownProps.col, 'hidden']),
  mines: state.board.present.getIn(['minefield', 'cells', ownProps.row, ownProps.col, 'mines']),
  ...ownProps,
});

const mapDispatchToProps = dispatch => ({
  changeSmile: newSmile => {
    dispatch(changeSmile(newSmile));
  },

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
