import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';

import styles from './style';

export default class TestButton extends Component {
  static propTypes = {
    // state props
    isGameRunning: PropTypes.bool.isRequired,
    // dispatch props
    test: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    if (!this.props.isGameRunning) {
      this.props.test(document.getElementById('numIterations').getValueAsNumber());
    }
  }

  render() {
    return (
      <div className={styles['container']}>
        <button className={styles['button']} onClick={() => this.clickHandler()}>
          Test
        </button>
        <NumericInput id="numIterations" className={styles['selector']} min={1} max={10} value={3} strict />
      </div>
    );
  }
}
