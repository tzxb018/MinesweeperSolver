import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class LoopButton extends Component {
  static propTypes = {
    // state props
    gameIsRunning: PropTypes.bool.isRequired,
    // dispatch props
    loop: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    if (this.props.gameIsRunning) {
      this.props.loop();
    }
  }

  render() {
    return (
      <button className={styles['button']} onClick={this.clickHandler}>
        Loop
      </button>
    );
  }
}
