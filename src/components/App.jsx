import React, { Component } from 'react';

import Board from 'containers/BoardContainer';
import LoopButton from 'containers/LoopButtonContainer';
import CheatButton from 'containers/CheatButtonContainer';
import ColorCodedKey from 'containers/ColorCodedKeyContainer';
import HistoryLog from 'containers/HistoryLogContainer';
import PeekButton from 'containers/PeekButtonContainer';
import SizeSelector from 'containers/SizeSelectorContainer';
import StepButton from 'containers/StepButtonContainer';
import UndoRedo from 'containers/UndoRedoContainer';

import styles from './style';

export default class App extends Component {
  render() {
    return (
      <div className={styles['container']}>
        <UndoRedo />
        <Board />
        <SizeSelector />
        <LoopButton />
        <CheatButton />
        <StepButton />
        <PeekButton />
        <ColorCodedKey />
        <HistoryLog />
      </div>
    );
  }
}
