import { connect } from 'react-redux';

import CascadeButton from 'components/CascadeButton';
import { cascade } from 'actions/boardActions';

const mapStateToProps = state => ({
  gameIsRunning: state.board.present.get('gameIsRunning'),
});

const mapDispatchToProps = dispatch => ({
  cascade: () => {
    dispatch(cascade());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CascadeButton);
