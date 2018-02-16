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

  render() {
    return (
      <div className={styles[this.props.size]} >
        <MineCounterContainer />
        <ResetButtonContainer />
        <TimerContainer />
        <MinefieldContainer />
      </div>
    );
  }
}
