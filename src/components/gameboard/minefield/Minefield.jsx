import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CellContainer from 'components/gameboard/containers/CellContainer';

export default class Minefield extends Component {
  static propTypes = {
    // state props
    numCols: PropTypes.number.isRequired,
    numRows: PropTypes.number.isRequired,
  }


  render() {
    const style = {
      position: 'absolute',
      display: 'grid',
      gridTemplateColumns: `repeat(${this.props.numCols}, 16px)`,
      gridTemplateRows: `repeat(${this.props.numRows}, 16px)`,
      zIndex: 1,
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
}
