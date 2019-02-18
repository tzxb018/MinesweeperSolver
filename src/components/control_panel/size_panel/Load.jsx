import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  loadFile,
  loadProblem,
} from 'reducers/load';

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

  state = {
    file: null,
    filename: '',
  };

  changeHandler(event) {
    if (event.target.value !== '') {
      event.persist();
      document.getElementById('loadMenu').style.display = 'none';
      this.props.loadStart();
      loadFile(event.target.files[0]).then(response => {
        document.getElementById('reload').style.display = 'block';
        this.props.loadEnd(response, event.target.files[0].name);
        this.setState({
          file: response,
          filename: event.target.files[0].name,
        });
      })
      .catch(error => {
        document.getElementById('reload').style.display = 'none';
        this.props.loadFail(error);
      });
    } else {
      document.getElementById('reload').style.display = 'none';
    }
  }

  loadClickHandler() {
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
      document.getElementById('reload').style.display = 'block';
      this.props.loadEnd(response, filename);
      this.setState({
        file: response,
        filename,
      });
    })
    .catch(error => {
      document.getElementById('reload').style.display = 'none';
      this.props.loadFail(error);
    });
  }

  reloadClickHandler() {
    document.getElementById('loadMenu').style.display = 'none';
    this.props.loadStart();
    this.props.loadEnd(this.state.file, this.state.filename);
  }

  render() {
    return (
      <div>
        <div className={styles['load-buttons']}>
          <button onClick={this.loadClickHandler} disabled={this.props.isLoading}>
            Load
          </button>
          <button id="reload" className={styles['reload']} onClick={() => this.reloadClickHandler()}>
            <span>{this.state.filename}</span>
            <div className={styles['tooltip']}>{this.state.filename}</div>
          </button>
        </div>
        <div id="loadMenu" className={styles['menu']} tabIndex="-1">
          <input type="file" id="file" accept=".xml" onChange={e => this.changeHandler(e)} />
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
