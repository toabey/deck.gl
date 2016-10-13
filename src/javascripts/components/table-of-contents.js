import 'babel-polyfill';
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router'

export default class TableOfContents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: this._getGroups(props.pages)
    };
  }

  componentWillReceiveProps(nextProps) {
    const {pages} = nextProps;
    if (this.props.pages !== pages) {
      this.setState({groups: this._getGroups(pages)});
    }
  }

  _getGroups(pages) {
    if (!pages) {
      return [];
    }

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

    return groups;
  }

  _renderLink(page, i) {
    return (
      <li key={i}>
        <Link to={ `${this.props.parentRoute}/${page.path}` } activeClassName="active">
          { page.displayName }
        </Link>
      </li>
    );
  }

  _renderGroup(group, i) {
    return [
      (
        <h4 key={`group-header${i}`}>
          { group.name }
        </h4>
      ), (
        <ul key={`group-list${i}`}>
          { group.pages.map(this._renderLink.bind(this)) }
        </ul>
      )
    ];
  }

  render() {
    const {groups} = this.state;

    return (
      <div className="toc">
        { groups.map(this._renderGroup.bind(this)) }
      </div>
    )
  }
}

TableOfContents.propTypes = {
  parentRoute: PropTypes.string.isRequired,
  pages: PropTypes.array.isRequired
};
