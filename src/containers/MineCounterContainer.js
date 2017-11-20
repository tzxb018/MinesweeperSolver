import { connect } from 'react-redux';

import MineCounter from 'components/MineCounter/index.jsx';

const mapStateToProps = state => ({
  numMinesLeft: state.board.get('numMines') - state.board.get('numFlagged'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MineCounter);
