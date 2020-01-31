import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CellContainer from 'components/gameboard/containers/CellContainer';

import styles from './style';

export default class Minefield extends Component {
  static propTypes = {
    // state props
    isReportingError: PropTypes.bool.isRequired,
    numCols: PropTypes.number.isRequired,
    numRows: PropTypes.number.isRequired,
  }


  /* render helpers */

  cells = () => {
    const style = {
      position: 'absolute',
      display: 'grid',
      gridTemplateColumns: `repeat(${this.props.numCols}, 20px)`,
      gridTemplateRows: `repeat(${this.props.numRows}, 20px)`,
      zIndex: this.props.isReportingError ? 2 : 1,
    };
    const formattedCells = [];
    for (let i = 0; i < this.props.numRows; i++) {
      formattedCells.push([]);
      for (let j = 0; j < this.props.numCols; j++) {
        formattedCells[i].push(<CellContainer row={i} col={j} />);
      }
    }
    return (
      <div style={style}>
        {formattedCells}
      </div>
    );
  }

  rowColNumbers = () => {
    const style = {
      position: 'absolute',
      display: 'grid',
      gridTemplateColumns: `repeat(${this.props.numCols}, 20px) 10px 20px`,
      gridTemplateRows: `repeat(${this.props.numRows}, 20px) 10px 20px`,
      zIndex: 2,
    };
    const rowColNumbers = [];
    // cell covers
    for (let i = 0; i < this.props.numRows; i++) {
      rowColNumbers.push([]);
      for (let j = 0; j < this.props.numCols; j++) {
        rowColNumbers[i].push(<div />);
      }
    }
    // col labels
    rowColNumbers.forEach((row, index) => {
      row.push(<div />);
      if (index % 2 === 0) {
        row.push(<span className={styles['rowColLabel']}>{index}</span>);
      } else {
        row.push(<div />);
      }
    });
    rowColNumbers.push([], []);
    for (let j = 0; j < this.props.numCols; j++) {
      rowColNumbers[this.props.numRows].push(<div />);
      if (j % 2 === 0) {
        rowColNumbers[this.props.numRows + 1].push(<span className={styles['rowColLabel']}>{j}</span>);
      } else {
        rowColNumbers[this.props.numRows + 1].push(<div />);
      }
    }
    rowColNumbers[this.props.numRows].push(<div />, <div />);
    return (
      <div style={style}>
        {rowColNumbers}
      </div>
    );
  }


  render() {
    return (
      <div>
        {this.props.isReportingError ? this.rowColNumbers() : null}
        {this.cells()}
      </div>
    );
  }
}
