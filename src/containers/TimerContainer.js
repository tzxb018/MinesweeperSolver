import { connect } from 'react-redux';

import Timer from 'components/Timer';

const mapStateToProps = state => ({
  isGameRunning: state.board.present.get('isGameRunning'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timer);
