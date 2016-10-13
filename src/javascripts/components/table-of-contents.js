import 'babel-polyfill';
import React, {Component} from 'react';
import {Link} from 'react-router'

import pages from '../constants/pages';

const groups = [];

pages.forEach(page => {
  const {groupName} = page;
  let group = groups[groups.length - 1];
  if (!group || group.name !== groupName) {
    group = {
      name: groupName,
      pages: []
    };
    groups.push(group);
  }
  group.pages.push(page);
});

export default class TableOfContents extends Component {

  _renderLink(page, i) {
    return (
      <li key={i}>
        <Link to={ `gallery/${page.path}` } activeClassName="active">
          { page.displayName }
        </Link>
      </li>
    );
  }

  render() {
    return (
      <div className="toc">
        { groups.map((group, i) => [
          (
            <h4 key={`group-header${i}`}>
              { group.name }
            </h4>
          ), (
            <ul key={`group-list${i}`}>
              { group.pages.map(this._renderLink) }
            </ul>
          )
        ]) }
      </div>
    )
  }
}
