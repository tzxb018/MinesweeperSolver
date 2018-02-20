import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './style';

export default class SizeSelector extends Component {
  static propTypes = {
    // state props
    size: PropTypes.string.isRequired,
    // dispatch props
    changeSize: PropTypes.func.isRequired,
  }

  changeHandler = e => {
    this.props.changeSize(e.target.value);
  }

  render() {
    return (
      <div className={styles['container']}>
        <div className="radio">
          <input type="radio"
            value="beginner"
            checked={this.props.size === 'beginner'}
            onChange={this.changeHandler}
          />
          beginner
        </div>
        <div className="radio">
          <input type="radio"
            value="intermediate"
            checked={this.props.size === 'intermediate'}
            onChange={this.changeHandler}
          />
          intermediate
        </div>
        <div className="radio">
          <input type="radio"
            value="expert"
            checked={this.props.size === 'expert'}
            onChange={this.changeHandler}
          />
          expert
        </div>
      </div>
    );
  }
}
