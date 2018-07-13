import { connect } from 'react-redux';

import LoopButton from 'components/LoopButton';
import { loop } from 'actions/boardActions';
import { changeSmile } from 'actions/smileActions';

const mapStateToProps = state => ({
  canLoop: state.board.present.get('isGameRunning') && state.board.present.getIn(['csp', 'isConsistent'])
    && state.board.present.getIn(['csp', 'solvable']).size > 0,
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
