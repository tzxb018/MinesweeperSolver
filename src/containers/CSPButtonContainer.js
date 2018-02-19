import { connect } from 'react-redux';

import CSPButton from 'components/CSPButton';
import { csp } from 'actions/boardActions';

const mapStateToProps = state => ({
  gameIsRunning: state.board.present.get('gameIsRunning'),
});

const mapDispatchToProps = dispatch => ({
  csp: () => {
    dispatch(csp());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CSPButton);
