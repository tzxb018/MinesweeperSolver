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
    size: PropTypes.string.isRequired,
  }

  formatter = () => {
    const cells = [];
    let key = 0;
    this.props.cells.forEach(row => row.forEach(cell => {
      cells.push(<div key={key} className={styles[cell ? 'highlight' : 'cell']} />);
      key++;
    }));
    return cells;
  }

  render() {
    return (
      <div className={styles[this.props.size]} >
        {this.formatter()}
      </div>
    );
  }
}
