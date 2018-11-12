import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CellContainer from 'containers/CellContainer.js';

export default class Minefield extends Component {
  static propTypes = {
    // state props
    cols: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
  }

  render() {
    const style = {
      position: 'absolute',
      display: 'grid',
      gridTemplateColumns: `repeat(${this.props.cols}, 16px)`,
      gridTemplateRows: `repeat(${this.props.rows}, 16px)`,
      zIndex: 1,
    };
    const formattedCells = [];
    for (let i = 0; i < this.props.rows; i++) {
      formattedCells.push([]);
      for (let j = 0; j < this.props.cols; j++) {
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
