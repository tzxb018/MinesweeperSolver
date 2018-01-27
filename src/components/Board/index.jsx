import React, { Component } from 'react';

import MineCounterContainer from 'containers/MineCounterContainer';
import MinefieldContainer from 'containers/MinefieldContainer';
import ResetButtonContainer from 'containers/ResetButtonContainer';
import TimerContainer from 'containers/TimerContainer';
import styles from './style.scss';

export default class Board extends Component {
  render() {
    return (
      <div className={styles['intermediate']} >
        <MineCounterContainer />
        <ResetButtonContainer />
        <TimerContainer />
        <MinefieldContainer />
      </div>
    );
  }
}
