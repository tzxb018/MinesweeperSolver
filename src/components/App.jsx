import React, { Component } from 'react';

import ControlPanel from './control_panel/ControlPanel';
import HistoryPanel from './history_panel/HistoryPanel';
import Gameboard from './gameboard/containers/GameboardContainer';
import SolvePanel from './solve_panel/SolvePanel';

import styles from './style';

export default class App extends Component {
  render() {
    return (
      <div className={styles['container']}>
        <ControlPanel />
        <div className={styles['gap']} />
        <Gameboard />
        <div className={styles['gap']} />
        <SolvePanel />
        <div className={styles['static_gap']} />
        <HistoryPanel />
      </div>
    );
  }
}
