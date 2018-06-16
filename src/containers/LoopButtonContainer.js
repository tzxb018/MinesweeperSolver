import { connect } from 'react-redux';

import LoopButton from 'components/LoopButton';
import { loop } from 'actions/boardActions';
import { changeSmile } from 'actions/smileActions';

const mapStateToProps = state => ({
  isGameRunning: state.board.present.get('isGameRunning'),
});

const mapDispatchToProps = dispatch => ({
  changeSmile: newSmile => {
    dispatch(changeSmile(newSmile));
  },

  loop: () => {
    dispatch(loop());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoopButton);
