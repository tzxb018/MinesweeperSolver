import { connect } from 'react-redux';
import ReportError from 'components/control_panel/ReportError';
import {
  reportErrorStart,
  reportErrorEnd,
  reportErrorTimeout,
  reportErrorToggle,
} from 'actions/asyncActions';

const mapStateToProps = state => ({
  canSendReport: state.reportError.get('canReportError'),
  isReportingError: state.reportError.get('isReportingError'),
  minefield: state.board.present.get('minefield'),
});

const mapDispatchToProps = dispatch => ({
  reportErrorStart: () => {
    dispatch(reportErrorStart());
  },

  reportErrorEnd: response => {
    dispatch(reportErrorEnd(response));
  },

  reportErrorTimeout: () => {
    dispatch(reportErrorTimeout());
  },

  reportErrorToggle: () => {
    dispatch(reportErrorToggle());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportError);
