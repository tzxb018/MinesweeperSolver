import { connect } from 'react-redux';

import LoopButton from 'components/LoopButton';
import { loop } from 'actions/boardActions';

const mapStateToProps = state => ({
  isGameRunning: state.board.present.get('isGameRunning'),
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
