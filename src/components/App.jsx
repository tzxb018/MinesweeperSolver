import React, { Component } from 'react';

import ControlPanel from './control_panel/ControlPanel';
import HistoryPanel from './history_panel/HistoryPanel';
import Gameboard from './gameboard/containers/GameboardContainer';
import SolvePanel from './solve_panel/SolvePanel';
// import ReportError from './control_panel/ReportError';

import styles from './style';

export default class App extends Component {
  render() {
    return (
      <div className={styles['container']}>
        <div className={styles['row']}>
          <ControlPanel />
          <SolvePanel />
        </div>
        <div className={styles['row']}>
          <HistoryPanel />
          <div className={styles['gap']} />
          <Gameboard />
          <div className={styles['gap']} />
        </div>

        {/* <div className={styles['gap_grow']} /> */}


        {/* <ReportError /> */}
      </div>
    );
  }
}
