import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class CheatButton extends Component {
  static propTypes = {
    // state props
    canCheat: PropTypes.bool.isRequired,
    // dispatch props
    cheat: PropTypes.func.isRequired,
  }

  /* local state */

  state = {
    random: false,
  }


  /* event handlers */

  clickHandler = () => {
    this.props.cheat(this.state.random);
  }


  render() {
    return (
      <div>
        <h1>Cheats</h1>
        <div className={styles['container']}>
          <button className={styles['button']} onClick={this.clickHandler} disabled={!this.props.canCheat}>
            Cheat
          </button>
          <div>
            <input type="radio"
              id="random"
              checked={this.state.random}
              onChange={() => this.setState({ random: true })}
            />
            <label htmlFor="random">random</label>
          </div>
          <div>
            <input type="radio"
              id="fringeOnly"
              checked={!this.state.random}
              onChange={() => this.setState({ random: false })}
            />
            <label htmlFor="fringeOnly">fringe only</label>
          </div>
        </div>
      </div>
    );
  }
}
