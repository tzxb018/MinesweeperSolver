import React, { Component } from 'react';

import CheatPanel from './containers/CheatPanelContainer';
import ReportError from './containers/ReportErrorContainer';
import SizePanel from './containers/SizePanelContainer';
import TestPanel from './containers/TestPanelContainer';

import styles from './style';

export default class ControlPanel extends Component {
  render() {
    return (
      <div className={styles['control_container']}>
        <SizePanel />
        <div className={styles['gap']} />
        <CheatPanel />
        <div className={styles['gap']} />
        <TestPanel />
        <div className={styles['gap_grow']} />
        <ReportError />
      </div>
    );
  }
}
