import { connect } from 'react-redux';

import PeekButton from 'components/PeekButton';
import { peek } from 'actions/boardActions';

const mapStateToProps = () => ({

});

const mapDispatchToProps = dispatch => ({
  peek: () => {
    dispatch(peek());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeekButton);
