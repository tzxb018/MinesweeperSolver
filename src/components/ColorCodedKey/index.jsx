import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ColorCodedKey extends Component {
  static propTypes = {
    // state props
    PWC: PropTypes.bool.isRequired,
    STR: PropTypes.bool.isRequired,
    Unary: PropTypes.bool.isRequired,
    // dispatch props
    toggleActive: PropTypes.func.isRequired,
  }

  changeHandler = e => {
    this.props.toggleActive(e.target.value);
  }

  render() {
    return (
      <div>
        <div>
          <input type="checkbox"
            id="Unary"
            value="Unary"
            checked={this.props.Unary}
            onChange={this.changeHandler}
          />
          <label htmlFor="Unary">Unary</label>
        </div>
        <div>
          <input type="checkbox"
            id="STR"
            value="STR"
            checked={this.props.STR}
            onChange={this.changeHandler}
          />
          <label htmlFor="STR">STR</label>
        </div>
        <div>
          <input type="checkbox"
            id="PWC"
            value="PWC"
            checked={this.props.PWC}
            onChange={this.changeHandler}
          />
          <label htmlFor="PWC">PWC</label>
        </div>
      </div>
    );
  }
}
