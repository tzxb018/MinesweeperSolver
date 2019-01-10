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
      <div className={styles['undo_redo']} >
        <button onClick={this.props.onUndo} disabled={!this.props.canUndo} >
          Undo
        </button>
        <div className={styles['gap']} />
        <button onClick={this.props.onRedo} disabled={!this.props.canRedo} >
          Redo
        </button>
      </div>
    );
  }
}
