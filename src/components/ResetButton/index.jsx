import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class ResetButton extends Component {
  static propTypes = {
    // state props
    size: PropTypes.string.isRequired,
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
      <div className={classNames({ [styles[this.props.smile]]: true, [styles[this.props.size]]: true })}
        onClick={this.clickHandler}
        onMouseDown={this.mouseDownHandler}
        onMouseUp={this.mouseUpHandler}
      />
    );
  }
}
