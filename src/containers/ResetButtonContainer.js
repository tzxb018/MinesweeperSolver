import { connect } from 'react-redux';

import ResetButton from 'components/ResetButton';
import {
  changeSmile,
  reset,
} from 'actions/boardActions';

const mapStateToProps = state => ({
  smile: state.board.present.get('smile'),
});

const mapDispatchToProps = dispatch => ({
  changeSmile: newSmile => {
    dispatch(changeSmile(newSmile));
  },

  reset: () => {
    dispatch(reset());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetButton);
