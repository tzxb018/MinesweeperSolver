import { connect } from 'react-redux';

import CSPButton from 'components/CSPButton';
import { generateCSPVariables } from 'actions/boardActions';

const mapStateToProps = state => ({
  gameIsRunning: state.board.get('gameIsRunning'),
});

const mapDispatchToProps = dispatch => ({
  generateCSPVariables: () => {
    dispatch(generateCSPVariables());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CSPButton);
