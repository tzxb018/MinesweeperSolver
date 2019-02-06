import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';
import Load from 'components/control_panel/containers/LoadContainer';

import styles from './style';

export default class SizePanel extends Component {
  static propTypes = {
    // state props
    size: PropTypes.string.isRequired,
    // dispatch props
    changeSize: PropTypes.func.isRequired,
  }

  /* static display components */

  static sizes = {
    BEGINNER: { size: 'BEGINNER', rows: 9, cols: 9, numMines: 10 },
    INTERMEDIATE: { size: 'INTERMEDIATE', rows: 16, cols: 16, numMines: 40 },
    EXPERT: { size: 'EXPERT', rows: 16, cols: 30, numMines: 99 },
  }


  /* local state */

  state = {
    rows: 16,
    cols: 30,
    numMines: 99,
    maxDensity: 0.8,
    maxNumMines: 16 * 30 - 9,
  }


  /* event handlers */

  customSizeHandler(newState) {
    const state = {
      size: 'CUSTOM',
      rows: newState.rows || this.state.rows,
      cols: newState.cols || this.state.cols,
      numMines: newState.numMines || this.state.numMines,
    };
    this.props.changeSize(state);
  }

  colChangeHandler(newValue) {
    const maxNumMines = Math.floor(this.state.rows * newValue * this.state.maxDensity);
    const newState = {
      cols: newValue,
      maxNumMines,
      numMines: (this.state.numMines > maxNumMines) ? maxNumMines : this.state.numMines,
    };
    if (this.props.size === 'CUSTOM') {
      this.customSizeHandler(newState);
    }
    this.setState(newState);
  }

  mineChangeHandler(newValue) {
    const newState = { numMines: newValue };
    if (this.props.size === 'CUSTOM') {
      this.customSizeHandler(newState);
    }
    this.setState(newState);
  }

  rowChangeHandler(newValue) {
    const maxNumMines = Math.floor(newValue * this.state.cols * this.state.maxDensity);
    const newState = {
      rows: newValue,
      maxNumMines,
      numMines: (this.state.numMines > maxNumMines) ? maxNumMines : this.state.numMines,
    };
    if (this.props.size === 'CUSTOM') {
      this.customSizeHandler(newState);
    }
    this.setState(newState);
  }


  render() {
    return (
      <div>
        <h1>Board Size</h1>
        <div className={styles['container']}>
          <Load />
          <div className="radio">
            <input type="radio"
              checked={this.props.size === 'BEGINNER'}
              onChange={() => this.props.changeSize(SizePanel.sizes.BEGINNER)}
            />
            beginner
          </div>
          <div className="radio">
            <input type="radio"
              checked={this.props.size === 'INTERMEDIATE'}
              onChange={() => this.props.changeSize(SizePanel.sizes.INTERMEDIATE)}
            />
            intermediate
          </div>
          <div className="radio">
            <input type="radio"
              checked={this.props.size === 'EXPERT'}
              onChange={() => this.props.changeSize(SizePanel.sizes.EXPERT)}
            />
            expert
          </div>
          <div className={styles['gap']} />
          <div className="radio">
            <input type="radio"
              checked={this.props.size === 'CUSTOM'}
              onChange={() => this.customSizeHandler({})}
            />
            custom
          </div>
          <div className={styles['customSelectors']}>
            <NumericInput id="rows"
              className={styles['selector']}
              min={9}
              max={40}
              value={this.state.rows}
              onChange={newValue => this.rowChangeHandler(newValue)}
              strict
            />
            rows
            <NumericInput id="cols"
              className={styles['selector']}
              min={9}
              max={42}
              value={this.state.cols}
              onChange={newValue => this.colChangeHandler(newValue)}
              strict
            />
            cols
            <NumericInput id="numMines"
              className={styles['selector']}
              min={10}
              max={(this.state.maxNumMines < 999) ? this.state.maxNumMines : 999}
              value={this.state.numMines}
              onChange={newValue => this.mineChangeHandler(newValue)}
              strict
            />
            # of mines
          </div>
        </div>
      </div>
    );
  }
}
