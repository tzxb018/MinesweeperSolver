import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { sendReport } from 'reducers/reportError';

import styles from './style';

export default class ReportError extends Component {
  static propTypes = {
    // state props
    canSendReport: PropTypes.bool.isRequired,
    minefield: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Map),
      PropTypes.instanceOf(Map),
    ]).isRequired,
    // dispatch props
    reportErrorStart: PropTypes.func.isRequired,
    reportErrorEnd: PropTypes.func.isRequired,
    reportErrorTimeout: PropTypes.func.isRequired,
  }


  /* event handlers */

  clickHandler = () => {
    this.props.reportErrorStart();
    sendReport(this.props.minefield)
    .then(res => this.props.reportErrorEnd(res))
    .catch(error => this.props.reportErrorEnd(error));
    setTimeout(this.props.reportErrorTimeout, 15000);
  }


  render() {
    return (
      <button className={styles['report-error']} disabled={!this.props.canSendReport} onClick={this.clickHandler}>
        Report Error
      </button>
    );
  }
}
