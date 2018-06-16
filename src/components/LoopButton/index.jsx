import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class LoopButton extends Component {
  static propTypes = {
    // state props
    isGameRunning: PropTypes.bool.isRequired,
    // dispatch props
    changeSmile: PropTypes.func.isRequired,
    loop: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    if (this.props.isGameRunning) {
      this.props.changeSmile('SMILE');
      this.props.loop();
    }
  }

  mouseDownHandler = () => {
    if (this.props.isGameRunning) {
      this.props.changeSmile('SCARED');
    }
  }

  render() {
    return (
      <button className={styles['button']} onClick={this.clickHandler} onMouseDown={this.mouseDownHandler}>
        Loop
      </button>
    );
  }
}
