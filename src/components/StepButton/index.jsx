import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class StepButton extends Component {
  static propTypes = {
    // state props
    canStep: PropTypes.bool.isRequired,
    // dispatch props
    changeSmile: PropTypes.func.isRequired,
    step: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    this.props.changeSmile('SMILE');
    this.props.step();
  }

  mouseDownHandler = () => {
    this.props.changeSmile('SCARED');
  }

  render() {
    return (
      <button className={styles['button']}
        onClick={this.clickHandler}
        onMouseDown={this.mouseDownHandler}
        disabled={!this.props.canStep}
      >
        Step
      </button>
    );
  }
}
