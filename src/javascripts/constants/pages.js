function getGithubUrl(filename) {
  return `https://raw.githubusercontent.com/uber/deck.gl/dev/docs/${filename}`
}

export const examplePages = [
  {
    path: 'scatterplot-layer',
    groupName: 'Core layers',
    displayName: 'ScatterplotLayer',
    tabs: {
      demo: 'ScatterplotDemo',
      content: 'docs/scatterplot.md'
    }
  },
  {
    path: 'arc-layer',
    groupName: 'Core layers',
    displayName: 'ArcLayer',
    tabs: {
      demo: 'ArcDemo',
      content: 'docs/arc.md'
    }
  },
  {
    path: 'choropleth-layer',
    groupName: 'Core layers',
    displayName: 'ChoroplethLayer',
    tabs: {
      demo: 'ChoroplethDemo',
      content: 'docs/choropleth.md'
    }
  },
  {
    path: 'grid-layer',
    groupName: 'Core layers',
    displayName: 'GridLayer',
    tabs: {
      demo: 'GridDemo',
      content: 'docs/grid.md'
    }
  }
];

export const docPages = [
  {
    path: 'overview',
    groupName: 'Overview',
    displayName: 'Overview',
    tabs: {
      content: 'docs/overview.md'
    }
  },
  {
    path: 'react-integration',
    groupName: 'Overview',
    displayName: 'React Integration',
    tabs: {
      content: getGithubUrl('react-integration.md')
    }
  },
  {
    path: 'using-with-react',
    groupName: 'Overview',
    displayName: 'Using With React',
    tabs: {
      content: getGithubUrl('using-with-react.md')
    }
  },
  {
    path: 'coordinate-systems',
    groupName: 'Overview',
    displayName: 'Coordinate Systems',
    tabs: {
      content: getGithubUrl('viewport.md')
    }
  },
  {
    path: 'layer-class',
    groupName: 'Layers',
    displayName: 'Layer Class',
    tabs: {
      content: getGithubUrl('layer.md')
    }
  },
  {
    path: 'using-layers',
    groupName: 'Layers',
    displayName: 'Using Layers',
    tabs: {
      content: getGithubUrl('using-layers.md')
    }
  },
  {
    path: 'core-layers',
    groupName: 'Layers',
    displayName: 'Core Layers',
    tabs: {
      content: getGithubUrl('core-layers.md')
    }
  },
  {
    path: 'sample-layers',
    groupName: 'Layers',
    displayName: 'Sample Layers',
    tabs: {
      content: getGithubUrl('sample-layers.md')
    }
  },
  {
    path: 'custom-layers',
    groupName: 'Layers',
    displayName: 'Custom Layers',
    tabs: {
      content: getGithubUrl('custom-layers.md')
    }
  },
  {
    path: 'tips-and-tricks',
    groupName: 'Advanced Topics',
    displayName: 'Tips and Tricks',
    tabs: {
      content: getGithubUrl('tips-and-tricks.md')
    }
  },
  {
    path: 'performance',
    groupName: 'Advanced Topics',
    displayName: 'Performance',
    tabs: {
      content: getGithubUrl('performance.md')
    }
  }
];
