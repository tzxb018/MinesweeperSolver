import { connect } from 'react-redux';

import ResetButton from 'components/ResetButton/index.jsx';
import { resetBoard } from 'actions/boardActions.js';

const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({
  resetBoard: () => {
    dispatch(resetBoard());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetButton);
