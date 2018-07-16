import React, { Component } from 'react';

import Board from 'containers/BoardContainer';
import LoopButton from 'containers/LoopButtonContainer';
import CheatButton from 'containers/CheatButtonContainer';
import ColorCodedKey from 'containers/ColorCodedKeyContainer';
import HistoryLog from 'containers/HistoryLogContainer';
import PeekToggle from 'containers/PeekToggleContainer';
import SizeSelector from 'containers/SizeSelectorContainer';
import StepButton from 'containers/StepButtonContainer';
import TestButton from 'containers/TestButtonContainer';
import UndoRedo from 'containers/UndoRedoContainer';

import styles from './style';

export default class App extends Component {
  render() {
    return (
      <div className={styles['container']}>
        <SizeSelector />
        <CheatButton />
        <TestButton />
        <Board />
        <ColorCodedKey />
        <PeekToggle />
        <StepButton />
        <LoopButton />
        <UndoRedo />
        <HistoryLog />
      </div>
    );
  }
}
