import { connect } from 'react-redux';

import Gameboard from 'components/gameboard/Gameboard';

const mapStateToProps = state => ({
  numRows: state.board.present.getIn(['minefield', 'cells']).size,
  numCols: state.board.present.getIn(['minefield', 'cells', 0]).size,
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gameboard);
