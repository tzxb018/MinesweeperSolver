import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class ColorCodedKey extends Component {
  static propTypes = {
    // state props
    PWC: PropTypes.bool.isRequired,
    STR: PropTypes.bool.isRequired,
    Unary: PropTypes.bool.isRequired,
    // dispatch props
    toggleActive: PropTypes.func.isRequired,
  }

  changeHandler = e => {
    this.props.toggleActive(e.target.value);
  }

  colorCodedIcon = color => {
    let fill;
    switch (color) {
    case 'blue':
      fill = { fill: 'blue' };
      break;
    case 'darkGreen':
      fill = { fill: 'rgb(0, 128, 0)' };
      break;
    case 'darkBlue':
      fill = { fill: 'rgb(0, 0, 128)' };
      break;
    case 'darkRed':
      fill = { fill: 'rgb(128, 0, 0)' };
      break;
    case 'darkCyan':
      fill = { fill: 'rgb(0, 128, 128)' };
      break;
    default:
      fill = { fill: 'rgb(192, 192, 192)' };
    }
    return (
      <svg height="16" width="16">
        <polygon points="0,0 16,0 0,16" style={{ fill: 'white' }} />
        <polygon points="16,16 0,16 16,0" style={{ fill: 'rgb(128, 128, 128)' }} />
        <polygon points="2,2 2,14 14,14 14,2" style={fill} />
      </svg>
    );
  }

  render() {
    return (
      <div className={styles['container']}>
        <div>
          {this.colorCodedIcon('blue')}
          <input type="checkbox"
            id="Unary"
            value="Unary"
            checked={this.props.Unary}
            onChange={this.changeHandler}
          />
          <label htmlFor="Unary">Unary</label>
        </div>
        <div>
          {this.colorCodedIcon('darkGreen')}
          <input type="checkbox"
            id="STR"
            value="STR"
            checked={this.props.STR}
            onChange={this.changeHandler}
          />
          <label htmlFor="STR">STR</label>
        </div>
        <div>
          {this.colorCodedIcon('darkBlue')}
          <input type="checkbox"
            id="PWC"
            value="PWC"
            checked={this.props.PWC}
            onChange={this.changeHandler}
          />
          <label htmlFor="PWC">PWC</label>
        </div>
      </div>
    );
  }
}
