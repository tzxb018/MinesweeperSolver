import React from 'react';
import PropTypes from 'prop-types';

import styles from './style.scss';

export default class ResetButton extends React.Component {
  static propTypes = {
    // dispatch props
    resetBoard: PropTypes.func.isRequired,
  };

  clickHandler = () => {
    this.props.resetBoard();
  }

  render() {
    return (
      <button className={styles['button']} onClick={this.clickHandler}>
        Reset
      </button>
    );
  }
}

