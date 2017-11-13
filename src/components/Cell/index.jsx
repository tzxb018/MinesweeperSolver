import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './style.scss';
import {
  revealCell,
  toggleFlagged,
} from '../../actions/cellActions.js';

class Cell extends React.Component {
  static propTypes = {
    // state props
    flagged: PropTypes.bool.isRequired,
    hidden: PropTypes.bool.isRequired,
    mines: PropTypes.number.isRequired,
    // own props
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
  }

  clickHandler = () => {
    revealCell(this.props.row, this.props.col);
  }

  rightClickHandler = (e) => {
    e.preventDefault();
    toggleFlagged(this.props.row, this.props.col);
  }

  render() {
    if (this.props.flagged === true) {
      return (<div className={styles['flagged']} onContextMenu={this.rightClickHandler} />);
    } else if (this.props.hidden === true) {
      return (<div className={styles['hidden']} onClick={this.clickHandler} onContextMenu={this.rightClickHandler} />);
    }
    switch (this.props.mines) {

    case -1:
      return (<div className={styles['hasMine']} />);

    case 1:
      return (<div className={styles['one']} />);

    case 2:
      return (<div className={styles['two']} />);

    case 3:
      return (<div className={styles['three']} />);

    case 4:
      return (<div className={styles['four']} />);

    case 5:
      return (<div className={styles['five']} />);

    case 6:
      return (<div className={styles['six']} />);

    case 7:
      return (<div className={styles['seven']} />);

    case 8:
      return (<div className={styles['eight']} />);

    default:
      return (<div className={styles['cell']} />);
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  flagged: state.cells[ownProps.row][ownProps.col].flagged,
  hidden: state.cells[ownProps.row][ownProps.col].hidden,
  mines: state.cells[ownProps.row][ownProps.col].mines,

  ...ownProps,
});

const mapDispatchToProps = dispatch => ({
  revealCell: (row, col) => {
    dispatch(revealCell(row, col));
  },

  toggleFlagged: (row, col) => {
    dispatch(toggleFlagged(row, col));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cell);
