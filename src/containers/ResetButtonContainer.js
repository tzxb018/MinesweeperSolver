import { connect } from 'react-redux';

import ResetButton from 'components/ResetButton';
import { reset } from 'actions/boardActions';
import { changeSmile } from 'actions/smileActions';

const mapStateToProps = state => ({
  isGameRunning: state.board.present.get('isGameRunning'),
  isGameWon: state.board.present.getIn(['minefield', 'numRevealed'])
    === (state.board.present.getIn(['minefield', 'cells']).size
    * state.board.present.getIn(['minefield', 'cells', 0]).size) - state.board.present.getIn(['minefield', 'numMines']),
  isGameStarted: state.board.present.getIn(['minefield', 'numRevealed']) > 0,
  smile: state.smile,
});

const mapDispatchToProps = dispatch => ({
  changeSmile: newSmile => {
    dispatch(changeSmile(newSmile));
  },

  reset: () => {
    dispatch(reset());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetButton);
