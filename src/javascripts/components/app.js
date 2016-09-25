import 'babel-polyfill';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import MapGL from 'react-map-gl';

import Header from './header';
import TableOfContents from './table-of-contents';
import MarkdownPage from './markdown-page';
import GenericInput from './input';
import {updateMap, loadStaticContent, updateParam} from '../actions/app-actions';
import {MAPBOX_ACCESS_TOKEN, MAPBOX_STYLES} from '../constants/defaults';

const DEMO_TAB = 0;
const SOURCE_TAB = 1;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: {},
      tab: -1
    };
  }

  componentDidMount() {
    window.onresize = this._resizeMap.bind(this);
    this._resizeMap();
    this._updateRoute(this.props.routes);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.routes !== nextProps.routes) {
      this._updateRoute(nextProps.routes);
    }
  }

  _updateRoute(routes) {
    const route = routes.slice(-1)[0];
    const page = route.page || {};

    this.setState({
      page,
      tab: page.demo ? DEMO_TAB : SOURCE_TAB
    });
    this.props.loadStaticContent(page.source);
  }

  _resizeMap() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.props.updateMap({
      width: w <= 768 ? w : w * 0.8,
      height: h - 64
    });
  }

  _renderMarkdown() {
    const {contents} = this.props;
    const {page: {source}} = this.state;
    const content = contents[source];

    return content && <MarkdownPage content={content} />;
  }

  _renderMap() {
    const {children, viewport} = this.props;
    return (
      <MapGL
        mapStyle={MAPBOX_STYLES}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        { ...viewport }
        onChangeViewport={ this.props.updateMap }>

        { this.props.children }

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
    const {tab, page} = this.state;
    return (
      <div>
        <div className={`tab ${tab === DEMO_TAB ? 'active' : ''}`}>
          { this._renderMap() }
          { this._renderOptions() }
        </div>
        <div className={`tab ${tab === SOURCE_TAB ? 'active' : ''}`}>
          { this._renderMarkdown() }
        </div>
      </div>
    );
  }

  _renderTabs() {
    const {tab, page} = this.state;
    return page.demo && (
      <ul className="tabs">
        <li className={`${tab === DEMO_TAB ? 'active' : ''}`}>
          <button onClick={ () => this.setState({tab: DEMO_TAB}) }>Demo</button>
        </li>
        <li className={`${tab === DEMO_TAB ? 'active' : ''}`}>
          <button onClick={ () => this.setState({tab: SOURCE_TAB}) }>Code</button>
        </li>
      </ul>
    );
  }

  render() {
    const {page} = this.state;
    return (
      <div className="flexbox--column fullheight">
        <Header className="flexbox-item" />
        <div className="container flexbox-item--fill">
          <div className="flexbox--row">
            <div className="flexbox-item">
              <TableOfContents />
            </div>
            <div className={`flexbox-item--fill ${page.demo ? 'demo' : '' }`}>
              { this._renderTabs() }
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
    viewport: state.viewport,
    contents: state.contents
  };
}

const mapDispatchToProps = {
  updateMap,
  loadStaticContent,
  updateParam
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
