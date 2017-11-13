import React from 'react';

import Minefield from '../Minefield/index.jsx';
import ResetButton from '../ResetButton/index.jsx';
import styles from './style.scss';

export default class Board extends React.Component {
  render() {
    return (
      <div className={styles.container} >
        <ResetButton />
        <Minefield />
      </div>
    );
  }
}
