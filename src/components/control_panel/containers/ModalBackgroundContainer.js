import { connect } from 'react-redux';

import ModalBackground from 'components/control_panel/ModalBackground';

const mapStateToProps = state => ({
  isReportingError: state.reportError.get('isReportingError'),
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalBackground);
