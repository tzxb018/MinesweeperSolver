import { connect } from 'react-redux';

import StepButton from 'components/StepButton';
import { step } from 'actions/boardActions';

const mapStateToProps = state => ({
  gameIsRunning: state.board.present.get('gameIsRunning'),
});

const mapDispatchToProps = dispatch => ({
  step: () => {
    dispatch(step());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StepButton);
