import React from 'react';
import PropTypes from 'prop-types';

import styles from './style.scss';

export default class ResetButton extends React.Component {
  static propTypes = {
    // state props
    smile: PropTypes.string.isRequired,
    // dispatch props
    changeSmile: PropTypes.func.isRequired,
    resetBoard: PropTypes.func.isRequired,
  };

  clickHandler = () => {
    this.props.resetBoard();
  }

  mouseDownHandler = () => {
    this.props.changeSmile('PRESSED');
  }

  mouseUpHandler = () => {
    this.props.changeSmile('SMILE');
  }

  render() {
    return (
      <div className={styles[this.props.smile]}
        onClick={this.clickHandler}
        onMouseDown={this.mouseDownHandler}
        onMouseUp={this.mouseUpHandler}
      />
    );
  }
}

