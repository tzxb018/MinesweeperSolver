import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './style.scss';

export default class MineCounter extends Component {
  static propTypes = {
    // state props
    numMinesLeft: PropTypes.number.isRequired,
  }

  render() {
    return (
      <div className={styles['intermediate']} fontFamily="PixelLCD-7" >
        {this.props.numMinesLeft}
      </div>
    );
  }
}
