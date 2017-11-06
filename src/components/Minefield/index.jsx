import React from 'react';
import styles from './style.scss';
import Cell from '../Cell/index.jsx';
import ResetButton from '../ResetButton/index.jsx';
import MineCounter from '../MineCounter/index.jsx';

export default class Minefield extends React.Component {
  constructor(props) {
    super(props);
    this.temp = [];
    for (let i = 0; i < this.props.height; i++) {
      this.temp.push([]);
      for (let j = 0; j < this.props.width; j++) {
        this.temp[i].push({
          flagged: false,
          hidden: true,
          mines: 0,
        });
      }
    }
    this.cells = this.temp;
    this.gameEnded = false;
    this.hasMines = false;
    this.numMines = this.props.numMines;

    this.clickHandler = this.clickHandler.bind(this);
    this.formatCells = this.formatCells.bind(this);
    this.placeMines = this.placeMines.bind(this);
    this.placeNumbers = this.placeNumbers.bind(this);
    this.resetField = this.resetField.bind(this);
    this.revealNeighbors = this.revealNeighbors.bind(this);
    this.rightClickHandler = this.rightClickHandler.bind(this);
    this.formatCells();
  }

  // handles onClick event when a cell is clicked
  clickHandler(i, j) {
    // if the field has no mines already, it places mines such that the clicked cell is empty
    if (this.hasMines === false) {
      this.placeMines(i, j);
      this.hasMines = true;
    }
    // reveals the clicked cell
    this.temp[i][j].hidden = false;
    // if that cell had zero mines nearby, reveals all neighbors
    if (this.temp[i][j].mines === 0) {
      this.revealNeighbors(i, j);
      this.formatCells();
      this.forceUpdate();
    } else if (this.temp[i][j].mines === -1) {
      // else if that cell had a mine, kills the game and reveals all mines
      this.gameEnded = true;
      for (let x = 0; x < this.props.height; x++) {
        for (let y = 0; y < this.props.width; y++) {
          delete this.temp[x][y].clickHandler;
          delete this.temp[x][y].rightClickHandler;
          if (this.temp[x][y].mines === -1) {
            this.temp[x][y].hidden = false;
          }
        }
      }
      this.formatCells();
      this.forceUpdate();
    } else {
      // updates the field
      this.formatCells();
      this.forceUpdate();
    }
  }

  // formats props from this.temp into renderable <Cell /> types stored in this.cells
  formatCells() {
    const formatter = [];
    for (let i = 0; i < this.props.height; i++) {
      formatter.push([]);
      for (let j = 0; j < this.props.width; j++) {
        if (this.gameEnded === false) {
          this.temp[i][j].clickHandler = this.clickHandler;
          if (this.hasMines === true) {
            this.temp[i][j].rightClickHandler = this.rightClickHandler;
          }
        }
        formatter[i].push(<Cell {...this.temp[i][j]} row={i} col={j} />);
      }
    }
    this.cells = formatter;
  }

  // drops random mines avoiding the safe cell, places numbers, and updates the cells
  placeMines(safeI, safeJ) {
    // iterates through random rows and cols, dropping mines and calling placeNumbers
    let minesLeft = this.numMines;
    let i = 0;
    let j = 0;
    while (minesLeft !== 0) {
      i = Math.floor(Math.random() * this.props.height);
      j = Math.floor(Math.random() * this.props.width);
      // checks if that cell already has a mine and is not within the range of the safe cell
      if (this.temp[i][j].mines !== -1 && !((i >= safeI - 1 && i <= safeI + 1) && (j >= safeJ - 1 && j <= safeJ + 1))) {
        this.temp[i][j].mines = -1;
        this.placeNumbers(i, j);
        minesLeft--;
      }
    }
    // reformats the cells
    this.formatCells();
  }

  // updates the number of mines nearby for all surrounding cells of row i, col j
  placeNumbers(i, j) {
    // adds one to mines if the neighboring cells exist and don't already have mines
    // top-left
    if (i - 1 >= 0 && j - 1 >= 0 && this.temp[i - 1][j - 1].mines !== -1) {
      this.temp[i - 1][j - 1].mines += 1;
    }
    // top-mid
    if (i - 1 >= 0 && this.temp[i - 1][j].mines !== -1) {
      this.temp[i - 1][j].mines += 1;
    }
    // top-right
    if (i - 1 >= 0 && j + 1 < this.props.width && this.temp[i - 1][j + 1].mines !== -1) {
      this.temp[i - 1][j + 1].mines += 1;
    }
    // mid-right
    if (j + 1 < this.props.width && this.temp[i][j + 1].mines !== -1) {
      this.temp[i][j + 1].mines += 1;
    }
    // bottom-right
    if (i + 1 < this.props.height && j + 1 < this.props.width && this.temp[i + 1][j + 1].mines !== -1) {
      this.temp[i + 1][j + 1].mines += 1;
    }
    // bottom-mid
    if (i + 1 < this.props.height && this.temp[i + 1][j].mines !== -1) {
      this.temp[i + 1][j].mines += 1;
    }
    // bottom-left
    if (i + 1 < this.props.height && j - 1 >= 0 && this.temp[i + 1][j - 1].mines !== -1) {
      this.temp[i + 1][j - 1].mines += 1;
    }
    // mid-left
    if (j - 1 >= 0 && this.temp[i][j - 1].mines !== -1) {
      this.temp[i][j - 1].mines += 1;
    }
  }

  // resets the cells and forces update
  resetField() {
    // resets the cells to remove any old mines or uncovered spaces
    for (let i = 0; i < this.props.height; i++) {
      for (let j = 0; j < this.props.width; j++) {
        this.temp[i][j] = {
          flagged: false,
          hidden: true,
          mines: 0,
        };
      }
    }
    this.gameEnded = false;
    this.hasMines = false;
    this.numMines = this.props.numMines;
    this.formatCells();
    this.forceUpdate();
  }

  // reveals all neighboring cells when an empty cell is uncovered
  // BEWARE OF RECURSION!!
  revealNeighbors(i, j) {
    // reveals all neighboring cells if they exist and haven't been revealed already
    // if the newly revealed cell also has no mines nearby, recursively calls revealNeighbors
    // top-left
    if (i - 1 >= 0 && j - 1 >= 0 && this.temp[i - 1][j - 1].hidden !== false) {
      this.temp[i - 1][j - 1].hidden = false;
      if (this.temp[i - 1][j - 1].mines === 0) {
        this.revealNeighbors(i - 1, j - 1);
      }
    }
    // top-mid
    if (i - 1 >= 0 && this.temp[i - 1][j].hidden !== false) {
      this.temp[i - 1][j].hidden = false;
      if (this.temp[i - 1][j].mines === 0) {
        this.revealNeighbors(i - 1, j);
      }
    }
    // top-right
    if (i - 1 >= 0 && j + 1 < this.props.width && this.temp[i - 1][j + 1].hidden !== false) {
      this.temp[i - 1][j + 1].hidden = false;
      if (this.temp[i - 1][j + 1].mines === 0) {
        this.revealNeighbors(i - 1, j + 1);
      }
    }
    // mid-right
    if (j + 1 < this.props.width && this.temp[i][j + 1].hidden !== false) {
      this.temp[i][j + 1].hidden = false;
      if (this.temp[i][j + 1].mines === 0) {
        this.revealNeighbors(i, j + 1);
      }
    }
    // bottom-right
    if (i + 1 < this.props.height && j + 1 < this.props.width && this.temp[i + 1][j + 1].hidden !== false) {
      this.temp[i + 1][j + 1].hidden = false;
      if (this.temp[i + 1][j + 1].mines === 0) {
        this.revealNeighbors(i + 1, j + 1);
      }
    }
    // bottom-mid
    if (i + 1 < this.props.height && this.temp[i + 1][j].hidden !== false) {
      this.temp[i + 1][j].hidden = false;
      if (this.temp[i + 1][j].mines === 0) {
        this.revealNeighbors(i + 1, j);
      }
    }
    // bottom-left
    if (i + 1 < this.props.height && j - 1 >= 0 && this.temp[i + 1][j - 1].hidden !== false) {
      this.temp[i + 1][j - 1].hidden = false;
      if (this.temp[i + 1][j - 1].mines === 0) {
        this.revealNeighbors(i + 1, j - 1);
      }
    }
    // mid-left
    if (j - 1 >= 0 && this.temp[i][j - 1].hidden !== false) {
      this.temp[i][j - 1].hidden = false;
      if (this.temp[i][j - 1].mines === 0) {
        this.revealNeighbors(i, j - 1);
      }
    }
  }

  // handles onContextMenu event when a cell is right-clicked
  rightClickHandler(e, i, j) {
    if (this.temp[i][j].flagged === true) {
      this.temp[i][j].flagged = false;
      this.numMines++;
      this.formatCells();
      this.forceUpdate();
    } else if (this.numMines > 0) {
      this.temp[i][j].flagged = true;
      this.numMines--;
      this.formatCells();
      this.forceUpdate();
    }
  }

  render() {
    return (
      <div>
        <MineCounter numMines={this.numMines} />
        <ResetButton text="Reset" clickHandler={this.resetField} />
        <div className={styles['container']}>
          {this.cells}
        </div>
      </div>
    );
  }
}

Minefield.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  numMines: React.PropTypes.number,
};
