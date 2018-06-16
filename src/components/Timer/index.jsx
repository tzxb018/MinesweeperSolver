import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class Timer extends Component {
  static propTypes = {
    // state props
    counter: PropTypes.number.isRequired,
    isGameRunning: PropTypes.bool.isRequired,
    // dispatch props
    increment: PropTypes.func.isRequired,
    start: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isGameRunning && !this.props.isGameRunning) {
      this.props.start(setInterval(this.props.increment, 1000));
    } else if (!nextProps.isGameRunning && this.props.isGameRunning) {
      this.props.stop();
    }
  }

  render() {
    let length = 1;
    if (this.props.counter > 0) {
      length = Math.log(this.props.counter) * Math.LOG10E + 1;
    }
    let output = '';
    for (length; length < 3; length++) {
      output += '0';
    }
    output += this.props.counter <= 999 ? this.props.counter.toString() : '999';
    return (
      <div className={styles['container']}>
        {output}
      </div>
    );
  }
}
