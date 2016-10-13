import React from 'react';

import ScatterplotDemo from '../components/demos/scatterplot';
import ArcDemo from '../components/demos/arc';
import GridDemo from '../components/demos/grid';
import ChoroplethDemo from '../components/demos/choropleth';
import MarkdownPage from '../components/markdown-page';

function makeFromMarkdown(url) {
  return () => <MarkdownPage url={url} />;
}

function getGithubUrl(filename) {
  return `https://raw.githubusercontent.com/uber/deck.gl/dev/docs/${filename}`
}

export const examplePages = [
  {
    path: 'scatterplot-layer',
    groupName: 'Core layers',
    displayName: 'ScatterplotLayer',
    components: {
      demo: ScatterplotDemo,
      content: makeFromMarkdown('static/scatterplot.md')
    }
  },
  {
    path: 'arc-layer',
    groupName: 'Core layers',
    displayName: 'ArcLayer',
    components: {
      demo: ArcDemo,
      content: makeFromMarkdown('static/scatterplot.md')
    }
  },
  {
    path: 'choropleth-layer',
    groupName: 'Core layers',
    displayName: 'ChoroplethLayer',
    components: {
      demo: ChoroplethDemo,
      content: makeFromMarkdown(getGithubUrl('choropleth.md'))
    }
  },
  {
    path: 'grid-layer',
    groupName: 'Core layers',
    displayName: 'GridLayer',
    components: {
      demo: GridDemo,
      content: makeFromMarkdown('static/scatterplot.md')
    }
  }
];

export const docPages = [
  {
    path: 'overview',
    groupName: 'Overview',
    displayName: 'Overview',
    components: {
      content: makeFromMarkdown('static/overview.md')
    }
  },
  {
    path: 'react-integration',
    groupName: 'Overview',
    displayName: 'React Integration',
    components: {
      content: makeFromMarkdown(getGithubUrl('react-integration.md'))
    }
  },
  {
    path: 'using-with-react',
    groupName: 'Overview',
    displayName: 'Using With React',
    components: {
      content: makeFromMarkdown(getGithubUrl('using-with-react.md'))
    }
  },
  {
    path: 'coordinate-systems',
    groupName: 'Overview',
    displayName: 'Coordinate Systems',
    components: {
      content: makeFromMarkdown(getGithubUrl('viewport.md'))
    }
  },
  {
    path: 'layer-class',
    groupName: 'Layers',
    displayName: 'Layer Class',
    components: {
      content: makeFromMarkdown(getGithubUrl('layer.md'))
    }
  },
  {
    path: 'using-layers',
    groupName: 'Layers',
    displayName: 'Using Layers',
    components: {
      content: makeFromMarkdown(getGithubUrl('using-layers.md'))
    }
  },
  {
    path: 'core-layers',
    groupName: 'Layers',
    displayName: 'Core Layers',
    components: {
      content: makeFromMarkdown(getGithubUrl('core-layers.md'))
    }
  },
  {
    path: 'sample-layers',
    groupName: 'Layers',
    displayName: 'Sample Layers',
    components: {
      content: makeFromMarkdown(getGithubUrl('sample-layers.md'))
    }
  },
  {
    path: 'custom-layers',
    groupName: 'Layers',
    displayName: 'Custom Layers',
    components: {
      content: makeFromMarkdown(getGithubUrl('custom-layers.md'))
    }
  },
  {
    path: 'tips-and-tricks',
    groupName: 'Advanced Topics',
    displayName: 'Tips and Tricks',
    components: {
      content: makeFromMarkdown(getGithubUrl('tips-and-tricks.md'))
    }
  },
  {
    path: 'performance',
    groupName: 'Advanced Topics',
    displayName: 'Performance',
    components: {
      content: makeFromMarkdown(getGithubUrl('performance.md'))
    }
  }
];
