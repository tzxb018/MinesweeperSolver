import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { loadProblem } from 'reducers/load';

import styles from './style';

export default class Load extends Component {
  static propTypes = {
    // state props
    isLoading: PropTypes.bool.isRequired,
    // dispatch props
    loadEnd: PropTypes.func.isRequired,
    loadFail: PropTypes.func.isRequired,
    loadStart: PropTypes.func.isRequired,
  }

  blurHandler() {
    document.getElementById('loadMenu').style.display = 'none';
  }

  clickHandler() {
    if (document.getElementById('loadMenu').style.display === 'none'
    || document.getElementById('loadMenu').style.display === '') {
      document.getElementById('loadMenu').style.display = 'block';
    } else {
      document.getElementById('loadMenu').style.display = 'none';
    }
  }

  mouseDownHandler(filename) {
    document.getElementById('loadMenu').style.display = 'none';
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
      <div>
        <button onClick={this.clickHandler} disabled={this.props.isLoading} onBlur={this.blurHandler}>
          Load
        </button>
        <div id="loadMenu" className={styles['menu']} tabIndex="-1">
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('1239297023.xml')}>
            1239297023
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('complex_simple.xml')}>
            complex_simple
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('complex_simple2.xml')}>
            complex_simple2
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('complex.xml')}>
            complex
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('ken1.xml')}>
            ken1
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('oz.xml')}>
            oz
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('power_of_rstar2.xml')}>
            power_of_rstar2
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('requires2rc.xml')}>
            requires2rc
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert1.xml')}>
            robert1
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert2.xml')}>
            robert2
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert3.xml')}>
            robert3
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert4.xml')}>
            robert4
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert5_2.xml')}>
            robert5_2
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert5.xml')}>
            robert5
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert6.xml')}>
            robert6
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert7.xml')}>
            robert7
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert8.xml')}>
            robert8
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert9.xml')}>
            robert9
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('robert51.xml')}>
            robert51
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('screwy.xml')}>
            screwy
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('simple.xml')}>
            simple
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('small2circle.xml')}>
            small2circle
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('twocircle.xml')}>
            twocircle
          </div>
          <div className={styles['menu-item']} onMouseDown={() => this.mouseDownHandler('unsolvable.xml')}>
            unsolvable
          </div>
        </div>
      </div>
    );
  }
}
