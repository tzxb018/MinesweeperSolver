import { connect } from 'react-redux';

import Minefield from 'components/Minefield';

const mapStateToProps = state => ({
  cols: state.board.present.getIn(['cells', 0]).size,
  rows: state.board.present.get('cells').size,
  size: state.board.present.get('size'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Minefield);
