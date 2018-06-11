import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class StepButton extends Component {
  static propTypes = {
    // state props
    isGameRunning: PropTypes.bool.isRequired,
    // dispatch props
    step: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    if (this.props.isGameRunning) {
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
