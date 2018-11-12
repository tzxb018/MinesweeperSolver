import { connect } from 'react-redux';

import CellHighlight from 'components/CellHighlight';

const mapStateToProps = state => ({
  cells: state.cellHighlight,
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CellHighlight);
