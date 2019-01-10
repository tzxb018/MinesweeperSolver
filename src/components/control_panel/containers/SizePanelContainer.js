import { connect } from 'react-redux';

import SizeSelector from 'components/control_panel/size_panel/SizePanel';
import { changeSize } from 'actions/boardActions';

const mapStateToProps = state => ({
  size: state.board.present.get('size'),
});

const mapDispatchToProps = dispatch => ({
  changeSize: newSize => {
    dispatch(changeSize(newSize));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SizeSelector);
