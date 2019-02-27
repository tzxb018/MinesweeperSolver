import { connect } from 'react-redux';

import StepLoop from 'components/solve_panel/StepLoop';
import { loop, step } from 'actions/boardActions';
import { changeSmile } from 'actions/miscActions';

const mapStateToProps = state => ({
  canStep: state.board.present.get('isGameRunning') && state.board.present.getIn(['csp', 'isConsistent'])
    && state.board.present.getIn(['csp', 'solvable']).size > 0,
});

const mapDispatchToProps = dispatch => ({
  changeSmile: newSmile => {
    dispatch(changeSmile(newSmile));
  },

  loop: () => {
    dispatch(loop());
  },

  step: () => {
    dispatch(step());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StepLoop);
