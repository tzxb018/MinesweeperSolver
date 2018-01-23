import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './style.scss';

export default class Cell extends Component {
  static propTypes = {
    // state props
    component: PropTypes.number.isRequired,
    flagged: PropTypes.bool.isRequired,
    hidden: PropTypes.bool.isRequired,
    mines: PropTypes.number.isRequired,
    // dispatch props
    revealCell: PropTypes.func.isRequired,
    toggleFlag: PropTypes.func.isRequired,
    // own props
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
  }

  clickHandler = () => {
    this.props.revealCell(this.props.row, this.props.col);
  }

  rightClickHandler = (e) => {
    e.preventDefault();
    this.props.toggleFlag(this.props.row, this.props.col);
  }

  render() {
    if (this.props.flagged) {
      return (<div className={styles['flagged']} onContextMenu={this.rightClickHandler} />);
    } else if (this.props.component > 0 && this.props.component <= 8) {
      return (<div className={styles['comp1']} onClick={this.clickHandler} onContextMenu={this.rightClickHandler} />);
    } else if (this.props.hidden) {
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
