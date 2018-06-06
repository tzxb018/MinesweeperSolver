import { connect } from 'react-redux';

import PeekToggle from 'components/PeekToggle';
import { peek } from 'actions/boardActions';

const mapStateToProps = state => ({
  isPeeking: state.board.present.get('isPeeking'),
});

const mapDispatchToProps = dispatch => ({
  peek: () => {
    dispatch(peek());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeekToggle);
