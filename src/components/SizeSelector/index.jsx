import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';

import styles from './style';

export default class SizeSelector extends Component {
  static propTypes = {
    // state props
    size: PropTypes.string.isRequired,
    // dispatch props
    changeSize: PropTypes.func.isRequired,
  }

  state = {
    rows: 16,
    cols: 30,
    numMines: 99,
    maxNumMines: 16 * 30 - 9,
  }

  sizes = {
    BEGINNER: { size: 'BEGINNER', rows: 9, cols: 9, numMines: 10 },
    INTERMEDIATE: { size: 'INTERMEDIATE', rows: 16, cols: 16, numMines: 40 },
    EXPERT: { size: 'EXPERT', rows: 16, cols: 30, numMines: 99 },
  }

  customSizeHandler(newState) {
    const state = {
      size: 'CUSTOM',
      rows: newState.rows ? newState.rows : this.state.rows,
      cols: newState.cols ? newState.cols : this.state.cols,
      numMines: newState.numMines ? newState.numMines : this.state.numMines,
    };
    this.props.changeSize(state);
  }

  render() {
    return (
      <div className={styles['container']}>
        <div className="radio">
          <input type="radio"
            checked={this.props.size === 'BEGINNER'}
            onChange={() => this.props.changeSize(this.sizes.BEGINNER)}
          />
          beginner
        </div>
        <div className="radio">
          <input type="radio"
            checked={this.props.size === 'INTERMEDIATE'}
            onChange={() => this.props.changeSize(this.sizes.INTERMEDIATE)}
          />
          intermediate
        </div>
        <div className="radio">
          <input type="radio"
            checked={this.props.size === 'EXPERT'}
            onChange={() => this.props.changeSize(this.sizes.EXPERT)}
          />
          expert
        </div>
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
            max={30}
            value={this.state.rows}
            onChange={value => {
              const maxNumMines = value * this.state.cols - 9;
              const newState = {
                rows: value,
                maxNumMines,
                numMines: this.state.numMines > maxNumMines ? maxNumMines : this.state.numMines,
              };
              if (this.props.size === 'CUSTOM') {
                this.customSizeHandler(newState);
              }
              this.setState(newState);
            }}
            strict
          />
          rows
          <NumericInput id="cols"
            className={styles['selector']}
            min={9}
            max={45}
            value={this.state.cols}
            onChange={value => {
              const maxNumMines = this.state.rows * value - 9;
              const newState = {
                cols: value,
                maxNumMines,
                numMines: this.state.numMines > maxNumMines ? maxNumMines : this.state.numMines,
              };
              if (this.props.size === 'CUSTOM') {
                this.customSizeHandler(newState);
              }
              this.setState(newState);
            }}
            strict
          />
          cols
          <NumericInput id="numMines"
            className={styles['selector']}
            min={10}
            max={this.state.maxNumMines}
            value={this.state.numMines}
            onChange={value => {
              const newState = { numMines: value };
              if (this.props.size === 'CUSTOM') {
                this.customSizeHandler(newState);
              }
              this.setState(newState);
            }}
            strict
          />
          # of mines
        </div>
      </div>
    );
  }
}
