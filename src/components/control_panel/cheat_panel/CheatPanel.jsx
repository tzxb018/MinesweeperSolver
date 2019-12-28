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
  handleCheat(cheatType) {
    this.setState({ random: cheatType });
    this.props.cheat(this.state.random);
  }

  clickHandler = () => {
    this.props.cheat(this.state.random);
  }


  render() {
    return (
      <div className={styles['container']}>
        <h1>Cheats</h1>
        <div className={styles['holder']}>
          {/* <button className={styles['button']} onClick={this.clickHandler} disabled={!this.props.canCheat}>
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
          </div> */}
          <button type="submit"
            disabled={!this.props.canCheat}
            onClick={() => this.handleCheat(true)}
          >Random</button>
          <div className={styles['gap']} />
          <button type="submit"
            disabled={!this.props.canCheat}
            onClick={() => this.handleCheat(false)}
          >Fringe</button>
        </div>
      </div>
    );
  }
}
