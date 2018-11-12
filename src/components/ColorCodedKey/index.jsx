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
    case 'darkBlue': fill = { fill: '#24576b' }; break;
    case 'darkGray': fill = { fill: '#808285' }; break;
    case 'darkGreen': fill = { fill: '#7d7a10' }; break;
    case 'orange': fill = { fill: '#f58a1f' }; break;
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
        <div style={{
          fontWeight: 'bold',
          textAlign: 'center',
        }}
        >Backbone Search</div>
        <div className={styles['backbone']}>
          <div className={styles['top']}>
            <button className={styles['button']}
              style={{ borderStyle: this.props.BT ? 'inset' : 'outset' }}
              onClick={() => this.changeHandler('BT')}
            >
              BT
            </button>
          </div>
          <div className={styles['bottom']}>
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
              />STR2
            </div>
          </div>
        </div>
        <div style={{ height: '10px' }} />
        <div style={{
          fontWeight: 'bold',
          textAlign: 'center',
        }}
        >Consistency</div>
        <div className={styles['container']}>
          <button className={styles['STR2']}
            style={{ borderStyle: this.props.STR2 ? 'inset' : 'outset' }}
            onClick={() => this.changeHandler('STR2')}
          >
            STR2
          </button>
          <div style={{ height: '10px' }} />
          <div>
            <button className={styles['mWC']}
              style={{ borderStyle: this.props.mWC ? 'inset' : 'outset' }}
              onClick={() => this.changeHandler('mWC')}
            >
              mWC
            </button>
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
