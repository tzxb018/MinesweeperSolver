import { connect } from 'react-redux';

import PeekToggle from 'components/PeekToggle';
import { togglePeek } from 'actions/peekActions';

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
