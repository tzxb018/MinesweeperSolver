import { connect } from 'react-redux';

import Timer from 'components/Timer';

const mapStateToProps = state => ({
  gameIsRunning: state.board.present.get('gameIsRunning'),
  hasMines: state.board.present.get('hasMines'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timer);
