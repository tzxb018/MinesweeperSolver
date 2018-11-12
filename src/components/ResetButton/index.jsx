import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class ResetButton extends Component {
  static propTypes = {
    // state props
    isGameRunning: PropTypes.bool.isRequired,
    isGameWon: PropTypes.bool.isRequired,
    isGameStarted: PropTypes.bool.isRequired,
    smile: PropTypes.string.isRequired,
    // dispatch props
    changeSmile: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isGameRunning && this.props.isGameRunning) {
      if (nextProps.isGameWon) {
        this.props.changeSmile('WON');
      } else if (nextProps.isGameStarted) {
        this.props.changeSmile('LOST');
      }
    } else if (nextProps.isGameRunning && !this.props.isGameRunning) {
      this.props.changeSmile('SMILE');
    }
  }

  face = {
    fill: 'yellow',
    stroke: 'black',
    strokeWidth: '1',
  };
  mouth = {
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: '1',
  }

  background = [
    <polygon key="border" points="1,1 25,1 1,25" style={{ fill: 'white' }} />,
    <polygon key="background" points="3,3 23,3 23,23 3,23" style={{ fill: 'rgb(192, 192, 192)' }} />,
    <circle key="face" cx="13.5" cy="13.5" r="8.5" style={this.face} />,
  ];
  smiles = new Map([
    ['LOST', [
      <path key="eyes" d="M9 9 L12 12 M9 12 L12 9 M15 9 L18 12 M15 12 L18 9" style={this.mouth} />,
      <path key="frown" d="M9 18 Q10 15, 13 15 L14 15 Q17 15, 18 18" style={this.mouth} />,
    ]],
    ['PRESSED', [
      <polygon key="background" points="2,2 25,2 25,25 2,25" style={{ fill: 'rgb(192, 192, 192)' }} />,
      <circle key="face" cx="14.5" cy="14.5" r="8.5" style={this.face} />,
      <circle key="leftEye" cx="12" cy="12" r="1" style={{ fill: 'black' }} />,
      <circle key="rightEye"cx="17" cy="12" r="1" style={{ fill: 'black' }} />,
      <path key="smile" d="M10 16 Q11 18, 14 18 L15 18 Q18 18, 19 16" style={this.mouth} />,
    ]],
    ['SCARED', [
      <circle key="leftEyeShadow" cx="10.5" cy="10.5" r="1.5" style={{ fill: 'rgb(128, 128, 0)' }} />,
      <circle key="leftEye" cx="11" cy="11" r="1" style={{ fill: 'black' }} />,
      <circle key="rightEyeShadow" cx="16.5" cy="10.5" r="1.5" style={{ fill: 'rgb(128, 128, 0)' }} />,
      <circle key="rightEye" cx="16" cy="11" r="1" style={{ fill: 'black' }} />,
      <circle key="mouth" cx="13.5" cy="16.5" r="2.5" style={this.mouth} />,
    ]],
    ['SMILE', [
      <circle key="leftEye" cx="11" cy="11" r="1" style={{ fill: 'black' }} />,
      <circle key="rightEye" cx="16" cy="11" r="1" style={{ fill: 'black' }} />,
      <path key="smile" d="M9 15 Q10 17, 13 17 L14 17 Q17 17, 18 15" style={this.mouth} />,
    ]],
    ['WON', [
      <path key="smile" d="M5 14 L9 10 L18 10 L22 14 M10 16 Q11 17, 13 17 L14 17 Q16 17, 17 16" style={this.mouth} />,
      <path key="shadesShadow" d="M9 10 Q9 14, 10 14 L11 14Z M16 14 L17 14 Q18 14, 18 10Z" fill="rgb(128, 128, 0)" />,
      <path key="shades" d="M9 10 Q9 14, 11 14 T13 10Z M14 10 Q14 14, 16 14 T18 10Z" fill="black" />,
    ]],
  ]);

  mouseDownHandler = () => {
    this.props.changeSmile('PRESSED');
  }

  mouseUpHandler = () => {
    this.props.reset();
  }

  render() {
    return (
      <svg
        className={styles['svg']}
        height="26"
        width="26"
        onMouseUp={this.mouseUpHandler}
        onMouseDown={this.mouseDownHandler}
      >
        <polygon points="0,0 26,0 26,26 0,26" style={{ fill: 'rgb(128, 128, 128)' }} />
        {this.props.smile !== 'PRESSED' ? this.background : null}
        {this.smiles.get(this.props.smile)}
      </svg>
    );
  }
}
