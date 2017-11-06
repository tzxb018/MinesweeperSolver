import React from 'react';
import styles from './style.scss';

export default class ResetButton extends React.Component {
  render() {
    return (
      <button className={styles['button']} onClick={this.props.clickHandler}>
        {this.props.text}
      </button>
    );
  }
}

ResetButton.propTypes = {
  text: React.PropTypes.string,
  clickHandler: React.PropTypes.func,
};
