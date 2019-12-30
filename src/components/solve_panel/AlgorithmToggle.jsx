import PropTypes from 'prop-types';
// import NumericInput from 'react-numeric-input';
import React, { Component } from 'react';
import { Algorithms } from 'enums';
import styles from './style';

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

  constructor(props) {
    super(props);
    this.state = { value: 'Unary' };

    this.handleChange = this.handleChange.bind(this);
  }

  /* event handlers */

  handleChange(event) {
    this.setState({ value: event.target.value });
    console.log(event.target.value);
    const algo = event.target.value;

    // updates the algorithms that are being used
    if (algo === 'Unary') {
      this.props.toggleActive(Algorithms.Unary);
    } else if (algo === 'GAC') {
      this.props.toggleActive(Algorithms.STR2);
    } else if (algo === '2wC') {
      this.props.toggleActive(Algorithms.mWC, 2);
    } else if (algo === '3wC') {
      this.props.toggleActive(Algorithms.mWC, 3);
    } else if (algo === '4wC') {
      this.props.toggleActive(Algorithms.mWC, 4);
    } else if (algo === 'Backbone') {
      this.props.toggleActive(Algorithms.BT);
    }
  }

  render() {
    return (
      <div className={styles['border']}>
        <h1>Consistency</h1>
        <div className={styles['holders']}>
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
          <div className={styles['container']}>
            <select value={this.state.value} onChange={this.handleChange}>
              <option value="Unary">Unary</option>
              <option value="GAC">GAC</option>
              <option value="2wC">2wC</option>
              <option value="3wC">3wC</option>
              <option value="4wC">4wC</option>
              <option value="Backbone">Backbone</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}
