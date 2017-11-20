import React, { Component } from 'react';

import MineCounterContainer from 'containers/MineCounterContainer.js';
import MinefieldContainer from 'containers/MinefieldContainer.js';
import ResetButtonContainer from 'containers/ResetButtonContainer.js';
import styles from './style.scss';

export default class Board extends Component {
  render() {
    return (
      <div className={styles['container']} >
        <ResetButtonContainer />
        <MineCounterContainer />
        <MinefieldContainer />
      </div>
    );
  }
}
