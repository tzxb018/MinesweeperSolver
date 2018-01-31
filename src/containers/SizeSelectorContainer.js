import { connect } from 'react-redux';

import SizeSelector from 'components/SizeSelector';
import { changeSize } from 'actions/boardActions.js';

const mapStateToProps = state => ({
  size: state.board.get('size'),
});

const mapDispatchToProps = dispatch => ({
  changeSize: (newSize) => {
    dispatch(changeSize(newSize));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SizeSelector);
