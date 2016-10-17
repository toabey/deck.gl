import 'babel-polyfill';
import React, {Component} from 'react';
import {DeckGLOverlay} from 'deck.gl';
import TripsLayer from './trips-layer/trips-layer';
import {MAPBOX_STYLES} from '../../constants/defaults';

const BLENDING = {
  enable: true,
  blendFunc: ['SRC_ALPHA', 'ONE'],
  blendEquation: 'FUNC_ADD'
};

export default class HeroDemo extends Component {

  static get info() {
    return {
      title: 'Yellow Cab Trips in Manhattan',
      desc: 'June 16, 2016'
    };
  }

  static get data() {
    return {
      type: 'text',
      url: 'data/hero-data.txt',
      worker: 'workers/hero-data-decoder.js'
    };
  }

  static get parameters() {
    return {};
  }

  static get viewport() {
    return {
      mapStyle: MAPBOX_STYLES.DARK,
      longitude: -74.0,
      latitude: 40.74,
      zoom: 12,
      pitch: 0,
      bearing: 0
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
    this._animation = null;
  }

  componentWillReceiveProps(nextProps) {
    const {data} = nextProps;
    if (data && data !== this.props.data) {
      if (!this._animation) {
        this._animate();
      }
    }
  }

  componentWillUnmount() {
    if (!this._animation) {
      cancelAnimationFrame(this._animation);
    }
  }

  _animate() {
    this.setState({time: (this.state.time + 1) % 3600});
    this._animation = requestAnimationFrame(this._animate.bind(this));
  }

  render() {
    const {viewport, params, data} = this.props;

    if (!data) {
      return null;
    }
    const layer = new TripsLayer({
      id: 'trips',
      ...viewport,
      data: data,
      getPath: d => d.segments,
      getColor: d => d.vendor === 0 ? [253,128,93] : [23,184,190],
      opacity: 0.3,
      strokeWidth: 2,
      trailLength: 180,
      currentTime: this.state.time
    });

    return (
      <DeckGLOverlay {...viewport} layers={ [layer] }
        blending={BLENDING}
       />
    );
  }
}
