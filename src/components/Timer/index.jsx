import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Timer extends Component {
  static propTypes = {
    // state props
    gameIsRunning: PropTypes.bool.isRequired,
    timer: PropTypes.number.isRequired,
    // dispatch props
    incrementTimer: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div>
        {this.props.timer}
      </div>
    );
  }
}
