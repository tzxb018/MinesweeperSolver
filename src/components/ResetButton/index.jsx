import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class ResetButton extends Component {
  static propTypes = {
    // state props
    size: PropTypes.string.isRequired,
    smile: PropTypes.string.isRequired,
    // dispatch props
    changeSmile: PropTypes.func.isRequired,
    resetBoard: PropTypes.func.isRequired,
  };

  // colors
  lightBorderGray = { fill: 'white' };
  darkBorderGray = { fill: 'rgb(128, 128, 128)' };
  gray = { fill: 'rgb(192, 192, 192)' };
  black = { fill: 'black' };
  yellow = {
    fill: 'yellow',
    stroke: 'black',
    strokeWidth: '1',
  };
  darkYellow = { fill: 'rgb(128, 128, 0)' };

  mouseDownHandler = () => {
    this.props.changeSmile('PRESSED');
  }

  mouseUpHandler = () => {
    this.props.resetBoard();
  }

  smile = () => {
    const smile = [];
    if (this.props.smile === 'PRESSED') {
      smile.push(<polygon points="2,2 25,2 25,25 2,25" style={this.gray} />);
      smile.push(<circle cx="14.5" cy="14.5" r="8.5" style={this.yellow} />);
      smile.push(<circle cx="12" cy="12" r="1" style={this.black} />);
      smile.push(<circle cx="17" cy="12" r="1" style={this.black} />);
      smile.push(
        <path d="M10 16 Q11 18, 14 18 L15 18 Q18 18, 19 16" fill="transparent" stroke="black" strokeWidth="1" />
      );
    } else {
      smile.push(<polygon points="1,1 25,1 1,25" style={this.lightBorderGray} />);
      smile.push(<polygon points="3,3 23,3 23,23 3,23" style={this.gray} />);
      smile.push(<circle cx="13.5" cy="13.5" r="8.5" style={this.yellow} />);
      switch (this.props.smile) {
      case 'LOST':
        smile.push(<path d="M9 9 L12 12 M9 12 L12 9 M15 9 L18 12 M15 12 L18 9" stroke="black" strokeWidth="1" />);
        smile.push(
          <path d="M9 18 Q10 15, 13 15 L14 15 Q17 15, 18 18" fill="transparent" stroke="black" strokeWidth="1" />
        );
        break;
      case 'SCARED':
        smile.push(<circle cx="10.5" cy="10.5" r="1.5" style={this.darkYellow} />);
        smile.push(<circle cx="11" cy="11" r="1" style={this.black} />);
        smile.push(<circle cx="16.5" cy="10.5" r="1.5" style={this.darkYellow} />);
        smile.push(<circle cx="16" cy="11" r="1" style={this.black} />);
        smile.push(<circle cx="13.5" cy="16.5" r="2.5" style={{ stroke: 'black', strokeWidth: '1' }} />);
        break;
      case 'WON':
        smile.push(<path d="M5 14 L9 10 L18 10 L22 14 M10 16 Q11 17, 13 17 L14 17 Q16 17, 17 16"
          fill="transparent"
          stroke="black"
          strokeWidth="1"
        />);
        smile.push(<path d="M9 10 Q9 14, 10 14 L11 14Z M16 14 L17 14 Q18 14, 18 10Z" fill="rgb(128, 128, 0)" />);
        smile.push(<path d="M9 10 Q9 14, 11 14 T13 10Z M14 10 Q14 14, 16 14 T18 10Z" fill="black" />);
        break;
      default:
        smile.push(<circle cx="11" cy="11" r="1" style={this.black} />);
        smile.push(<circle cx="16" cy="11" r="1" style={this.black} />);
        smile.push(
          <path d="M9 15 Q10 17, 13 17 L14 17 Q17 17, 18 15" stroke="black" strokeWidth="1" fill="transparent" />
        );
      }
    }

    return smile;
  }

  render() {
    return (
      <svg className={styles[this.props.size]}
        height="26"
        width="26"
        onMouseDown={this.mouseDownHandler}
        onMouseUp={this.mouseUpHandler}
      >
        <polygon points="0,0 26,0 26,26 0,26" style={this.darkBorderGray} />
        {this.smile()}
      </svg>
    );
  }
}
