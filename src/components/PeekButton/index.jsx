import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './style.scss';

export default class peekButton extends Component {
  static propTypes = {
    // dispatch props
    peek: PropTypes.func.isRequired,
  }

  clickHandler = () => {
    this.props.peek();
  }

  render() {
    return (
      <button className={styles['button']} onClick={this.clickHandler} >
        Peek
      </button>
    );
  }
}
