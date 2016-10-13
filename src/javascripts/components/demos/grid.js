import 'babel-polyfill';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DeckGLOverlay} from 'deck.gl';
import {GridLayer} from '../../../../../deck.gl/src';

import {MAPBOX_STYLES} from '../../constants/defaults';
import {loadData, useParams, updateMap} from '../../actions/app-actions';

class GridDemo extends Component {

  componentDidMount() {
    this.props.loadData(this, {
      type: 'text',
      url: 'static/grid-data.txt',
      worker: 'static/grid-data-decoder.js'
    });
    this.props.useParams({
      cellSize: {displayName: 'Cell Size', type: 'number', value: 10, step: 5, min: 10}
    });
    this.props.updateMap({
      mapStyle: MAPBOX_STYLES.DARK,
      longitude: -122.4, latitude: 37.8,
      zoom: 11, pitch: 0, bearing: 0
    });
  }

  componentWillReceiveProps(nextProps) {
    const {data} = nextProps;
    if (data && data !== this.props.data) {
      console.log('Sample count: ' + data.length);
    }
  }

  render() {
    const {viewport, params, data, owner} = this.props;

    if (!data || owner !== this.constructor.name) {
      return null;
    }

    const layer = new GridLayer({
      id: 'grid',
      ...viewport,
      data: data,
      unitWidth: params.cellSize.value,
      unitHeight: params.cellSize.value,
      isPickable: false
    });

    return (
      <DeckGLOverlay {...viewport} layers={ [layer] } />
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

export default connect(mapStateToProps, mapDispatchToProps)(GridDemo);
