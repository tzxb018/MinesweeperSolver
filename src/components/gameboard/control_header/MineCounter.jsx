import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class MineCounter extends Component {
  static propTypes = {
    // state props
    numMinesLeft: PropTypes.number.isRequired,
  }

  render() {
    let length = 1;
    if (this.props.numMinesLeft > 0) {
      length = Math.log(this.props.numMinesLeft) * Math.LOG10E + 1;
    }
    let output = '';
    for (length; length < 3; length++) {
      output += '0';
    }
    output += this.props.numMinesLeft.toString();
    return (
      <div className={styles['container']}>
        {output}
      </div>
    );
  }
}
