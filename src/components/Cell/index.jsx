import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Cell extends Component {
  static propTypes = {
    // state props
    component: PropTypes.number.isRequired,
    flagged: PropTypes.bool.isRequired,
    hidden: PropTypes.bool.isRequired,
    isPeeking: PropTypes.bool.isRequired,
    mines: PropTypes.number.isRequired,
    // dispatch props
    changeSmile: PropTypes.func.isRequired,
    revealCell: PropTypes.func.isRequired,
    toggleFlag: PropTypes.func.isRequired,
    // own props
    col: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
  }

  // colors
  lightBorderGray = { fill: 'white' };
  darkBorderGray = { fill: 'rgb(128, 128, 128)' };
  gray = { fill: 'rgb(192, 192, 192)' };
  black = { fill: 'black' };
  blue = { fill: 'blue' };
  darkGreen = { fill: 'rgb(0, 128, 0)' };
  red = { fill: 'red' };
  darkBlue = { fill: 'rgb(0, 0, 128)' };
  darkRed = { fill: 'rgb(128, 0, 0)' };
  darkCyan = { fill: 'rgb(0, 128, 128)' };

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

  componentCell = () => {
    let fill;
    switch (this.props.component) {
    case 1:
      fill = this.blue;
      break;
    case 2:
      fill = this.darkGreen;
      break;
    case 3:
      fill = this.red;
      break;
    case 4:
      fill = this.darkBlue;
      break;
    case 5:
      fill = this.darkRed;
      break;
    case 6:
      fill = this.darkCyan;
      break;
    case 7:
      fill = this.black;
      break;
    case 8:
      fill = this.darkBorderGray;
      break;
    default:
      fill = this.gray;
    }
    return (
      <svg height="16" width="16" onClick={this.clickHandler} onContextMenu={this.rightClickHandler}>
        <polygon points="0,0 16,0 0,16" style={this.lightBorderGray} />
        <polygon points="16,16 0,16 16,0" style={this.darkBorderGray} />
        <polygon points="2,2, 2,14, 14,14 14,2" style={fill} />
      </svg>
    );
  }

  hiddenCell = () => {
    if (this.props.flagged) {
      return (
        <svg height="16"
          width="16"
          onContextMenu={this.rightClickHandler}
        >
          <polygon points="0,0 16,0 0,16" style={this.lightBorderGray} />
          <polygon points="16,16 0,16 16,0" style={this.darkBorderGray} />
          <polygon points="2,2, 2,14, 14,14 14,2" style={this.gray} />
          <polygon points="9,3 8,3 4,5 4,6 8,8 9,8" style={this.red} />
          <polygon points="9,8 8,8 8,10 4,11 4,13 12,13 12,11 9,10" style={this.black} />
        </svg>
      );
    }
    return (
      <svg height="16"
        width="16"
        onClick={this.clickHandler}
        onContextMenu={this.rightClickHandler}
        onMouseDown={this.mouseDownHandler}
      >
        <polygon points="0,0 16,0 0,16" style={this.lightBorderGray} />
        <polygon points="16,16 0,16 16,0" style={this.darkBorderGray} />
        <polygon points="2,2, 2,14, 14,14 14,2" style={this.gray} />
      </svg>
    );
  }

  mineCell = () => (
    <svg height="16" width="16">
      <polygon points="0,0 16,0 16,16 0,16" style={this.darkBorderGray} />
      <polygon points="1,1 16,1 16,16 1,16"
        style={this.props.mines === -2 && !this.props.flagged ? this.red : this.gray}
      />
      <circle cx="8.5" cy="8.5" r="4.5" style={this.black} />
      <path d="M4 4 L5 4 L5 5 L4 5 M8 2 L9 2 L9 4 L8 4 M12 4 L13 4 L13 5 L12 5 M13 8 L15 8 L15 9 L13 9 M12 12 L13 12
        L13 13 L12 13 M8 13 L9 13 L9 15 L8 15 M4 12 L5 12 L5 13 L4 13 M2 8 L4 8 L4 9 L2 9Z"
        fill="black"
      />
      <polygon points="6,6 8,6 8,8 6,8" style={this.lightBorderGray} />
      {this.props.mines === -2 && this.props.flagged ?
        <polyline points="2,2 8.5,8.5 15,2 8.5,8.5 15,15 8.5,8.5 2,15 8.5,8.5"
          stroke="red"
          strokeWidth="1"
        /> : null}
    </svg>
  )

  revealedCell = () => {
    const numbers = [
      <polygon points="8,3 10,3 10,11 12,11 12,13 5,13 5,11 7,11 7,7 5,7 5,6" style={this.blue} />,
      <polygon points="3,6 3,4 4,3 12,3 13,4 13,8 7,10 7,11 13,11 13,13 3,13 3,10 10,7 10,5 6,5 6,6"
        style={this.darkGreen}
      />,
      <polygon points="3,3 12,3 13,4 13,7 12,8 13,9 13,12 12,13 3,13 3,11 10,11 10,9 6,9 6,7 10,7 10,5 3,5"
        style={this.props.component === -1 ? this.gray : this.red}
      />,
      <polygon points="3,7 5,3 8,3 7,7 9,7 9,3 12,3 12,7 13,7 13,9 12,9 12,13 9,13 9,9 3,9" style={this.darkBlue} />,
      <polygon points="3,3 13,3 13,5 6,5 6,7 12,7 13,8 13,12 12,13 3,13 3,11 10,11 10,9 3,9" style={this.darkRed} />,
      <polygon points="3,4 4,3 12,3 12,5 6,5 6,7 12,7 13,8 13,12 12,13 4,13 3,12 6,9 6,11 10,11 10,9 6,9
        3,12"
        style={{ fill: 'rgb(0, 128, 128)' }}
      />,
      <polygon points="3,3 13,3 13,5 10,13 7,13 10,5 3,5" style={this.black} />,
      <polygon points="4,3 12,3 13,4 13,7 12,8 13,9 13,12 12,13 4,13 3,12 3,9 4,8 3,7 3,4 6,9 6,11 10,11 10,9 6,9 3,4
        6,5 6,7 10,7 10,5 6,5 3,4"
        style={this.darkBorderGray}
      />,
    ];
    return (
      <svg height="16" width="16">
        <polygon points="0,0 16,0 16,16 0,16" style={this.darkBorderGray} />
        <polygon points="1,1 16,1 16,16 1,16" style={this.props.component === -1 ? this.red : this.gray} />
        {numbers[this.props.mines - 1]}
      </svg>
    );
  }

  render() {
    if (this.props.hidden) {
      if (this.props.isPeeking && this.props.component > 0 && !this.props.flagged) {
        return this.componentCell();
      }
      return this.hiddenCell();
    } else if (this.props.mines < 0) {
      return this.mineCell();
    }
    return this.revealedCell();
  }
}
