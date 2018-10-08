import React, { Component } from 'react';

import Board from 'containers/BoardContainer';
import CheatButton from 'containers/CheatButtonContainer';
import ColorCodedKey from 'containers/ColorCodedKeyContainer';
import HistoryLog from 'containers/HistoryLogContainer';
import PeekToggle from 'containers/PeekToggleContainer';
import SizeSelector from 'containers/SizeSelectorContainer';
import StepLoop from 'containers/StepLoop';
import TestButton from 'containers/TestButtonContainer';
import UndoRedo from 'containers/UndoRedoContainer';

import styles from './style';

export default class App extends Component {
  render() {
    return (
      <div className={styles['container']}>
        <div className={styles['v_container']}>
          <SizeSelector />
          <div className={styles['gap']} />
          <CheatButton />
          <div className={styles['gap']} />
          <TestButton />
        </div>
        <Board />
        <div className={styles['v_container']}>
          <ColorCodedKey />
          <div className={styles['gap']} />
          <PeekToggle />
          <div className={styles['gap']} />
          <StepLoop />
        </div>
        <div className={styles['log_container']}>
          <UndoRedo />
          <HistoryLog />
        </div>
      </div>
    );
  }
}
