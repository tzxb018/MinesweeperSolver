import React from 'react';
import styles from './style.scss';
import Minefield from '../Minefield/index.jsx';

export default class Board extends React.Component {
  render() {
    return (
      <div className={styles.container} >
        <Minefield height={16} width={16} numMines={40} className={styles['row2']} />
      </div>
    );
  }
}
