import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class PeekToggle extends Component {
  static propTypes = {
    // state props
    isPeeking: PropTypes.bool.isRequired,
    // dispatch props
    togglePeek: PropTypes.func.isRequired,
  }

  changeHandler = () => {
    this.props.togglePeek();
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
