import PropTypes from 'prop-types';
// import NumericInput from 'react-numeric-input';
import React, { Component } from 'react';
// import { Algorithms } from 'enums';
// import Select from 'react-select';


import styles from './style';

const options = [
  { value: 'Unary', label: 'Unary' },
  { value: 'GAC', label: 'GAC' },
  { value: '2wC', label: '2wC' },
  { value: '3wC', label: '3wC' },
  { value: '4wC', label: '4wC' },
  { value: 'BT', label: 'Backbone' },
];

export default class AlgorithmToggle extends Component {

  static propTypes = {
    // state props
    // BC: PropTypes.bool.isRequired,
    // BT: PropTypes.bool.isRequired,
    // FC: PropTypes.bool.isRequired,
    // MAC: PropTypes.bool.isRequired,
    // m: PropTypes.number.isRequired,
    // mWC: PropTypes.bool.isRequired,
    // STR2: PropTypes.bool.isRequired,
    // dispatch props
    toggleActive: PropTypes.func.isRequired,
  }


  state = {
    selectedOption: null,
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log('Option selected:', selectedOption);
  };

  /* event handlers */

  changeHandler = (id, modifier) => {
    this.props.toggleActive(id, modifier);
  }

  render() {
    const { selectedOption } = this.state;
    return (
      <div className={styles['holders']}>

        {/* <div className={styles['border']}>
          <h1>Backbone</h1>
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
        </div> */}
        <div className={styles['border']}>
          <h1>Legend</h1>
          <div className={styles['table_container']}>
            <table>
              <tr>
                <td>
                  <div className={styles['unary']} />
                </td>
                <td>Unary Constraint</td>
              </tr>
              <tr>
                <td>
                  <div className={styles['gac']} />
                </td>
                <td>GAC (STR2)</td>
              </tr>
              <tr>
                <td>
                  <div className={styles['two_wc']} />
                </td>
                <td>2wiseConsistency (2wC)</td>
              </tr>
              <tr>
                <td>
                  <div className={styles['three_wc']} />
                </td>
                <td>3wiseConsistency (3wC)</td>
              </tr>
              <tr>
                <td>
                  <div className={styles['four_wc']} />
                </td>
                <td>4wiseConsistency (4wC)</td>
              </tr>
              <tr>
                <td>
                  <div className={styles['backbone']} />
                </td>
                <td>Backbone</td>
              </tr>
            </table>
          </div>
        </div>
        {/* <div className={styles['gap']} /> */}
        <div className={styles['border']}>
          <h1>Consistency</h1>
          <div className={styles['container']}>
            <div>
              {/* <Select
                value={selectedOption}
                onChange={this.handleChange}
                options={options}
              /> */}
              <select
                value={selectedOption}
                onChange={this.handleChange}
                options={options}
              />
              {/* <select>
                <option
                  onChange={() => this.changeHandler(Algorithms.Unary)}
                >Unary</option>
                <option
                  onChange={() => this.changeHandler(Algorithms.STR2)}
                >GAC</option>
                <option
                  onChange={() => this.changeHandler(Algorithms.mWC, 2)}
                >2wC</option>
                <option
                  onChange={() => this.changeHandler(Algorithms.mWC, 3)}
                >3wC</option>
                <option
                  onChange={() => this.changeHandler(Algorithms.mWC, 4)}
                >4wC</option>
                <option
                  onChange={() => this.changeHandler(Algorithms.BT, Algorithms.MAC)}
                >Backbone</option>
              </select> */}
            </div>
            {/* <button className={styles['STR2']}
              style={{ borderStyle: this.props.STR2 ? 'inset' : 'outset' }}
              onClick={() => this.changeHandler(Algorithms.STR2)}
            >
            STR2
            </button> */}
            {/* <div style={{ height: '10px' }} /> */}
            {/* <div className={styles['mWCHolder']}>
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
            </div> */}
          </div>

        </div>
      </div>
    );
  }
}
