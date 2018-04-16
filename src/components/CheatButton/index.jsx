import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class cheatButton extends Component {
  static propTypes = {
    // dispatch props
    cheat: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    this.props.cheat();
  }

  render() {
    return (
      <button className={styles['button']} onClick={this.clickHandler} >
        Cheat
      </button>
    );
  }
}
