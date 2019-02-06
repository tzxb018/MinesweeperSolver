import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { loadProblem } from 'reducers/load';

export default class Load extends Component {
  static propTypes = {
    // state props
    isLoading: PropTypes.bool.isRequired,
    // dispatch props
    loadEnd: PropTypes.func.isRequired,
    loadFail: PropTypes.func.isRequired,
    loadStart: PropTypes.func.isRequired,
  }

  clickHandler(filename) {
    this.props.loadStart();
    loadProblem(filename).then(response => {
      this.props.loadEnd(response);
    })
    .catch(error => {
      this.props.loadFail(error);
    });
  }

  render() {
    return (
      <button onClick={() => this.clickHandler('complex_simple.xml')} disabled={this.props.isLoading}>
        Load
      </button>
    );
  }
}
