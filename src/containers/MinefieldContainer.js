import { connect } from 'react-redux';

import Minefield from 'components/Minefield';

const mapStateToProps = state => ({
  cols: state.board.present.getIn(['minefield', 'cells', 0]).size,
  rows: state.board.present.getIn(['minefield', 'cells']).size,
  size: state.board.present.get('size'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Minefield);
