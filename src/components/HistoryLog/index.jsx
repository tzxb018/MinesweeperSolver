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

  formatter = () => {
    let key = -1;
    return this.props.historyLog.map(logString => {
      key++;
      return <div className={styles['log']} key={key}>{logString}</div>;
    });
  }

  render() {
    return (
      <div className={styles['container']}>
        <svg className={styles['border']} height="335" width="450">
          <polygon points="0,0 450,0 448,2 2,2 2,333 0,335" style={{ fill: '#808080' }} />
          <polygon points="450,355 450,0 448,2 448,333 2,333 0,335" style={{ fill: 'white' }} />
        </svg>
        {this.formatter()}
      </div>
    );
  }
}
