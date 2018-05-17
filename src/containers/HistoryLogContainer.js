import { connect } from 'react-redux';

import HistoryLog from 'components/HistoryLog';

const mapStateToProps = state => ({
  historyLog: state.board.present.get('historyLog'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryLog);
