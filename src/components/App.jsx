import React, { Component } from 'react';

import BoardContainer from 'containers/BoardContainer';
import CSPButtonContainer from 'containers/CSPButtonContainer';
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
        <CSPButtonContainer />
        <PeekButtonContainer />
        <StepButtonContainer />
      </div>
    );
  }
}
