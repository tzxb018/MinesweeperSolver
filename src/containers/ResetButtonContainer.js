import { connect } from 'react-redux';

import ResetButton from 'components/ResetButton';
import {
  changeSmile,
  resetBoard,
} from 'actions/boardActions';

const mapStateToProps = state => ({
  size: state.board.get('size'),
  smile: state.board.get('smile'),
});

const mapDispatchToProps = dispatch => ({
  changeSmile: newSmile => {
    dispatch(changeSmile(newSmile));
  },

  resetBoard: () => {
    dispatch(resetBoard());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetButton);
