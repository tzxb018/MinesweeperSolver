import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class PeakToggle extends Component {
  static propTypes = {
    // state props
    isPeeking: PropTypes.bool.isRequired,
    // dispatch props
    peek: PropTypes.func.isRequired,
  }

  changeHandler = () => {
    this.props.peek();
  }

  render() {
    return (
      <div className={styles['container']}>
        <input type="checkbox" id="peek" checked={this.props.isPeeking} onChange={this.changeHandler} />
        <label htmlFor="peek">Peek</label>
      </div>
    );
  }
}
