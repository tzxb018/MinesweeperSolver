import { connect } from 'react-redux';

import Load from 'components/control_panel/size_panel/Load';
import {
  loadEnd,
  loadFail,
  loadStart,
} from 'actions/asyncActions';

const mapStateToProps = state => ({
  isLoading: state.load,
});

const mapDispatchToProps = dispatch => ({
  loadEnd: (newState, message) => {
    dispatch(loadEnd(newState, message));
  },

  loadFail: error => {
    dispatch(loadFail(error));
  },

  loadStart: () => {
    dispatch(loadStart());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Load);
