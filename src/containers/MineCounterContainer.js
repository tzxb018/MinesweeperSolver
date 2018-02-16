import { connect } from 'react-redux';

import MineCounter from 'components/MineCounter';

const mapStateToProps = state => ({
  numMinesLeft: state.board.get('numMines') - state.board.get('numFlagged'),
  size: state.board.get('size'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MineCounter);
