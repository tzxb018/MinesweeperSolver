import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';

import styles from './style';

export default class TestButton extends Component {
  static propTypes = {
    // state props
    canTest: PropTypes.bool.isRequired,
    // dispatch props
    test: PropTypes.func.isRequired,
  }

  state = {
    allowCheats: true,
    stopOnError: false,
  }

  clickHandler = () => {
    this.props.test(document.getElementById('numIterations').getValueAsNumber(), this.state.allowCheats,
      this.state.stopOnError);
  }

  render() {
    return (
      <div className={styles['container']}>
        <button className={styles['button']} onClick={() => this.clickHandler()} disabled={!this.props.canTest}>
          Test
        </button>
        <NumericInput id="numIterations" className={styles['selector']} min={1} max={10} value={3} strict />
        <div>
          <input type="checkbox"
            id="allowCheats"
            checked={this.state.allowCheats}
            onChange={() => this.setState({ allowCheats: !this.state.allowCheats })}
          />
          <label htmlFor="allowCheats">allow cheats</label>
        </div>
        <div>
          <input type="checkbox"
            id="stopOnError"
            checked={this.state.stopOnError}
            onChange={() => this.setState({ stopOnError: !this.state.stopOnError })}
          />
          <label htmlFor="stopOnError">stop on error</label>
        </div>
      </div>
    );
  }
}
