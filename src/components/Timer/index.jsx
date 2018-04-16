import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class Timer extends Component {
  static propTypes = {
    // state props
    gameIsRunning: PropTypes.bool.isRequired,
    hasMines: PropTypes.bool.isRequired,
  }

  state = {
    counter: 0,
    timer: null,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gameIsRunning === true) {
      this.setState({ counter: 0 });
      const timer = setInterval(this.incrementTimer.bind(this), 1000);
      this.setState({ timer });
    } else {
      clearInterval(this.state.timer);
    }
    if (nextProps.hasMines === false) {
      this.setState({ counter: 0 });
    }
  }

  incrementTimer() {
    if (this.state.counter < 999) {
      this.setState({ counter: this.state.counter + 1 });
    }
  }

  render() {
    let length = 1;
    if (this.state.counter > 0) {
      length = Math.log(this.state.counter) * Math.LOG10E + 1;
    }
    let output = '';
    for (length; length < 3; length++) {
      output += '0';
    }
    output += this.state.counter.toString();
    return (
      <div className={styles['container']}>
        {output}
      </div>
    );
  }
}
