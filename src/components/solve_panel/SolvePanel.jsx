import React, { Component } from 'react';

import AlgorithmToggle from './containers/AlgorithmToggleContainer';
import StepLoop from './containers/StepLoopContainer';

import styles from './style';

export default class SolvePanel extends Component {
  render() {
    return (
      <div className={styles['panel_container']}>
        <AlgorithmToggle />
        <div className={styles['gap']} />
        <StepLoop />
      </div>
    );
  }
}
