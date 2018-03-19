import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Mines } from 'enums/mines';

import styles from './style';

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
    col: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
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
      if (this.props.mines === Mines.ERROR) {
        return (<div className={styles['misflagged']} />);
      }
      return (<div className={styles['flagged']} onContextMenu={this.rightClickHandler} />);
    } else if (this.props.hidden && this.props.component > 0) {
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
    } else if (this.props.component === -1) {
      return (<div className={styles[`bad${this.props.mines}`]} />);
    }
    return (<div className={styles[`mines${this.props.mines}`]} />);
  }
}
