import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HistoryLogItem from 'HistoryLog';

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

  componentDidMount() {
    HistoryLogItem.clearer(this.props.clear);
    HistoryLogItem.clickHandler(this.clickHandler);
    HistoryLogItem.highlighter(this.props.highlight);
    HistoryLogItem.styles(styles);
  }

  // auto-scrolls the history log
  componentDidUpdate() {
    this.scrollBottom.scrollIntoView({ behavior: 'smooth' });
  }

  clickHandler = numJumps => {
    this.props.clear();
    this.props.jump(numJumps);
  }

  // formats each history log for display
  formatter = () => {
    const size = this.props.historyLog.size;
    return this.props.historyLog.map((log, index) => {
      const key = index - size + 1;
      return log.display(key);
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
