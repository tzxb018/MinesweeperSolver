import PropTypes from 'prop-types';
import React, { Component } from 'react';

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
    isPeeking: PropTypes.bool.isRequired,
    // dispatch props
    loseGame: PropTypes.func.isRequired,
    revealCell: PropTypes.func.isRequired,
    toggleFlag: PropTypes.func.isRequired,
  }

  colors = [
    'rgb(192, 192, 192)',
    'blue',
    'rgb(0, 128, 0)',
    'red',
    'rgb(0, 0, 128)',
    'rgb(128, 0, 0)',
    'rgb(0, 128, 128)',
    'black',
    'rgb(128, 128, 128)',
  ];
  flag = [
    <polygon points="9,3 8,3 4,5 4,6 8,8 9,8" style={{ fill: 'red' }} />,
    <polygon points="9,8 8,8 8,10 4,11 4,13 12,13 12,11 9,10" style={{ fill: 'black' }} />,
  ];
  mine = [
    <circle cx="8.5" cy="8.5" r="4.5" style={{ fill: 'black' }} />,
    <path d="M4 4 L5 4 L5 5 L4 5 M8 2 L9 2 L9 4 L8 4 M12 4 L13 4 L13 5 L12 5 M13 8 L15 8 L15 9 L13 9 M12 12 L13 12
      L13 13 L12 13 M8 13 L9 13 L9 15 L8 15 M4 12 L5 12 L5 13 L4 13 M2 8 L4 8 L4 9 L2 9Z"
      fill="black"
    />,
    <polygon points="6,6 8,6 8,8 6,8" style={{ fill: 'white' }} />,
  ];
  numbers = [
    null,
    <polygon points="8,3 10,3 10,11 12,11 12,13 5,13 5,11 7,11 7,7 5,7 5,6" style={{ fill: 'blue' }} />,
    <polygon points="3,6 3,4 4,3 12,3 13,4 13,8 7,10 7,11 13,11 13,13 3,13 3,10 10,7 10,5 6,5 6,6"
      style={{ fill: 'rgb(0, 128, 0)' }}
    />,
    <polygon points="3,3 12,3 13,4 13,7 12,8 13,9 13,12 12,13 3,13 3,11 10,11 10,9 6,9 6,7 10,7 10,5 3,5"
      style={this.props.cspColor === -1 ? { fill: 'rgb(192, 192, 192)' } : { fill: 'red' }}
    />,
    <polygon points="3,7 5,3 8,3 7,7 9,7 9,3 12,3 12,7 13,7 13,9 12,9 12,13 9,13 9,9 3,9"
      style={{ fill: 'rgb(0, 0, 128)' }}
    />,
    <polygon points="3,3 13,3 13,5 6,5 6,7 12,7 13,8 13,12 12,13 3,13 3,11 10,11 10,9 3,9"
      style={{ fill: 'rgb(128, 0, 0)' }}
    />,
    <polygon points="3,4 4,3 12,3 12,5 6,5 6,7 12,7 13,8 13,12 12,13 4,13 3,12 6,9 6,11 10,11 10,9 6,9 3,12"
      style={{ fill: 'rgb(0, 128, 128)' }}
    />,
    <polygon points="3,3 13,3 13,5 10,13 7,13 10,5 3,5" style={{ fill: 'black' }} />,
    <polygon points="4,3 12,3 13,4 13,7 12,8 13,9 13,12 12,13 4,13 3,12 3,9 4,8 3,7 3,4 6,9 6,11 10,11 10,9 6,9 3,4 6,5
      6,7 10,7 10,5 6,5 3,4"
      style={{ fill: 'rgb(128, 128, 128)' }}
    />,
  ];

  clickHandler = () => {
    if (this.props.content === -1) {
      this.props.loseGame(this.props.row, this.props.col);
    } else {
      this.props.revealCell(this.props.row, this.props.col);
    }
  }

  rightClickHandler = e => {
    if (this.props.isGameRunning) {
      e.preventDefault();
      this.props.toggleFlag(this.props.row, this.props.col);
    }
  }

  // contents of a revealed cell
  content = () => {
    const graphic = [];
    if (this.props.content < 0) {
      graphic.push(...this.mine);
      if (this.props.isFlagged) {
        graphic.push(
          <polyline points="2,2 8.5,8.5 15,2 8.5,8.5 15,15 8.5,8.5 2,15 8.5,8.5" stroke="red" strokeWidth="1" />
        );
      }
    } else {
      graphic.push(this.numbers[this.props.content]);
    }
    return graphic;
  }

  // border and color coded filler for a hidden cell
  hiddenCell = () => {
    const graphic = [
      <polygon points="0,0 16,0 0,16" style={{ fill: 'white' }} />,
      <polygon points="16,16 0,16 16,0" style={{ fill: 'rgb(128, 128, 128)' }} />,
      <polygon points="2,2, 2,14, 14,14 14,2"
        style={{ fill: this.props.isPeeking && !this.props.isFlagged ?
          this.colors[this.props.cspColor] : 'rgb(192, 192, 192' }}
      />,
    ];
    if (this.props.isFlagged && this.props.content !== -2) {
      return graphic.concat(this.flag);
    }
    return graphic;
  }

  // background and content for a revealed cell
  revealedCell = () => {
    const graphic = [
      <polygon points="0,0 16,0 16,16 0,16" style={{ fill: 'rgb(128, 128, 128)' }} />,
      <polygon points="1,1 16,1 16,16 1,16"
        style={this.props.isPeeking && (this.props.cspColor === -1 || (this.props.content === -2 &&
          !this.props.isFlagged)) ? { fill: 'red' } : { fill: 'rgb(192, 192, 192)' }}
      />,
    ];
    if (this.props.content !== 0) {
      return graphic.concat(this.content());
    }
    return graphic;
  }

  // tooltip for a solved cell
  tooltip = () => [
    <span className={styles['tooltiptext']}>
      <svg height="16" width="16">
        <polygon points="0,0 16,0 16,16 0,16" style={{ fill: 'rgb(128, 128, 128' }} />
        <polygon points="1,1 16,1 16,16 1,16" style={{ fill: 'rgb(192, 192, 192)' }} />
        {this.props.cspSolution ? this.mine : null}
      </svg>
    </span>,
  ];

  render() {
    return (
      <div className={styles['tooltip']}
        onClick={this.props.isHidden && !this.props.isFlagged ? this.clickHandler : null}
        onContextMenu={this.props.isHidden ? this.rightClickHandler : null}
      >
        <svg height="16" width="16">
          {this.props.isHidden ? this.hiddenCell() : this.revealedCell()}
        </svg>
        {this.props.isHidden && this.props.cspColor > 0 && this.props.isPeeking ? this.tooltip() : null}
      </div>
    );
  }
}
