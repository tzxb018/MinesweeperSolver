import React, { Component } from 'react';

import BoardContainer from 'containers/BoardContainer';
import CascadeButtonContainer from 'containers/CascadeButtonContainer';
import CheatButtonContainer from 'containers/CheatButtonContainer';
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
        <CascadeButtonContainer />
        <CheatButtonContainer />
        <StepButtonContainer />
      </div>
    );
  }
}
