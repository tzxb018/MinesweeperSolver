import { connect } from 'react-redux';
import ReportError from 'components/control_panel/size_panel/ReportError';
import {
  reportErrorStart,
  reportErrorEnd,
  reportErrorTimeout,
} from 'actions/asyncActions';

const mapStateToProps = state => ({
  canSendReport: state.reportError,
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportError);
