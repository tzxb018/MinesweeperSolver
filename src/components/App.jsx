import React, { Component } from 'react';

import Board from 'containers/BoardContainer';
import CheatButton from 'containers/CheatButtonContainer';
import ColorCodedKey from 'containers/ColorCodedKeyContainer';
import HistoryLog from 'containers/HistoryLogContainer';
import SizeSelector from 'containers/SizeSelectorContainer';
import StepLoop from 'containers/StepLoop';
import TestButton from 'containers/TestButtonContainer';
import UndoRedo from 'containers/UndoRedoContainer';

import styles from './style';

export default class App extends Component {
  render() {
    return (
      <div className={styles['container']}>
        <div className={styles['control_container']}>
          <SizeSelector />
          <div className={styles['static_gap']} />
          <CheatButton />
          <div className={styles['static_gap']} />
          <TestButton />
        </div>
        <div className={styles['gap']} />
        <Board />
        <div className={styles['gap']} />
        <div className={styles['solve_container']}>
          <ColorCodedKey />
          <div className={styles['static_gap']} />
          <StepLoop />
        </div>
        <div className={styles['static_gap']} />
        <div className={styles['log_container']}>
          <UndoRedo />
          <HistoryLog />
        </div>
      </div>
    );
  }
}
