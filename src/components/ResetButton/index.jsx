import { connect } from 'react-redux';
import React from 'react';

import { resetBoard } from '../../actions/boardActions.js';
import styles from './style.scss';

class ResetButton extends React.Component {
  clickHandler = () => {
    resetBoard();
  }

  render() {
    return (
      <button className={styles['button']} onClick={this.clickHandler}>
        Reset
      </button>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  resetBoard: () => {
    dispatch(resetBoard());
  },
});

export default connect(
  mapDispatchToProps,
)(ResetButton);
