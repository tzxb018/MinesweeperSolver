import PropTypes from 'prop-types';
import NumericInput from 'react-numeric-input';
import React, { Component } from 'react';

import styles from './style';

export default class AlgorithmToggle extends Component {
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


  /* event handlers */

  changeHandler = (id, modifier) => {
    this.props.toggleActive(id, modifier);
  }


  render() {
    return (
      <div>
        <h1>Backbone Search</h1>
        <div className={styles['search']}>
          <button className={styles['button']}
            style={{ borderStyle: this.props.BT ? 'inset' : 'outset' }}
            onClick={() => this.changeHandler('BT')}
          >
            BT
          </button>
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

        <h1>Consistency</h1>
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
