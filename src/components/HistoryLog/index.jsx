import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class HistoryLog extends Component {
  static propTypes = {
    // state props
    historyLog: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.List),
      PropTypes.instanceOf(Array),
    ]).isRequired,
  }

  formatter = () => this.props.historyLog.map(logString => <div>{logString}</div>);

  render() {
    return (
      <div className={styles['container']}>
        {this.formatter()}
      </div>
    );
  }
}
