import { connect } from 'react-redux';

import CheatButton from 'components/CheatButton';
import { cheat } from 'actions/boardActions';

const mapStateToProps = () => ({

});

const mapDispatchToProps = dispatch => ({
  cheat: () => {
    dispatch(cheat());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheatButton);
