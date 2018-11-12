import { connect } from 'react-redux';

import Board from 'components/Board';

const mapStateToProps = state => ({
  numRows: state.board.present.getIn(['minefield', 'cells']).size,
  numCols: state.board.present.getIn(['minefield', 'cells', 0]).size,
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Board);
