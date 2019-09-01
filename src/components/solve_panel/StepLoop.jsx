import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Smiles } from 'enums';

import PeekToggle from './containers/PeekToggleContainer';
import styles from './style';

export default class StepLoop extends Component {
  static propTypes = {
    // state props
    canStep: PropTypes.bool.isRequired,
    // dispatch props
    changeSmile: PropTypes.func.isRequired,
    loop: PropTypes.func.isRequired,
    step: PropTypes.func.isRequired,
  }


  /* event handlers */

  clickHandler = loop => {
    this.props.changeSmile(Smiles.SMILE);
    if (loop) {
      this.props.loop();
    } else {
      this.props.step();
    }
  }

  mouseDownHandler = () => {
    this.props.changeSmile(Smiles.SCARED);
  }


  render() {
    return (
      <div>
        <h1>Solve</h1>
        <div className={styles['solve']}>
          <PeekToggle />
          <div className={styles['flex_container']}>
            <button onClick={() => this.clickHandler(false)}
              onMouseDown={this.mouseDownHandler}
              disabled={!this.props.canStep}
            >
              Step
            </button>
            <div className={styles['gap']} />
            <button onClick={() => this.clickHandler(true)}
              onMouseDown={this.mouseDownHandler}
              disabled={!this.props.canStep}
            >
              Loop
            </button>
          </div>
        </div>
      </div>
    );
  }
}
