import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class MineCounter extends Component {
  static propTypes = {
    // state props
    numMinesLeft: PropTypes.number.isRequired,
  }

  render() {
    return (
      <div>
        {this.props.numMinesLeft}
      </div>
    );
  }
}
