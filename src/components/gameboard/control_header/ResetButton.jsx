import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Smiles } from 'enums';

import styles from './style';

export default class ResetButton extends Component {
  static propTypes = {
    // state props
    isGameRunning: PropTypes.bool.isRequired,
    isGameWon: PropTypes.bool.isRequired,
    isGameStarted: PropTypes.bool.isRequired,
    smile: PropTypes.symbol.isRequired,
    // dispatch props
    changeSmile: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  /* lifecycle handlers */

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isGameRunning && this.props.isGameRunning) {
      if (nextProps.isGameWon) {
        this.props.changeSmile(Smiles.WON);
      } else if (nextProps.isGameStarted) {
        this.props.changeSmile(Smiles.LOST);
      }
    } else if (nextProps.isGameRunning && !this.props.isGameRunning) {
      this.props.changeSmile(Smiles.SMILE);
    }
  }


  /* static display components */

  static face = {
    fill: 'yellow',
    stroke: 'black',
    strokeWidth: '1',
  };

  static background = [
    <polygon key="border" points="1,1 25,1 1,25" style={{ fill: 'white' }} />,
    <polygon key="background" points="3,3 23,3 23,23 3,23" style={{ fill: 'rgb(192, 192, 192)' }} />,
    <circle key="face" cx="13.5" cy="13.5" r="8.5" style={ResetButton.face} />,
  ];

  static mouth = {
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: '1',
  }

  static smiles = new Map([
    [Smiles.LOST, [
      <path key="eyes" d="M9 9 L12 12 M9 12 L12 9 M15 9 L18 12 M15 12 L18 9" style={ResetButton.mouth} />,
      <path key="frown" d="M9 18 Q10 15, 13 15 L14 15 Q17 15, 18 18" style={ResetButton.mouth} />,
    ]],
    [Smiles.PRESSED, [
      <polygon key="background" points="2,2 25,2 25,25 2,25" style={{ fill: 'rgb(192, 192, 192)' }} />,
      <circle key="face" cx="14.5" cy="14.5" r="8.5" style={ResetButton.face} />,
      <circle key="leftEye" cx="12" cy="12" r="1" style={{ fill: 'black' }} />,
      <circle key="rightEye"cx="17" cy="12" r="1" style={{ fill: 'black' }} />,
      <path key="smile" d="M10 16 Q11 18, 14 18 L15 18 Q18 18, 19 16" style={ResetButton.mouth} />,
    ]],
    [Smiles.SCARED, [
      <circle key="leftEyeShadow" cx="10.5" cy="10.5" r="1.5" style={{ fill: 'rgb(128, 128, 0)' }} />,
      <circle key="leftEye" cx="11" cy="11" r="1" style={{ fill: 'black' }} />,
      <circle key="rightEyeShadow" cx="16.5" cy="10.5" r="1.5" style={{ fill: 'rgb(128, 128, 0)' }} />,
      <circle key="rightEye" cx="16" cy="11" r="1" style={{ fill: 'black' }} />,
      <circle key="mouth" cx="13.5" cy="16.5" r="2.5" style={ResetButton.mouth} />,
    ]],
    [Smiles.SMILE, [
      <circle key="leftEye" cx="11" cy="11" r="1" style={{ fill: 'black' }} />,
      <circle key="rightEye" cx="16" cy="11" r="1" style={{ fill: 'black' }} />,
      <path key="smile" d="M9 15 Q10 17, 13 17 L14 17 Q17 17, 18 15" style={ResetButton.mouth} />,
    ]],
    [Smiles.WON, [
      <path key="smile"
        d="M5 14 L9 10 L18 10 L22 14 M10 16 Q11 17, 13 17 L14 17 Q16 17, 17 16"
        style={ResetButton.mouth}
      />,
      <path key="shadesShadow" d="M9 10 Q9 14, 10 14 L11 14Z M16 14 L17 14 Q18 14, 18 10Z" fill="rgb(128, 128, 0)" />,
      <path key="shades" d="M9 10 Q9 14, 11 14 T13 10Z M14 10 Q14 14, 16 14 T18 10Z" fill="black" />,
    ]],
  ]);


  /* event handlers */

  mouseDownHandler = () => {
    this.props.changeSmile(Smiles.PRESSED);
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
        {this.props.smile !== Smiles.PRESSED ? ResetButton.background : null}
        {ResetButton.smiles.get(this.props.smile)}
      </svg>
    );
  }
}
