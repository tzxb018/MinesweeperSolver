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

  // auto-scrolls the history log
  componentDidUpdate() {
    this.scrollBottom.scrollIntoView({ behavior: 'smooth' });
  }

  // formats each history log for display
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
        {this.formatter()}
        <div style={{ float: 'left', clear: 'both' }} ref={(element) => { this.scrollBottom = element; }} />
      </div>
    );
  }
}
