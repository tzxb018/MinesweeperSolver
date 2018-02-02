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
    changeSmile: PropTypes.func.isRequired,
    revealCell: PropTypes.func.isRequired,
    toggleFlag: PropTypes.func.isRequired,
    // own props
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
  }

  clickHandler = () => {
    this.props.revealCell(this.props.row, this.props.col);
  }

  mouseDownHandler = e => {
    if (e.nativeEvent.which === 1) {
      this.props.changeSmile('SCARED');
    }
  }

  rightClickHandler = e => {
    e.preventDefault();
    this.props.toggleFlag(this.props.row, this.props.col);
  }

  render() {
    if (this.props.flagged) {
      if (this.props.mines === -2) {
        return (<div className={styles['misflagged']} />);
      }
      return (<div className={styles['flagged']} onContextMenu={this.rightClickHandler} />);
    } else if (this.props.hidden && this.props.component > 0 && this.props.component <= 8) {
      return (
        <div className={styles[`comp${this.props.component}`]}
          onClick={this.clickHandler}
          onContextMenu={this.rightClickHandler}
          onMouseDown={this.mouseDownHandler}
        />);
    } else if (this.props.hidden) {
      return (
        <div className={styles['hidden']}
          onClick={this.clickHandler}
          onContextMenu={this.rightClickHandler}
          onMouseDown={this.mouseDownHandler}
        />);
    }
    return (<div className={styles[`mines${this.props.mines}`]} />);
  }
}
