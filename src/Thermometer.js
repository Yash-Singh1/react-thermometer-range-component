/* Modified version of react-thermometer-component */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Thermometer.css';

class Thermometer extends Component {
  static propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minTemp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxTemp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    steps: PropTypes.number,
    size: PropTypes.oneOf(['small', 'normal', 'large']),
    format: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    reverseGradient: PropTypes.bool,
    averageTempLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minTempLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxTempLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  render() {
    this.options = this._generateOptions();
    const theme = `thermometer--theme-${this.options.theme()}`;
    const size = `thermometer--${this.options.size()}`;
    const height = { height: `${this.options.height}px` };
    const heightBgColor = { height: `calc(${this.options.height}px - 57px)` };
    const reverse = this.options.reverseGradient ? 'Reverse' : '';
    const valstr = this.options.valstr();
    const minstr = this.options.minstr();
    const maxstr = this.options.maxstr();
    const heightAndBottomPercent = {
      height: `${this.options.maxPercent() - this.options.minPercent()}%`,
      bottom: `${this.options.minPercent()}%`,
    };
    const averageBottom = {
      bottom: `${((this.options.percent() - this.options.minPercent()) / (this.options.maxPercent() - this.options.minPercent())) * 100}%`,
      top: 'initial',
    };
    this._createIntervals();
    const stepIntervals = this._createIntervalsUI(this.options.intervals);

    return (
      <div style={height} className={`thermometer ${size} ${theme}`}>
        <div className="thermometer__draw-a"></div>
        <div className={`thermometer__draw-b${reverse}`}></div>
        <div className="thermometer__meter">
          <ul className="thermometer__statistics">{stepIntervals}</ul>
          <div style={heightAndBottomPercent} className="thermometer__mercury">
            <div className="thermometer__percent-min">
              {this.options.minTempLabel}: {minstr}
            </div>
            <div className="thermometer__percent-max">
              {this.options.maxTempLabel}: {maxstr}
            </div>
            <div className="thermometer__percent-average" style={averageBottom}>
              {this.options.averageTempLabel}: {valstr}
            </div>
            <div className="thermometer__mask">
              <div className={`thermometer__bg-color${reverse}`} style={heightBgColor}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _generateOptions() {
    return {
      theme: () => (this.props.theme === 'light' || this.props.theme === 'dark' ? this.props.theme : 'light'),
      value: this.props.value || 0, // default 0
      minTemp: this.props.minTemp || 0, // default 0
      maxTemp: this.props.maxTemp || 0, // default 0
      max: this.props.max || 100, // default 100
      steps: this.props.steps,
      format: this.props.format || '',
      size: () => (this.props.size === 'small' || this.props.size === 'normal' || this.props.size === 'large' ? this.props.size : 'normal'),
      height: this.props.height || 200, // default 200
      valstr: () => this.options.value + this.options.format,
      minstr: () => this.options.minTemp + this.options.format,
      maxstr: () => this.options.maxTemp + this.options.format,
      percent: () => (this.options.value / this.options.max) * 100,
      minPercent: () => (this.options.minTemp / this.options.max) * 100,
      maxPercent: () => (this.options.maxTemp / this.options.max) * 100,
      reverseGradient: this.props.reverseGradient || false, // default false,
      averageTempLabel: this.props.averageTempLabel || 'Average',
      minTempLabel: this.props.minTempLabel || 'Low',
      maxTempLabel: this.props.maxTempLabel || 'High',
      intervals: [],
    };
  }

  _createIntervals() {
    if (this.options.steps) {
      for (let step = 0; step <= this.options.steps; step++) {
        let value = ((this.options.max / this.options.steps) * step).toFixed(2);
        let percent = (value / this.options.max) * 100;
        let interval = { percent: percent, label: value + this.options.format };
        this.options.intervals.push(interval);
      }
    }
  }

  _createIntervalsUI(intervals) {
    return intervals.map((step, index) => {
      return (
        <li key={index} style={{ bottom: `calc(${step.percent}% - 1px)` }}>
          {step.label}
        </li>
      );
    });
  }
}

export default Thermometer;
