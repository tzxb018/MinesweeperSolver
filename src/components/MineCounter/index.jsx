import React from 'react';

export default class MineCounter extends React.Component {
  render() {
    return (
      <div>
        {this.props.numMines}
      </div>
    );
  }
}

MineCounter.propTypes = {
  numMines: React.PropTypes.number.isRequired,
};
