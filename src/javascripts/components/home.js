import 'babel-polyfill';
import React, {Component} from 'react';

import Header from './header';
import stylesheet from '../constants/styles';

const DEMO_TAB = 0;
const CONTENT_TAB = 1;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.onscroll = this._onScroll.bind(this);
    this._onScroll();
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  _onScroll() {
    const y = window.pageYOffset;
    this.setState({atTop: y < 168});
  }

  render() {
    const {atTop} = this.state;
    return (
      <div className={`home-wrapper ${atTop ? 'top' : ''}`}>
        <style>{ stylesheet }</style>
        <Header />

        <section id="banner">
          <div className="container">
            <h1>deck.gl</h1>
            <p>High performance map visualization framework for React</p>
            <button>Get started</button>
          </div>
        </section>

        <section id="features">
          <div className="container">
            <h2>Scientific-grade data visualization <br /> for building mapping tools</h2>
            <hr className="short" />
            <h3>GPU Accelerated</h3>
            <p>We leverage shaders and the GPU to ensure high frame rates with large data sets.</p>
            <h3>Easy API</h3>
            <p>We take the headaches out of making data layers and map layers play nice together. One simple API for all!</p>
            <h3>Geospatial Specific</h3>
            <p>We provide you with a core set of beautify, fast layers to quickly visualize your GIS data. If those aren’t enough, you can create custom layers!</p>
          </div>
        </section>

        <hr />

        <section id="highlights">
          <div className="container text-center">
            <h4>Performance highlights</h4>
            <hr className="short" />
            <div className="layout">
              <div className="col-1-3">
                <img src="./static/Icon-1.svg" />
                <h5>WebGL rendered</h5>
                <p>Tested, highly performant layers for basic data visualization use cases such as scatterplots, choropleths, and more, as well as support for custom WebGL layers.</p>
              </div>

              <div className="col-1-3">
                <img src="./static/Icon-2.svg" />
                <h5>React friendly</h5>
                <p>Supports efficient WebGL rendering in "data flow architecture" applications.</p>
              </div>

              <div className="col-1-3">
                <img src="./static/Icon-3.svg" />
                <h5>Automatic WebGL Buffer Management</h5>
                <p>Special focus on buffer management, allowing both automatic buffer updates but also full application control of buffer allocation and management.</p>
              </div>
            </div>
          </div>
        </section>

        <hr />

        <section id="featured">
          <div className="container text-center">
            <h4>Featured</h4>
            <hr className="short" />
          </div>
        </section>

        <hr />

        <section id="concept">
          <div className="container text-center">
            <h4>How it works</h4>
            <hr className="short" />
            <div className="canvas position--relative">
              <img src="./static/layers.png" />
              <div className="position--absolute left-top">
                <h5><i>01</i>deck.gl</h5>
                <p>Deck provides overlays that plug directly into react-map-gl’s overlay model, enabling high-performance map visualizations</p>
              </div>
              <div className="position--absolute right-center">
                <h5><i>02</i>react-map-gl</h5>
                <p>A webGL based vector tile mapping library. Provides a React friendly API wrapper around Mapbox GL JS.</p>
              </div>
              <div className="position--absolute left-bottom">
                <h5><i>03</i>luma.gl</h5>
                <p>Our efficient and easy-to-use WebGL framework enabling high-performance browser-based data visualizations.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="footer">
          <div className="container text-center">
            <div className="logo">deck.gl</div>
            <hr className="short" />
            <h4>Made by</h4>
            <img src="static/uber-logo.png" />
          </div>
        </section>

      </div>
    )
  }
}
