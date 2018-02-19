import { connect } from 'react-redux';

import MineCounter from 'components/MineCounter';

const mapStateToProps = state => ({
  numMinesLeft: state.board.present.get('numMines') - state.board.present.get('numFlagged'),
  size: state.board.present.get('size'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MineCounter);
