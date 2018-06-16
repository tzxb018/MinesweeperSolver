import { connect } from 'react-redux';

import StepButton from 'components/StepButton';
import { step } from 'actions/boardActions';
import { changeSmile } from 'actions/smileActions';

const mapStateToProps = state => ({
  isGameRunning: state.board.present.get('isGameRunning'),
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
