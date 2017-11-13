import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Cell from '../Cell/index.jsx';
import resetBoard from '../../actions/boardActions.js';
import styles from './style.scss';

class Minefield extends React.Component {
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
        formattedCells[i].push(<Cell row={i} col={j} />);
      }
    }
    return (
      <div className={styles['container']} >
        { formattedCells }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cols: state.cells[0].length,
  rows: state.cells.length,
});

const mapDispatchToProps = dispatch => ({
  resetBoard: () => {
    dispatch(resetBoard());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Minefield);
