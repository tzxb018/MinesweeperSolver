import { connect } from 'react-redux';

import CellHighlight from 'components/CellHighlight';

const mapStateToProps = state => ({
  cells: state.cellHighlight,
  size: state.board.present.get('size'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CellHighlight);
