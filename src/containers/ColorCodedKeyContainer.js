import { connect } from 'react-redux';

import ColorCodedKey from 'components/ColorCodedKey';
import { toggleActive } from 'actions/boardActions';

const mapStateToProps = state => ({
  BC: state.board.present.getIn(['csp', 'isActive', 'BC']),
  BTS: state.board.present.getIn(['csp', 'isActive', 'BTS']),
  FC: state.board.present.getIn(['csp', 'isActive', 'FC']),
  FCSTR: state.board.present.getIn(['csp', 'isActive', 'FCSTR']),
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
