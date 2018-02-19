import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';

class UndoRedo extends Component {
  static propTypes = {
    // state props
    canRedo: PropTypes.bool.isRequired,
    canUndo: PropTypes.bool.isRequired,
    // dispatch props
    onRedo: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
  }

  render() {
    return (
      <p>
        <button onClick={this.props.onUndo} disabled={!this.props.canUndo} >
          Undo
        </button>
        <button onClick={this.props.onRedo} disabled={!this.props.canRedo} >
          Redo
        </button>
      </p>
    );
  }

}

const mapStateToProps = state => ({
  canUndo: state.board.past.length > 0,
  canRedo: state.board.future.length > 0,
});

const mapDispatchToProps = dispatch => ({
  onUndo: () => {
    dispatch(ActionCreators.undo());
  },

  onRedo: () => {
    dispatch(ActionCreators.redo());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UndoRedo);
