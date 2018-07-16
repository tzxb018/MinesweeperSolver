import { connect } from 'react-redux';

import ColorCodedKey from 'components/ColorCodedKey';
import { toggleActive } from 'actions/boardActions';

const mapStateToProps = state => ({
  BTS: state.board.present.getIn(['csp', 'isActive', 'BTS']),
  PWC: state.board.present.getIn(['csp', 'isActive', 'PWC']),
  STR: state.board.present.getIn(['csp', 'isActive', 'STR']),
  Unary: state.board.present.getIn(['csp', 'isActive', 'Unary']),
});

const mapDispatchToProps = dispatch => ({
  toggleActive: name => {
    dispatch(toggleActive(name));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ColorCodedKey);
