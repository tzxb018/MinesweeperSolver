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

  constructor(props) {
    super(props);
    this.state = {
      rows: 16,
      cols: 30,
      numMines: 99,
      maxDensity: 0.8,
      maxNumMines: 16 * 30 - 9,
      board_size: 2,
    };
  }

  static sizes = {
    BEGINNER: { size: BoardSizes.BEGINNER, rows: 9, cols: 9, numMines: 10 },
    INTERMEDIATE: { size: BoardSizes.INTERMEDIATE, rows: 16, cols: 16, numMines: 40 },
    EXPERT: { size: BoardSizes.EXPERT, rows: 16, cols: 30, numMines: 99 },
  };

  /* static display components */


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

  handleChange(newSize) {
    this.setState({ board_size: newSize });
    console.log(this.state.board_size);
  }

  handleSubmit() {
    if (this.state.board_size === BoardSizes.BEGINNER) {
      this.props.changeSize(SizePanel.sizes.BEGINNER);
    } else if (this.state.board_size === BoardSizes.INTERMEDIATE) {
      this.props.changeSize(SizePanel.sizes.INTERMEDIATE);
    } else if (this.state.board_size === BoardSizes.EXPERT) {
      this.props.changeSize(SizePanel.sizes.EXPERT);
    } else {
      this.customSizeHandler({});
    }
  }

  render() {
    return (
      <div className={styles['entire']}>
        <h1>Board Size</h1>
        <div className={styles['whole']}>
          <div className={styles['container']}>
            <button type="submit" onClick={() => this.props.changeSize(SizePanel.sizes.BEGINNER)}>
              Beginner</button>
            <div className={styles['gap']} />
            <button type="submit" onClick={() => this.props.changeSize(SizePanel.sizes.INTERMEDIATE)}>
              Intermediate</button>
            <div className={styles['gap']} />
            <button type="submit" onClick={() => this.props.changeSize(SizePanel.sizes.EXPERT)}>
              Expert</button>
            <div className={styles['gap']} />
            <Load />
          </div>
          <div className={styles['container']}>
            <div className="button">
              <button type="submit" onClick={() => this.customSizeHandler({})}>
                Custom</button>
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
