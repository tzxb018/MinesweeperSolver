import PropTypes from 'prop-types';
import React, { Component } from 'react';

import MineCounter from './containers/MineCounterContainer';
import Minefield from './containers/MinefieldContainer';
import ResetButton from './containers/ResetButtonContainer';
import Timer from './containers/TimerContainer';

import styles from './style';

export default class Gameboard extends Component {
  static propTypes = {
    // state props
    numRows: PropTypes.number.isRequired,
    numCols: PropTypes.number.isRequired,
  }

  /* static display components */

  static lightBorderGray = { fill: 'white' };
  static darkBorderGray = { fill: 'rgb(128, 128, 128)' };
  static gray = { fill: 'rgb(192, 192, 192)' };


  /* dynamic display components */

  background = () => {
    const height = this.props.numRows * 16 + 62;
    const width = this.props.numCols * 16 + 20;

    return (
      <svg className={styles['svg']} height={height} width={width}>
        <polygon points={`0,0 ${width},0 ${width - 2},2 2,${height - 2} 0,${height}`} style={this.lightBorderGray} />
        <polygon points={`${width},${height} 0,${height} 2,${height - 2} ${width - 2},2 ${width},0`}
          style={this.darkBorderGray}
        />
        <polygon points={`2,2 ${width - 2},2 ${width - 2},${height - 2} 2,${height - 2}`} style={this.gray} />
        <polygon points={`8,8 ${width - 8},8 ${width - 10},10 10,10 10,42 8,44`} style={this.darkBorderGray} />
        <polygon points={`${width - 8},44 8,44 10,42 ${width - 10},42 ${width - 10},10 ${width - 8},8`}
          style={this.lightBorderGray}
        />
        <polygon points={`8,50 ${width - 8},50 ${width - 10},52 10,52 10,${height - 10} 8,${height - 8}`}
          style={this.darkBorderGray}
        />
        <polygon points={`${width - 8},${height - 8} 8,${height - 8} 10,${height - 10} ${width - 10},${height - 10}
          ${width - 10},52 ${width - 8},50`}
          style={this.lightBorderGray}
        />
      </svg>
    );
  }


  render() {
    return (
      <div className={styles['container']} >
        {this.background()}
        <div className={styles['header']} >
          <MineCounter />
          <ResetButton />
          <Timer />
        </div>
        <div className={styles['cells']} >
          <Minefield />
        </div>
      </div>
    );
  }
}
