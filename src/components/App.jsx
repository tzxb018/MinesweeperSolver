import React from 'react';

import CSPButtonContainer from 'containers/CSPButtonContainer';
import SizeSelectorContainer from 'containers/SizeSelectorContainer';
import BoardContainer from 'containers/BoardContainer';
import PeekButtonContainer from 'containers/PeekButtonContainer';

import styles from './style.scss';

export default class App extends React.Component {
  render() {
    return (
      <div className={styles['container']}>
        <BoardContainer />
        <SizeSelectorContainer />
        <CSPButtonContainer />
        <PeekButtonContainer />
      </div>
    );
  }
}
