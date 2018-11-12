import PropTypes from 'prop-types';
import React, { Component } from 'react';

import PeekToggle from 'containers/PeekToggleContainer';
import styles from './style';

export default class StepButton extends Component {
  static propTypes = {
    // state props
    canStep: PropTypes.bool.isRequired,
    // dispatch props
    changeSmile: PropTypes.func.isRequired,
    loop: PropTypes.func.isRequired,
    step: PropTypes.func.isRequired,
  }

  clickHandler = loop => {
    this.props.changeSmile('SMILE');
    if (loop) {
      this.props.loop();
    } else {
      this.props.step();
    }
  }

  mouseDownHandler = () => {
    this.props.changeSmile('SCARED');
  }

  render() {
    return (
      <div>
        <div style={{
          fontWeight: 'bold',
          textAlign: 'center',
        }}
        >Solve</div>
        <div className={styles['container']}>
          <PeekToggle />
          <div className={styles['flexContainer']}>
            <button className={styles['button']}
              onClick={() => this.clickHandler(false)}
              onMouseDown={this.mouseDownHandler}
              disabled={!this.props.canStep}
            >
              Step
            </button>
            <div className={styles['gap']} />
            <button className={styles['button']}
              onClick={() => this.clickHandler(true)}
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
