import { connect } from 'react-redux';

import CheatButton from 'components/CheatButton';
import { cheat } from 'actions/boardActions';

const mapStateToProps = state => ({
  canCheat: state.board.present.get('isGameRunning') || state.board.present.getIn(['minefield', 'numRevealed']) === 0,
});

const mapDispatchToProps = dispatch => ({
  cheat: isRandom => {
    dispatch(cheat(isRandom));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheatButton);
