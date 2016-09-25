import 'babel-polyfill';
import React, {Component} from 'react';

export default class Header extends Component {

  render() {
    return (
      <header>
        <div className="container">
          <div className="links">
            <a className="github-button" href="https://github.com/uber/deck.gl/fork"
                data-icon="octicon-repo-forked" data-style="default"
                data-count-href="/uber/deck.gl/network"
                data-count-api="/repos/uber/deck.gl#forks_count"
                data-count-aria-label="# forks on GitHub"
                aria-label="Fork uber/deck.gl on GitHub">Fork</a>
          </div>
          <span id="logo">deck.gl</span>
        </div>
      </header>
    )
  }
}
