import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class CascadeButton extends Component {
  static propTypes = {
    // state props
    gameIsRunning: PropTypes.bool.isRequired,
    // dispatch props
    cascade: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    if (this.props.gameIsRunning) {
      this.props.cascade();
    }
  }

  render() {
    return (
      <button className={styles['button']} onClick={this.clickHandler}>
        Solve
      </button>
    );
  }
}
