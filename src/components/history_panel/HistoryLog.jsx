import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HistoryLogItem from 'objects/HistoryLogItem';

import styles from './style';

export default class HistoryLog extends Component {
  static propTypes = {
    // state props
    historyLog: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.List),
      PropTypes.instanceOf(Array),
    ]).isRequired,
    // dispatch props
    clear: PropTypes.func.isRequired,
    highlight: PropTypes.func.isRequired,
    jump: PropTypes.func.isRequired,
  }


  /* lifecycle handlers */

  componentDidMount() {
    HistoryLogItem.clearer(this.props.clear);
    HistoryLogItem.clickHandler(this.clickHandler);
    HistoryLogItem.highlighter(this.props.highlight);
    HistoryLogItem.styles(styles);
  }

  componentDidUpdate() {
    this.scrollBottom.scrollIntoView({ behavior: 'smooth' });
  }


  /* event handlers */

  clickHandler(numJumps) {
    this.props.clear();
    this.props.jump(numJumps);
  }


  /* render handlers */

  display = () => {
    let numJumps = 0;
    this.props.historyLog.forEach(log => (log.canJump ? numJumps++ : null));
    return this.props.historyLog.map((log, index) => {
      if (log.canJump) {
        log.numJumps = numJumps;
        numJumps--;
      }
      return log.display(index);
    });
  }

  render() {
    return (
      <div className={styles['history_log']}>
        {this.display()}
        <div className={styles['last']} ref={(element) => { this.scrollBottom = element; }} />
      </div>
    );
  }
}
