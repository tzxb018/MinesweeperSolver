import { connect } from 'react-redux';

import Minefield from 'components/gameboard/minefield/Minefield';

const mapStateToProps = state => ({
  isReportingError: state.reportError.get('isReportingError'),
  numCols: state.board.present.getIn(['minefield', 'cells', 0]).size,
  numRows: state.board.present.getIn(['minefield', 'cells']).size,
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Minefield);
