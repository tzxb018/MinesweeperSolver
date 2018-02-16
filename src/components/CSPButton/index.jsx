import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class CSPButton extends Component {
  static propTypes = {
    // state props
    gameIsRunning: PropTypes.bool.isRequired,
    // dispatch props
    csp: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    if (this.props.gameIsRunning) {
      this.props.csp();
    }
  }

  render() {
    return (
      <button className={styles['button']} onClick={this.clickHandler}>
        CSP Stuff
      </button>
    );
  }
}
