import { connect } from 'react-redux';

import ColorCodedKey from 'components/ColorCodedKey';
import { toggleActive } from 'actions/boardActions';

const mapStateToProps = state => ({
  BC: state.board.present.getIn(['csp', 'algorithms', 'BT', 'subSets', 'BC']),
  BT: state.board.present.getIn(['csp', 'algorithms', 'BT', 'isActive']),
  FC: state.board.present.getIn(['csp', 'algorithms', 'BT', 'subSets', 'FC']),
  'FC-STR': state.board.present.getIn(['csp', 'algorithms', 'BT', 'subSets', 'FC-STR']),
  m: state.board.present.getIn(['csp', 'algorithms', 'mWC', 'm']),
  mWC: state.board.present.getIn(['csp', 'algorithms', 'mWC', 'isActive']),
  STR2: state.board.present.getIn(['csp', 'algorithms', 'STR2', 'isActive']),
});

const mapDispatchToProps = dispatch => ({
  toggleActive: (name, modifier) => {
    dispatch(toggleActive(name, modifier));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ColorCodedKey);
