import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './style.scss';

export default class CSPButton extends Component {
  static propTypes = {
    // state props
    gameIsRunning: PropTypes.bool.isRequired,
    // dispatch props
    generateCSPVariables: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    if (this.props.gameIsRunning) {
      this.props.generateCSPVariables();
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
