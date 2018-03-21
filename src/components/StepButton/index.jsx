import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class StepButton extends Component {
  static propTypes = {
    // state props
    gameIsRunning: PropTypes.bool.isRequired,
    // dispatch props
    step: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    if (this.props.gameIsRunning) {
      this.props.step();
    }
  }

  render() {
    return (
      <button className={styles['button']} onClick={this.clickHandler}>
        Step
      </button>
    );
  }
}
