import React, { Component } from 'react';

import BoardContainer from 'containers/BoardContainer';
import LoopButtonContainer from 'containers/LoopButtonContainer';
import CheatButtonContainer from 'containers/CheatButtonContainer';
import PeekButtonContainer from 'containers/PeekButtonContainer';
import SizeSelectorContainer from 'containers/SizeSelectorContainer';
import StepButtonContainer from 'containers/StepButtonContainer';
import UndoRedo from 'containers/UndoRedoContainer';

import styles from './style';

export default class App extends Component {
  render() {
    return (
      <div className={styles['container']}>
        <UndoRedo />
        <BoardContainer />
        <SizeSelectorContainer />
        <LoopButtonContainer />
        <CheatButtonContainer />
        <StepButtonContainer />
        <PeekButtonContainer />
      </div>
    );
  }
}
