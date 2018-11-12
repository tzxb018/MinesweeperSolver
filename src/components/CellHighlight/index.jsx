import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class CellHighlight extends Component {
  static propTypes = {
    // state props
    cells: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.List),
      PropTypes.instanceOf(Array),
    ]).isRequired,
  }

  formatter = () => {
    const cells = [];
    let key = 0;
    this.props.cells.forEach(row => row.forEach(cell => {
      cells.push(<div key={key} className={styles[cell ? 'highlight' : 'cell']} />);
      key++;
    }));
    let style;
    if (this.props.cells.some(row => row.some(cell => cell))) {
      style = {
        position: 'absolute',
        display: 'grid',
        gridTemplateColumns: `repeat(${this.props.cells.get(0).size}, 16px)`,
        gridTemplateRows: `repeat(${this.props.cells.size}, 16px)`,
        zIndex: 2,
      };
    } else {
      style = {
        position: 'absolute',
        display: 'grid',
        gridTemplateColumns: `repeat(${this.props.cells.get(0).size}, 16px)`,
        gridTemplateRows: `repeat(${this.props.cells.size}, 16px)`,
        zIndex: 0,
      };
    }
    return (
      <div style={style}>
        {cells}
      </div>
    );
  }

  render() {
    return this.formatter();
  }
}
