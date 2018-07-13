import { connect } from 'react-redux';

import StepButton from 'components/StepButton';
import { step } from 'actions/boardActions';
import { changeSmile } from 'actions/smileActions';

const mapStateToProps = state => ({
  canStep: state.board.present.get('isGameRunning') && state.board.present.getIn(['csp', 'isConsistent'])
    && state.board.present.getIn(['csp', 'solvable']).size > 0,
});

const mapDispatchToProps = dispatch => ({
  changeSmile: newSmile => {
    dispatch(changeSmile(newSmile));
  },

  step: () => {
    dispatch(step());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StepButton);
