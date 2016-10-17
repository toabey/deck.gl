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
    path: 'using-layers',
    groupName: 'Layers',
    displayName: 'Using Layers',
    tabs: {
      content: getGithubUrl('using-layers.md')
    }
  },
  {
    path: 'layer-class',
    groupName: 'Layers',
    displayName: 'The Layer Class',
    tabs: {
      content: getGithubUrl('layer.md')
    }
  },
  {
    path: 'coordinate-systems',
    groupName: 'Layers',
    displayName: 'Coordinate Systems',
    tabs: {
      content: getGithubUrl('coordinate-systems.md')
    }
  },
  {
    path: 'custom-layers',
    groupName: 'Creating Custom Layers',
    displayName: 'Custom Layers',
    tabs: {
      content: getGithubUrl('custom-layers.md')
    }
  },
  {
    path: 'layer-lifecycle',
    groupName: 'Creating Custom Layers',
    displayName: 'Layer Lifecycle',
    tabs: {
      content: getGithubUrl('layer-lifecycle.md')
    }
  },
  {
    path: 'attribute-management',
    groupName: 'Creating Custom Layers',
    displayName: 'Attribute Management',
    tabs: {
      content: getGithubUrl('attribute-management.md')
    }
  },
  {
    path: 'writing-shaders',
    groupName: 'Creating Custom Layers',
    displayName: 'Writing Shaders',
    tabs: {
      content: getGithubUrl('writing-shaders.md')
    }
  },
  {
    path: 'using-with-react',
    groupName: 'Usage',
    displayName: 'Using With React',
    tabs: {
      content: getGithubUrl('using-with-react.md')
    }
  },
  {
    path: 'using-with-mapbox-gl',
    groupName: 'Usage',
    displayName: 'Using With MapboxGL',
    tabs: {
      content: getGithubUrl('using-with-mapbox-gl.md')
    }
  },
  {
    path: 'using-standalone',
    groupName: 'Usage',
    displayName: 'Using Standalone',
    tabs: {
      content: getGithubUrl('using-standalone.md')
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

export const layerDocPages = [
  {
    path: 'arc-layer',
    groupName: 'Core Layers',
    displayName: 'ArcLayer',
    tabs: {
      content: getGithubUrl('layers/arc-layer.md')
    }
  },
  {
    path: 'choropleth-layer',
    groupName: 'Core Layers',
    displayName: 'ChoroplethLayer',
    tabs: {
      content: getGithubUrl('layers/choropleth-layer.md')
    }
  },
  {
    path: 'grid-layer',
    groupName: 'Core Layers',
    displayName: 'GridLayer',
    tabs: {
      content: getGithubUrl('layers/grid-layer.md')
    }
  },
  {
    path: 'line-layer',
    groupName: 'Core Layers',
    displayName: 'LineLayer',
    tabs: {
      content: getGithubUrl('layers/line-layer.md')
    }
  },
  {
    path: 'scatterplot-layer',
    groupName: 'Core Layers',
    displayName: 'ScatterplotLayer',
    tabs: {
      content: getGithubUrl('layers/scatterplot-layer.md')
    }
  },
  {
    path: '64bit-layers',
    groupName: '64bit Layers',
    displayName: 'Overview',
    tabs: {
      content: getGithubUrl('layers/64bit-layers.md')
    }
  },
  {
    path: 'sample-layers',
    groupName: 'Sample Layers',
    displayName: 'Overview',
    tabs: {
      content: getGithubUrl('layers/sample-layers.md')
    }
  }
];

