import PropTypes from 'prop-types';
import React, { Component } from 'react';

import MineCounterContainer from 'containers/MineCounterContainer';
import MinefieldContainer from 'containers/MinefieldContainer';
import ResetButtonContainer from 'containers/ResetButtonContainer';
import TimerContainer from 'containers/TimerContainer';

import styles from './style';

export default class Board extends Component {
  static propTypes = {
    // state props
    size: PropTypes.string.isRequired,
  }

  lightBorderGray = { fill: 'white' };
  darkBorderGray = { fill: 'rgb(128, 128, 128)' };
  gray = { fill: 'rgb(192, 192, 192)' };

  background = () => {
    let height;
    let width;
    switch (this.props.size) {
    case 'beginner':
      height = 206;
      width = 164;
      break;
    case 'expert':
      height = 318;
      width = 500;
      break;
    default:
      height = 318;
      width = 276;
    }

    return (
      <svg className={styles['svg']} height={height} width={width} >
        <polgyon points={`0,0 ${width},0 ${width - 2},2 2,${height - 2} 0,${height}`} style={this.lightBorderGray} />
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
        <MineCounterContainer />
        <ResetButtonContainer />
        <TimerContainer />
        <MinefieldContainer />
      </div>
    );
  }
}
