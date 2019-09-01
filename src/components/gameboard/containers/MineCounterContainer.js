import { connect } from 'react-redux';

import MineCounter from 'components/gameboard/control_header/MineCounter';

const mapStateToProps = state => ({
  numMinesLeft: state.board.present.getIn(['minefield', 'numMines'])
    - state.board.present.getIn(['minefield', 'numFlagged']),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MineCounter);
