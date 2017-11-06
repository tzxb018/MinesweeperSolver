import React from 'react';
import styles from './style.scss';

export default class Cell extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  handleClick() {
    if (this.props.clickHandler) {
      this.props.clickHandler(this.props.row, this.props.col);
    }
  }

  handleRightClick(e) {
    e.preventDefault();
    if (this.props.rightClickHandler) {
      this.props.rightClickHandler(e, this.props.row, this.props.col);
    }
  }

  render() {
    if (this.props.flagged === true) {
      return (<div className={styles['flagged']} onContextMenu={this.handleRightClick} />);
    } else if (this.props.hidden === true) {
      return (<div className={styles['hidden']} onClick={this.handleClick} onContextMenu={this.handleRightClick} />);
    }
    switch (this.props.mines) {
    case -1:
      return (<div className={styles['hasMine']} />);
    case 1:
      return (<div className={styles['one']} />);
    case 2:
      return (<div className={styles['two']} />);
    case 3:
      return (<div className={styles['three']} />);
    case 4:
      return (<div className={styles['four']} />);
    case 5:
      return (<div className={styles['five']} />);
    case 6:
      return (<div className={styles['six']} />);
    case 7:
      return (<div className={styles['seven']} />);
    case 8:
      return (<div className={styles['eight']} />);
    default:
      return (<div className={styles['cell']} />);
    }
  }
}

Cell.propTypes = {
  mines: React.PropTypes.number.isRequired,
  hidden: React.PropTypes.bool.isRequired,
  row: React.PropTypes.number.isRequired,
  col: React.PropTypes.number.isRequired,
  clickHandler: React.PropTypes.func,
  flagged: React.PropTypes.bool.isRequired,
  rightClickHandler: React.PropTypes.func,
};
