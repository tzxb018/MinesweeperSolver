import { connect } from 'react-redux';

import Board from 'components/Board';

const mapStateToProps = state => ({
  size: state.board.present.get('size'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Board);
