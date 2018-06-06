import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class UndoRedo extends Component {
  static propTypes = {
    // state props
    canRedo: PropTypes.bool.isRequired,
    canUndo: PropTypes.bool.isRequired,
    // dispatch props
    onRedo: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className={styles['container']} >
        <button className={styles['button']} onClick={this.props.onUndo} disabled={!this.props.canUndo} >
          Undo
        </button>
        <button className={styles['button']} onClick={this.props.onRedo} disabled={!this.props.canRedo} >
          Redo
        </button>
      </div>
    );
  }
}
