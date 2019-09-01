import { connect } from 'react-redux';
import AlgorithmToggle from 'components/solve_panel/AlgorithmToggle';
import { toggleActive } from 'actions/boardActions';
import { Algorithms } from 'enums';

const mapStateToProps = state => ({
  BC: state.board.present.getIn(['csp', 'algorithms', Algorithms.BT, 'subSets', Algorithms.BC]),
  BT: state.board.present.getIn(['csp', 'algorithms', Algorithms.BT, 'isActive']),
  FC: state.board.present.getIn(['csp', 'algorithms', Algorithms.BT, 'subSets', Algorithms.FC]),
  MAC: state.board.present.getIn(['csp', 'algorithms', Algorithms.BT, 'subSets', Algorithms.MAC]),
  m: state.board.present.getIn(['csp', 'algorithms', Algorithms.mWC, 'm']),
  mWC: state.board.present.getIn(['csp', 'algorithms', Algorithms.mWC, 'isActive']),
  STR2: state.board.present.getIn(['csp', 'algorithms', Algorithms.STR2, 'isActive']),
});

const mapDispatchToProps = dispatch => ({
  toggleActive: (name, modifier) => {
    dispatch(toggleActive(name, modifier));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlgorithmToggle);
