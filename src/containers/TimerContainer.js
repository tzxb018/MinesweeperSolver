import { connect } from 'react-redux';

import Timer from 'components/Timer';

const mapStateToProps = state => ({
  gameIsRunning: state.board.present.get('gameIsRunning'),
  hasMines: state.board.present.get('hasMines'),
  size: state.board.present.get('size'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timer);
