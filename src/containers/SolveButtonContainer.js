import { connect } from 'react-redux';

import SolveButton from 'components/SolveButton';
import { solve } from 'actions/boardActions';

const mapStateToProps = state => ({
  gameIsRunning: state.board.present.get('gameIsRunning'),
});

const mapDispatchToProps = dispatch => ({
  solve: () => {
    dispatch(solve());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SolveButton);
