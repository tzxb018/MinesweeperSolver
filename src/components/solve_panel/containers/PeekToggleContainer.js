import { connect } from 'react-redux';

import PeekToggle from 'components/solve_panel/PeekToggle';
import { togglePeek } from 'actions/miscActions';

const mapStateToProps = state => ({
  isPeeking: state.isPeeking,
});

const mapDispatchToProps = dispatch => ({
  togglePeek: () => {
    dispatch(togglePeek());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeekToggle);
