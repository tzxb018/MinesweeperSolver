import React, { Component } from 'react';

import HistoryLog from './containers/HistoryLogContainer';
import UndoRedo from './containers/UndoRedoContainer';

import styles from './style';

export default class HistoryPanel extends Component {
  render() {
    return (
      <div className={styles['stretch_container']}>

        <div className={styles['log_container']}>
          <div className={styles['header']}>
            <h1>History Log</h1>
            <UndoRedo />
          </div>
          <div className={styles['gap']} />
          <HistoryLog />
        </div>
      </div>
    );
  }
}
