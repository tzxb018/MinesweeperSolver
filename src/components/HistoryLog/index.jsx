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
    size: PropTypes.string.isRequired,
    // dispatch props
    jump: PropTypes.func.isRequired,
  }

  // auto-scrolls the history log
  componentDidUpdate() {
    this.scrollBottom.scrollIntoView({ behavior: 'smooth' });
  }

  // handles undo jumps when a log is clicked
  clickHandler = (e, key) => {
    this.props.jump(key);
  }

  // formats each history log for display
  formatter = () => {
    const size = this.props.historyLog.size;
    return this.props.historyLog.map((log, index) => {
      const key = index - size + 1;
      return (<div className={styles['log']}
        key={key}
        onClick={(e) => this.clickHandler(e, key)}
      >
        {log.message}
      </div>
      );
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
