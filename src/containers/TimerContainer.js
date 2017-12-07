import { connect } from 'react-redux';

import Timer from 'components/Timer';

const mapStateToProps = state => ({
  gameIsRunning: state.board.get('gameIsRunning'),
  hasMines: state.board.get('hasMines'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timer);
