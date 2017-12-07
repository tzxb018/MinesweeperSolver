import { connect } from 'react-redux';

import Minefield from 'components/Minefield/index.jsx';

const mapStateToProps = state => ({
  cols: state.board.getIn(['cells', 0]).size,
  rows: state.board.get('cells').size,
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Minefield);
