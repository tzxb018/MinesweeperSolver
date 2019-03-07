import { connect } from 'react-redux';

import Cell from 'components/gameboard/minefield/Cell';
import {
  loseGame,
  revealCell,
  toggleFlag,
} from 'actions/boardActions';
import { highlight } from 'actions/cellHighlightActions';
import { changeSmile } from 'actions/miscActions';

const mapStateToProps = (state, ownProps) => ({
  content: state.board.present.getIn(['minefield', 'cells', ownProps.row, ownProps.col, 'content']),
  cspColor: state.board.present.getIn(['minefield', 'cells', ownProps.row, ownProps.col, 'color']),
  cspSolution: state.board.present.getIn(['minefield', 'cells', ownProps.row, ownProps.col, 'solution']),
  isFlagged: state.board.present.getIn(['minefield', 'cells', ownProps.row, ownProps.col, 'isFlagged']),
  isGameRunning: state.board.present.get('isGameRunning'),
  isHidden: state.board.present.getIn(['minefield', 'cells', ownProps.row, ownProps.col, 'isHidden']),
  isHighlighted: state.cellHighlight.getIn([ownProps.row, ownProps.col]),
  isPeeking: state.isPeeking,
  isReportingError: state.reportError.get('isReportingError'),
  ...ownProps,
});

const mapDispatchToProps = dispatch => ({
  changeSmile: newSmile => {
    dispatch(changeSmile(newSmile));
  },

  highlight: cells => {
    dispatch(highlight(cells));
  },

  loseGame: (row, col) => {
    dispatch(loseGame(row, col));
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
