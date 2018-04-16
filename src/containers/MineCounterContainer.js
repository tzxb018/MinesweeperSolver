import { connect } from 'react-redux';

import MineCounter from 'components/MineCounter';

const mapStateToProps = state => ({
  numMinesLeft: state.board.present.get('numMines') - state.board.present.getIn(['minefield', 'numFlagged']),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MineCounter);
