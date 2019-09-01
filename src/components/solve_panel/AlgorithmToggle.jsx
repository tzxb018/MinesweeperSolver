import PropTypes from 'prop-types';
import NumericInput from 'react-numeric-input';
import React, { Component } from 'react';
import { Algorithms } from 'enums';

import styles from './style';

export default class AlgorithmToggle extends Component {
  static propTypes = {
    // state props
    BC: PropTypes.bool.isRequired,
    BT: PropTypes.bool.isRequired,
    FC: PropTypes.bool.isRequired,
    MAC: PropTypes.bool.isRequired,
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
            onClick={() => this.changeHandler(Algorithms.BT)}
          >
            BT
          </button>
          <div className={styles['bottom']}>
            <div>
              <input type="checkbox"
                id="BC"
                checked={this.props.BC}
                onChange={() => this.changeHandler(Algorithms.BT, Algorithms.BC)}
              />BC
            </div>
            <div>
              <input type="checkbox"
                id="FC"
                checked={this.props.FC}
                onChange={() => this.changeHandler(Algorithms.BT, Algorithms.FC)}
              />FC
            </div>
            <div>
              <input type="checkbox"
                id="MAC"
                checked={this.props.MAC}
                onChange={() => this.changeHandler(Algorithms.BT, Algorithms.MAC)}
              />MAC
            </div>
          </div>
        </div>
        <div style={{ height: '10px' }} />

        <h1>Consistency</h1>
        <div className={styles['container']}>
          <button className={styles['STR2']}
            style={{ borderStyle: this.props.STR2 ? 'inset' : 'outset' }}
            onClick={() => this.changeHandler(Algorithms.STR2)}
          >
            STR2
          </button>
          <div style={{ height: '10px' }} />
          <div>
            <button className={styles['mWC']}
              style={{ borderStyle: this.props.mWC ? 'inset' : 'outset' }}
              onClick={() => this.changeHandler(Algorithms.mWC)}
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
              onChange={
                valueAsNumber => this.changeHandler(Algorithms.mWC, valueAsNumber)}
              onClick={event => event.stopPropagation()}
            />
          </div>
        </div>
      </div>
    );
  }
}
