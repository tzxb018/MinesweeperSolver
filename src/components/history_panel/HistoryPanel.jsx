import React, { Component } from 'react';

import HistoryLog from './containers/HistoryLogContainer';
import UndoRedo from './containers/UndoRedoContainer';

import styles from './style';

export default class HistoryPanel extends Component {
  render() {
    return (
      <div className={styles['stretch_container']}>
        <h1>History Log</h1>
        <div className={styles['log_container']}>
          <UndoRedo />
          <div className={styles['gap']} />
          <HistoryLog />
        </div>
      </div>
    );
  }
}
