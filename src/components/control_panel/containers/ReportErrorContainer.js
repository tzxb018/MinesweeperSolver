import { connect } from 'react-redux';
import ReportError from 'components/control_panel/ReportError';
import {
  reportErrorStart,
  reportErrorEnd,
  reportErrorTimeout,
  reportErrorToggle,
} from 'actions/asyncActions';
import { highlight } from 'actions/cellHighlightActions';

const mapStateToProps = state => ({
  canSendReport: state.reportError.get('canReportError'),
  cells: state.reportError.get('cells'),
  isReportingError: state.reportError.get('isReportingError'),
  minefield: state.board.present.get('minefield'),
});

const mapDispatchToProps = dispatch => ({
  highlight: cells => {
    dispatch(highlight(cells));
  },

  reportErrorStart: () => {
    dispatch(reportErrorStart());
  },

  reportErrorEnd: response => {
    dispatch(reportErrorEnd(response));
  },

  reportErrorTimeout: () => {
    dispatch(reportErrorTimeout());
  },

  reportErrorToggle: newValue => {
    dispatch(reportErrorToggle(newValue));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportError);
