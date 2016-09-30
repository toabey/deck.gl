import 'babel-polyfill';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import MapGL from 'react-map-gl';

import Header from './header';
import TableOfContents from './table-of-contents';
import GenericInput from './input';
import {updateMap, updateParam} from '../actions/app-actions';
import {MAPBOX_ACCESS_TOKEN, MAPBOX_STYLES} from '../constants/defaults';

const DEMO_TAB = 0;
const CONTENT_TAB = 1;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: {},
      tab: DEMO_TAB
    };
  }

  componentDidMount() {
    window.onresize = this._resizeMap.bind(this);
    this._resizeMap();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.routes !== nextProps.routes) {
      this.setState({tab: DEMO_TAB});
    }
  }

  _resizeMap() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.props.updateMap({
      width: w <= 768 ? w : w * 0.8,
      height: h - 64
    });
  }

  _renderMap() {
    const {children, viewport} = this.props;
    return (
      <MapGL
        mapStyle={MAPBOX_STYLES}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        perspectiveEnabled={true}
        { ...viewport }
        onChangeViewport={ this.props.updateMap }>

        { this.props.demo }

      </MapGL>
    )
  }

  _renderOptions() {
    const {params} = this.props;

    return (
      <div className="options-panel">
        {
          Object.keys(params).map((name, i) => (
            <GenericInput key={i} name={name} {...params[name]}
              onChange={this.props.updateParam} />
          ))
        }
      </div>
    );
  }

  _renderTabContent() {
    const {tab} = this.state;
    const {content, demo} = this.props;

    if (!demo) {
      return content;
    }

    return (
      <div>
        <div className={`tab ${tab === DEMO_TAB ? 'active' : ''}`}>
          { this._renderMap() }
          { this._renderOptions() }
        </div>
        <div className={`tab ${tab === CONTENT_TAB ? 'active' : ''}`}>
          { content }
        </div>
      </div>
    );
  }

  _renderTabs() {
    const {tab, page} = this.state;
    return (
      <ul className="tabs">
        <li className={`${tab === DEMO_TAB ? 'active' : ''}`}>
          <button onClick={ () => this.setState({tab: DEMO_TAB}) }>Demo</button>
        </li>
        <li className={`${tab === CONTENT_TAB ? 'active' : ''}`}>
          <button onClick={ () => this.setState({tab: CONTENT_TAB}) }>Code</button>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container app-wrapper">
          <div className="flexbox--row">
            <div className="flexbox-item">
              <TableOfContents />
            </div>
            <div className={`flexbox-item--fill`}>
              { this.props.demo && this._renderTabs() }
              { this._renderTabContent() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    params: state.app.params,
    viewport: state.viewport
  };
}

const mapDispatchToProps = {
  updateMap,
  updateParam
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
