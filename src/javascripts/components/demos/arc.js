import 'babel-polyfill';
import React, {Component} from 'react';
import {DeckGLOverlay, ArcLayer} from 'deck.gl';
import {scaleQuantile} from 'd3-scale';

import {MAPBOX_STYLES} from '../../constants/defaults';

const inFlowColors = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [29, 145, 192],
  [34, 94, 168],
  [12, 44, 132],
];

const outFlowColors = [
  [255,255,178],
  [254,217,118],
  [254,178,76],
  [253,141,60],
  [252,78,42],
  [227,26,28],
  [177,0,38],
];

export default class ArcDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static get data() {
    return {
      type: 'text',
      url: 'data/arc-data.txt',
      worker: 'workers/arc-data-decoder.js'
    };
  }

  static get parameters() {
    return {
      lineWidth: {displayName: 'Width', type: 'number', value: 1, step: 1, min: 1}
    };
  }

  static get viewport() {
    return {
      mapStyle: MAPBOX_STYLES.LIGHT,
      longitude: -100,
      latitude: 40.7,
      zoom: 3,
      pitch: 30,
      bearing: 30
    };
  }

  static renderInfo(meta) {
    return (
      <div>
        <h3>United States County-to-county Migration 2009-2013</h3>
        <p>Arcs show migration flows from county to county</p>
        <div className="stat">Arcs<b>{ meta.count || 0 }</b></div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    const {data} = nextProps;
    if (data && data !== this.props.data) {
      this._computeQuantile(data);
    }
  }

  _computeQuantile(data) {
    const scale = scaleQuantile()
      .domain(data.map(d => d.weight))
      .range(inFlowColors.map((c, i) => i));
    this.setState({scale});
  }

  _initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    const {viewport, params, data} = this.props;
    const {scale} = this.state;

    if (!data) {
      return null;
    }

    const layer = new ArcLayer({
      id: 'arc',
      ...viewport,
      data: data,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getSourceColor: d => inFlowColors[scale(d.weight)],
      getTargetColor: d => outFlowColors[scale(d.weight)],
      strokeWidth: params.lineWidth.value,
      updateTriggers: {
        // instanceColors: {color: params.lineWidth.value}
      },
      isPickable: true
    });

    return (
      <DeckGLOverlay {...viewport} layers={ [layer] }
        onWebGLInitialized={this._initialize} />
    );
  }
}
