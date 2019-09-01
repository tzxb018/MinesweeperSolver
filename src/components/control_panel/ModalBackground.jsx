import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './style';

export default class ModalBackground extends Component {
  static propTypes = {
    // state props
    isReportingError: PropTypes.bool.isRequired,
  }


  render() {
    if (this.props.isReportingError) {
      return <div className={styles['modal']} />;
    }
    return null;
  }
}
