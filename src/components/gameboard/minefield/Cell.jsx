import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Mines,
  Smiles,
} from 'enums';

import styles from './style';

export default class Cell extends Component {
  static propTypes = {
    // own props
    col: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
    // board state props
    content: PropTypes.number.isRequired,
    cspColor: PropTypes.number.isRequired,
    cspSolution: PropTypes.bool,
    isFlagged: PropTypes.bool.isRequired,
    isGameRunning: PropTypes.bool.isRequired,
    isHidden: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    isPeeking: PropTypes.bool.isRequired,
    isReportingError: PropTypes.bool.isRequired,
    // dispatch props
    changeSmile: PropTypes.func.isRequired,
    highlight: PropTypes.func.isRequired,
    loseGame: PropTypes.func.isRequired,
    revealCell: PropTypes.func.isRequired,
    toggleFlag: PropTypes.func.isRequired,
  }


  /* static display components */

  static colors = [
    '#c0c0c0',  // $background_grey
    '#24576b',  // $unl_dark_blue
    '#808285',  // $unl_dark_gray
    '#7d7a10',  // $unl_dark_green
    '#ffd74f',  // $unl_wheat
    '#a5228d',  // $unl_magenta
    '#f58a1f',  // $unl_orange
    '#7398b1',  // $unl_blue
    '#808080',  // $border_grey
  ];

  static flag = [
    <polygon key="flag" points="10.5,4.5 9.5,4.5 5.5,6.5 5.5,7.5 9.5,9.5 10.5,9.5" style={{ fill: 'red' }} />,
    <polygon key="pole"
      points="10.5,9.5 9.5,9.5 9.5,11.5 5.5,12.5 5.5,14.5 13.5,14.5 13.5,12.5 10.5,11.5"
      style={{ fill: 'black' }}
    />,
  ];

  static highlight = <rect height="20" width="20" key="highlight" className={styles['cellHighlight']} />;

  static mine = [
    <circle key="mine" cx="10" cy="10" r="4.5" style={{ fill: 'black' }} />,
    <path key="spikes"
      d="M5.5 5.5 L6.5 5.5 L6.5 6.5 L5.5 6.5 M9.5 3.5 L10.5 3.5 L10.5 5.5 L9.5 5.5 M13.5 5.5
      L14.5 5.5 L14.5 6.5 L13.5 6.5 M14.5 9.5 L16.5 9.5 L16.5 10.5 L14.5 10.5 M13.5 13.5 L14.5 13.5 L14.5 14.5
        L13.5 14.5 M9.5 14.5 L10.5 14.5 L10.5 16.5 L9.5 16.5 M5.5 13.5 L6.5 13.5 L6.5 14.5 L5.5 14.5 M3.5 9.5
        L5.5 9.5 L5.5 10.5 L3.5 10.5Z"
      fill="black"
    />,
    <polygon key="shine" points="7.5,7.5 9.5,7.5 9.5,9.5 7.5,9.5" style={{ fill: 'white' }} />,
  ];


  /* dynamic display components */

  numbers = [
    null,
    <polygon key="1"
      points="9.5,4.5 11.5,4.5 11.5,12.5 13.5,12.5 13.5,14.5 6.5,14.5 6.5,12.5
    8.5,12.5 8.5,8.5 6.5,8.5 6.5,7.5"
      style={{ fill: 'blue' }}
    />,
    <polygon key="2"
      points="5,7 5,6 6,5 14,5 15,6 15,10 9,12 9,13 15,13 15,15 5,15 5,12 12,9 12,7 8,7 8,8"
      style={{ fill: 'rgb(0, 128, 0)' }}
    />,
    <polygon key="3"
      points="5,5 14,5 15,6 15,9 14,10 15,11 15,14 14,15 5,15 5,13 12,13 12,11 8,11 8,8 12,9 12,7 5,7"
      style={this.props.cspColor === -1 ? { fill: 'rgb(192, 192, 192)' } : { fill: 'red' }}
    />,
    <polygon key="4"
      points="5,9 7,5 10,5 9,9 11,9 11,5 14,5 14,9 15,9 15,11 14,11 14,15 11,15 11,11 5,11"
      style={{ fill: 'rgb(0, 0, 128)' }}
    />,
    <polygon key="5"
      points="5,5 15,5 15,7 8,7 9,9 14,9 15,10 15,14 14,15 5,15 5,13 12,13 12,11 5,11"
      style={{ fill: 'rgb(128, 0, 0)' }}
    />,
    <polygon key="6"
      points="5,6 6,5 14,5 14,7 8,7 8,9 14,9 15,10 15,14 14,15 6,15 5,14 8,11 8,13 12,13 12,11 8,11 5,14"
      style={{ fill: 'rgb(0, 128, 128)' }}
    />,
    <polygon key="7" points="5,5 15,5 15,7 12,15 9,15 12,7 5,7" style={{ fill: 'black' }} />,
    <polygon key="8"
      points="6,5 14,5 15,6 15,9 14,10 15,11 15,14 14,15 6,15 5,14 5,11 6,10 5,9 5,6 8,11 8,13 12,13 12,11
      8,11 5,6 8,7 8,9
      12,9 12,7 8,7 5,6"
      style={{ fill: 'rgb(128, 128, 128)' }}
    />,
  ];

  content = () => {
    const graphic = [];
    if (this.props.content < 0) {
      graphic.push(...Cell.mine);
      if (this.props.content === Mines.MINE_FALSE) {
        graphic.push(
          <polyline key="x"
            points="2,2 8.5,8.5 15,2 8.5,8.5 15,15 8.5,8.5 2,15 8.5,8.5"
            stroke="red"
            strokeWidth="1"
          />
        );
      }
    } else {
      graphic.push(this.numbers[this.props.content]);
    }
    return graphic;
  }

  hiddenCell = () => {
    const graphic = [
      <polygon key="topLeftBorder" points="0,0 20,0 0,20" style={{ fill: 'white' }} />,
      <polygon key="bottomRightBorder" points="20,20 0,20 20,0" style={{ fill: 'rgb(128, 128, 128)' }} />,
      <polygon key="hiddenCellFill"
        points="2,2, 2,18, 18,18 18,2"
        style={{ fill: this.props.isPeeking && !this.props.isFlagged ?
          Cell.colors[this.props.cspColor] : 'rgb(192, 192, 192)' }}
      />,
    ];
    if (this.props.isFlagged && this.props.content !== -2) {
      graphic.push(...Cell.flag);
    }
    return graphic;
  }

  revealedCell = () => {
    const graphic = [
      <polygon key="revealedBorder" points="0,0 20,0 20,20 0,20" style={{ fill: 'rgb(128, 128, 128)' }} />,
      <polygon key="revealedBackground"
        points="1,1 20,1 20,20 1,20"
        style={this.props.content === Mines.MINE_EXPLODED || (this.props.isPeeking && this.props.cspColor === -1)
          ? { fill: 'red' } : { fill: 'rgb(192, 192, 192)' }}
      />,
    ];
    if (this.props.content !== 0) {
      graphic.push(...this.content());
    }
    return graphic;
  }

  tooltip = () => {
    const graphic = [
      <polygon key="border" points="0,0 20,0 20,20 0,20" style={{ fill: 'rgb(128, 128, 128' }} />,
      <polygon key="background" points="1,1 20,1 20,20 1,20" style={{ fill: 'rgb(192, 192, 192)' }} />,
    ];
    if (this.props.cspSolution) {
      graphic.push(...Cell.mine);
    }
    return (
      <span key="tooltip" className={styles['tooltiptext']}>
        <svg height="20" width="20">
          {graphic}
        </svg>
      </span>
    );
  }


  /* event handlers */

  clickHandler = () => {
    if (this.props.isReportingError) {
      this.props.highlight([{ row: this.props.row, col: this.props.col }]);
    } else if (this.props.content === -1) {
      this.props.loseGame(this.props.row, this.props.col);
    } else {
      this.props.changeSmile(Smiles.SMILE);
      this.props.revealCell(this.props.row, this.props.col);
    }
  }

  mouseDownHandler = e => {
    if (e.nativeEvent.which === 1 && !this.props.isReportingError) {
      this.props.changeSmile(Smiles.SCARED);
    }
  }

  rightClickHandler = e => {
    if (this.props.isGameRunning && !this.props.isReportingError) {
      e.preventDefault();
      this.props.toggleFlag(this.props.row, this.props.col);
    }
  }


  render() {
    const hasClickHandler = (this.props.isHidden && !this.props.isFlagged) || this.props.isReportingError;
    return (
      <div className={styles['tooltip']}
        onClick={hasClickHandler ? this.clickHandler : null}
        onContextMenu={this.props.isHidden ? this.rightClickHandler : null}
        onMouseDown={this.props.isHidden && !this.props.isFlagged ? this.mouseDownHandler : null}
      >
        <svg height="20" width="20">
          {this.props.isHidden ? this.hiddenCell() : this.revealedCell()}
          {this.props.isHighlighted ? Cell.highlight : null}
        </svg>
        {this.props.isHidden && !this.props.isFlagged && this.props.cspColor > 0
          && this.props.isPeeking ? this.tooltip() : null}
      </div>
    );
  }
}
