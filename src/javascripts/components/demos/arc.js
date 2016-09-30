import 'babel-polyfill';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DeckGLOverlay, ArcLayer} from 'deck.gl';
import {scaleQuantile} from 'd3-scale';

import {loadData, useParams, updateMap} from '../../actions/app-actions';

const arcColors = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [29, 145, 192],
  [34, 94, 168],
  [12, 44, 132],
];

class ArcDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.loadData(this, {
      type: 'text',
      url: 'static/arc-data.txt',
      worker: 'static/arc-data-decoder.js'
    });
    this.props.useParams({
      lineWidth: {displayName: 'Width', type: 'number', value: 1, step: 1, min: 1}
    });
  }

  componentWillReceiveProps(nextProps) {
    const {data} = nextProps;
    if (data && data !== this.props.data) {
      this.props.updateMap({longitude: -100, latitude: 40.7, zoom: 3});
      this._computeQuantile(data);
      console.log('Arc count: ' + data.length);
    }
  }

  _computeQuantile(data) {
    const scale = scaleQuantile()
      .domain(data.map(d => d.weight))
      .range(arcColors.map((c, i) => i));
    this.setState({scale});
  }

  _initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    const {viewport, params, data, owner} = this.props;
    const {scale} = this.state;

    if (!data || owner !== this.constructor.name) {
      return null;
    }

    const layer = new ArcLayer({
      id: 'arc',
      ...viewport,
      data: data,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getColor: d => arcColors[scale(d.weight)],
      strokeWidth: params.lineWidth.value,
      updateTriggers: {
        instanceColors: {color: params.lineWidth.value}
      },
      isPickable: true
    });

    return (
      <DeckGLOverlay {...viewport} layers={ [layer] }
        onWebGLInitialized={this._initialize} />
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.app,
    viewport: state.viewport,
  };
}

const mapDispatchToProps = {
  updateMap,
  loadData,
  useParams
};

export default connect(mapStateToProps, mapDispatchToProps)(ArcDemo);
