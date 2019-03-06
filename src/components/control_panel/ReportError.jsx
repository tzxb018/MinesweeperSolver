import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { sendReport } from 'reducers/async';

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

  /* local state */
  state = {
    cells: '',
    description: '',
  }


  /* event handlers */

  cancelClickHandler = () => {
    document.getElementById('errorReportForm').style.display = 'none';
  }

  reportClickHandler = () => {
    if (document.getElementById('errorReportForm').style.display === 'none'
    || document.getElementById('errorReportForm').style.display === '') {
      document.getElementById('errorReportForm').style.display = 'grid';
    } else {
      document.getElementById('errorReportForm').style.display = 'none';
    }
  }

  submitClickHandler = () => {
    this.setState({ cells: '', description: '' });
    document.getElementById('errorReportForm').style.display = 'none';
    this.props.reportErrorStart();
    sendReport(this.props.minefield, this.state.description, this.state.cells)
    .then(res => this.props.reportErrorEnd(res))
    .catch(error => this.props.reportErrorEnd(error));
    setTimeout(this.props.reportErrorTimeout, 15000);
  }

  descriptionOnChangeHandler = event => {
    this.setState({ description: event.target.value });
  }

  cellsOnChangeHandler = event => {
    this.setState({ cells: event.target.value });
  }


  render() {
    return (
      <div>
        <button className={styles['report_button']}
          disabled={!this.props.canSendReport}
          onClick={this.reportClickHandler}
        >
          Report Error
        </button>
        <div id="errorReportForm" className={styles['error_form']}>
          <h1>Error Report Form</h1>
          <div className={styles['column_1']}>
            <label htmlFor="description">Describe the issue:</label><br />
            <textarea id="description" onChange={this.descriptionOnChangeHandler} value={this.state.description} />
          </div>
          <div className={styles['submit_button']}>
            <button onClick={this.submitClickHandler}>Submit</button>
            <div className={styles['gap']} />
            <button onClick={this.cancelClickHandler}>Cancel</button>
          </div>
          <div className={styles['column_2']}>
            <label htmlFor="cellSelection">Identify the affected cells:</label><br />
            <textarea id="cellSelection"
              placeholder="Use (row, column) format with commas between each cell coordinate"
              onChange={this.cellsOnChangeHandler}
              value={this.state.cells}
            />
          </div>
        </div>
      </div>
    );
  }
}
