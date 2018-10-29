import PropTypes from 'prop-types';
import NumericInput from 'react-numeric-input';
import React, { Component } from 'react';

import styles from './style';

export default class ColorCodedKey extends Component {
  static propTypes = {
    // state props
    BC: PropTypes.bool.isRequired,
    BT: PropTypes.bool.isRequired,
    FC: PropTypes.bool.isRequired,
    'FC-STR': PropTypes.bool.isRequired,
    m: PropTypes.number.isRequired,
    mWC: PropTypes.bool.isRequired,
    STR2: PropTypes.bool.isRequired,
    // dispatch props
    toggleActive: PropTypes.func.isRequired,
  }

  changeHandler = (id, modifier) => {
    this.props.toggleActive(id, modifier);
  }

  colorCodedIcon = color => {
    let fill;
    switch (color) {
    case 'darkGreen': fill = { fill: 'rgb(0, 128, 0)' }; break;
    case 'darkBlue': fill = { fill: 'rgb(0, 0, 128)' }; break;
    case 'darkRed': fill = { fill: 'rgb(128, 0, 0)' }; break;
    case 'darkCyan': fill = { fill: 'rgb(0, 128, 128)' }; break;
    default: fill = { fill: 'rgb(192, 192, 192)' };
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
      <div>
        <div className={styles['backbone']}>
          <div className={styles['left']}>
            <div>
              {this.colorCodedIcon('darkGreen')}
              <input type="checkbox"
                id="BT"
                checked={this.props.BT}
                onChange={() => this.changeHandler('BT')}
              />BT
            </div>
          </div>
          <text className={styles['bracket']}>{'{'}</text>
          <div className={styles['right']}>
            <div>
              <input type="checkbox"
                id="BC"
                checked={this.props.BC}
                onChange={() => this.changeHandler('BT', 'BC')}
              />BC
            </div>
            <div>
              <input type="checkbox"
                id="FC"
                checked={this.props.FC}
                onChange={() => this.changeHandler('BT', 'FC')}
              />FC
            </div>
            <div>
              <input type="checkbox"
                id="FC-STR"
                checked={this.props['FC-STR']}
                onChange={() => this.changeHandler('BT', 'FC-STR')}
              />FC-STR
            </div>
          </div>
        </div>
        <div className={styles['gap']} />
        <div className={styles['container']}>
          <div>
            {this.colorCodedIcon('darkBlue')}
            <input type="checkbox"
              id="STR2"
              checked={this.props.STR2}
              onChange={() => this.changeHandler('STR2')}
            />STR2
          </div>
          <div>
            {this.colorCodedIcon('darkRed')}
            <input type="checkbox"
              id="mWC"
              checked={this.props.mWC}
              onChange={() => this.changeHandler('mWC')}
            />mWC
            <NumericInput id="m"
              className={styles['selector']}
              min={2}
              max={4}
              value={this.props.m}
              step={1}
              strict
              onChange={valueAsNumber => this.changeHandler('mWC', valueAsNumber)}
            />
          </div>
        </div>
      </div>
    );
  }
}
