import { connect } from 'react-redux';

import StepButton from 'components/StepButton';
import { step } from 'actions/boardActions';

const mapStateToProps = state => ({
  isGameRunning: state.board.present.get('isGameRunning'),
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
