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
