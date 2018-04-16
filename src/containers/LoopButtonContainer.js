import { connect } from 'react-redux';

import LoopButton from 'components/LoopButton';
import { loop } from 'actions/boardActions';

const mapStateToProps = state => ({
  gameIsRunning: state.board.present.get('gameIsRunning'),
});

const mapDispatchToProps = dispatch => ({
  loop: () => {
    dispatch(loop());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoopButton);
