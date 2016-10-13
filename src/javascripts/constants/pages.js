import React from 'react';

import ScatterplotDemo from '../components/demos/scatterplot';
import ArcDemo from '../components/demos/arc';
import GridDemo from '../components/demos/grid';
import ChoroplethDemo from '../components/demos/choropleth';
import MarkdownPage from '../components/markdown-page';

function makeFromMarkdown(url) {
  return () => <MarkdownPage url={url} />;
}

export default [
  {
    path: 'overview',
    displayName: 'Overview',
    components: {
      content: makeFromMarkdown('static/overview.md')
    }
  },
  {
    path: 'scatterplot-layer',
    displayName: 'ScatterplotLayer',
    components: {
      demo: ScatterplotDemo,
      content: makeFromMarkdown('static/scatterplot.md')
    }
  },
  {
    path: 'arc-layer',
    displayName: 'ArcLayer',
    components: {
      demo: ArcDemo,
      content: makeFromMarkdown('static/scatterplot.md')
    }
  },
  {
    path: 'choropleth-layer',
    displayName: 'ChoroplethLayer',
    components: {
      demo: ChoroplethDemo,
      content: makeFromMarkdown('static/scatterplot.md')
    }
  },
  {
    path: 'grid-layer',
    displayName: 'GridLayer',
    components: {
      demo: GridDemo,
      content: makeFromMarkdown('static/scatterplot.md')
    }
  },
  {
    path: 'performance',
    displayName: 'Performance',
    components: {
      content: makeFromMarkdown('https://raw.githubusercontent.com/uber/deck.gl/dev/docs/performance.md')
    }
  }
];
