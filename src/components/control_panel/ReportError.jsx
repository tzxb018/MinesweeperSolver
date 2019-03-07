import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import {
  cellsToString,
  sendReport,
} from 'reducers/async';

import styles from './style';

export default class ReportError extends Component {
  static propTypes = {
    // state props
    canSendReport: PropTypes.bool.isRequired,
    cells: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.List),
      PropTypes.instanceOf(Array),
    ]).isRequired,
    isReportingError: PropTypes.bool.isRequired,
    minefield: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Map),
      PropTypes.instanceOf(Map),
    ]).isRequired,
    // dispatch props
    highlight: PropTypes.func.isRequired,
    reportErrorStart: PropTypes.func.isRequired,
    reportErrorEnd: PropTypes.func.isRequired,
    reportErrorTimeout: PropTypes.func.isRequired,
    reportErrorToggle: PropTypes.func.isRequired,
  }

  /* local state */
  state = {
    cells: '',
    description: '',
  }


  /* lifecycle handlers */

  componentWillReceiveProps(nextProps) {
    if (nextProps.cells !== this.props.cells) {
      this.setState({ cells: cellsToString(nextProps.cells) });
    }
  }

  /* event handlers */

  toggleReportWindow = () => {
    if (!this.props.isReportingError) {
      this.props.highlight(this.props.cells);
    }
    this.props.reportErrorToggle(!this.props.isReportingError);
  }

  submitClickHandler = () => {
    this.props.reportErrorToggle(!this.props.isReportingError);
    this.props.reportErrorStart();
    sendReport(this.props.minefield, this.state.description, this.state.cells)
    .then(res => this.props.reportErrorEnd(res))
    .catch(error => this.props.reportErrorEnd(error));
    this.setState({ description: '' });
    setTimeout(this.props.reportErrorTimeout, 15000);
  }

  descriptionOnChangeHandler = event => {
    this.setState({ description: event.target.value });
  }


  render() {
    return (
      <div>
        <button className={styles['report_button']}
          disabled={!this.props.canSendReport}
          onClick={this.toggleReportWindow}
        >
          Report Error
        </button>
        <div id="errorReportForm"
          className={styles['error_form']}
          style={{ display: this.props.isReportingError ? 'grid' : 'none' }}
        >
          <h1>Error Report Form</h1>
          <div className={styles['column_1']}>
            <label htmlFor="description">Describe the issue:</label><br />
            <textarea id="description" onChange={this.descriptionOnChangeHandler} value={this.state.description} />
          </div>
          <div className={styles['submit_button']}>
            <button onClick={this.submitClickHandler}>Submit</button>
            <div className={styles['gap']} />
            <button onClick={this.toggleReportWindow}>Cancel</button>
          </div>
          <div className={styles['column_2']}>
            <label htmlFor="cellSelection">Identify the affected cells:</label><br />
            <textarea readOnly
              id="cellSelection"
              placeholder="Select the affected cells by clicking on them in the board"
              value={this.state.cells}
            />
          </div>
        </div>
      </div>
    );
  }
}
