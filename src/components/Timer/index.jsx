import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Timer extends Component {
  static propTypes = {
    // state props
    gameIsRunning: PropTypes.bool.isRequired,
    hasMines: PropTypes.bool.isRequired,
  }

  state = {
    counter: 0,
    timer: null,
  };

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
    this.setState({ counter: this.state.counter + 1 });
  }

  render() {
    return (
      <div>
        {this.state.counter}
      </div>
    );
  }
}
