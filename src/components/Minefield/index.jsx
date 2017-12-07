import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CellContainer from 'containers/CellContainer.js';
import styles from './style.scss';

export default class Minefield extends Component {
  static propTypes = {
    // state props
    cols: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
  }

  render() {
    const formattedCells = [];
    for (let i = 0; i < this.props.rows; i++) {
      formattedCells.push([]);
      for (let j = 0; j < this.props.cols; j++) {
        formattedCells[i].push(<CellContainer row={i} col={j} />);
      }
    }
    return (
      <div className={styles['container']} >
        { formattedCells }
      </div>
    );
  }
}
