import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';
import Load from 'components/control_panel/containers/LoadContainer';
import { BoardSizes } from 'enums';

import styles from './style';

export default class SizePanel extends Component {
  static propTypes = {
    // state props
    size: PropTypes.symbol.isRequired,
    // dispatch props
    changeSize: PropTypes.func.isRequired,
  }


  /* local state */

  state = {
    rows: 16,
    cols: 30,
    numMines: 99,
    maxDensity: 0.8,
    maxNumMines: 16 * 30 - 9,
  }

    /* static display components */

  static sizes = {
    BEGINNER: { size: BoardSizes.BEGINNER, rows: 9, cols: 9, numMines: 10 },
    INTERMEDIATE: { size: BoardSizes.INTERMEDIATE, rows: 16, cols: 16, numMines: 40 },
    EXPERT: { size: BoardSizes.EXPERT, rows: 16, cols: 30, numMines: 99 },
  }


  /* event handlers */

  customSizeHandler(newState) {
    const state = {
      size: BoardSizes.CUSTOM,
      rows: newState.rows || this.state.rows,
      cols: newState.cols || this.state.cols,
      numMines: newState.numMines || this.state.numMines,
    };
    this.props.changeSize(state);
  }

  colChangeHandler(newValue) {
    const maxNumMines = Math.floor(this.state.rows * Math.round(newValue) * this.state.maxDensity);
    const newState = {
      cols: Math.round(newValue),
      maxNumMines,
      numMines: (this.state.numMines > maxNumMines) ? maxNumMines : this.state.numMines,
    };
    if (this.props.size === BoardSizes.CUSTOM) {
      this.customSizeHandler(newState);
    }
    this.setState(newState);
  }

  mineChangeHandler(newValue) {
    const newState = { numMines: Math.round(newValue) };
    if (this.props.size === BoardSizes.CUSTOM) {
      this.customSizeHandler(newState);
    }
    this.setState(newState);
  }

  rowChangeHandler(newValue) {
    const maxNumMines = Math.floor(Math.round(newValue) * this.state.cols * this.state.maxDensity);
    const newState = {
      rows: Math.round(newValue),
      maxNumMines,
      numMines: (this.state.numMines > maxNumMines) ? maxNumMines : this.state.numMines,
    };
    if (this.props.size === BoardSizes.CUSTOM) {
      this.customSizeHandler(newState);
    }
    this.setState(newState);
  }


  render() {
    return (
      <div className={styles['entire']}>
        <h1>Board Size</h1>
        <div className={styles['whole']}>
          <div className={styles['container']}>
            <div className="radio">
              <input type="radio"
                checked={this.props.size === BoardSizes.BEGINNER}
                // onChange={() => this.props.changeSize(SizePanel.sizes.BEGINNER)}
              />
              beginner
            </div>
            <div className="radio">
              <input type="radio"
                checked={this.props.size === BoardSizes.INTERMEDIATE}
                // onChange={() => this.props.changeSize(SizePanel.sizes.INTERMEDIATE)}
              />
              intermediate
            </div>
            <div className="radio">
              <input type="radio"
                checked={this.props.size === BoardSizes.EXPERT}
                // onChange={() => this.props.changeSize(SizePanel.sizes.EXPERT)}
              />
              expert
            </div>
            <div className={styles['gap']} />
            <div className={styles['row_container']}>
              <button>Create</button>
              <Load />
            </div>

          </div>
          <div className={styles['container']}>
            <div className="radio">
              <input type="radio"
                checked={this.props.size === BoardSizes.CUSTOM}
                onChange={() => this.customSizeHandler({})}
              />
              custom
            </div>
            <div className={styles['gap']} />
            <div className={styles['customSelectors']}>
              <NumericInput id="rows"
                className={styles['selector']}
                min={9}
                max={40}
                value={this.state.rows}
                onChange={newValue => this.rowChangeHandler(newValue)}
                snap
              />
              rows
              <NumericInput id="cols"
                className={styles['selector']}
                min={9}
                max={42}
                value={this.state.cols}
                onChange={newValue => this.colChangeHandler(newValue)}
                snap
              />
              cols
              <NumericInput id="numMines"
                className={styles['selector']}
                min={10}
                max={(this.state.maxNumMines < 999) ? this.state.maxNumMines : 999}
                value={this.state.numMines}
                onChange={newValue => this.mineChangeHandler(newValue)}
                snap
              />
              # of mines
            </div>
          </div>
        </div>
      </div>
    );
  }
}
