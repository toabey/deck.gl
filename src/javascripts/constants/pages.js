import React from 'react';

import ScatterplotDemo from '../components/demos/scatterplot';
import MarkdownPage from '../components/markdown-page';

function makeFromMarkdown(url) {
  return () => <MarkdownPage url={url} />;
}

export default [
  {
    path: 'overview',
    displayName: 'Overview',
    components: {
      content: makeFromMarkdown('overview.md')
    }
  },
  {
    path: 'scatterplot-layer',
    displayName: 'ScatterplotLayer',
    components: {
      demo: ScatterplotDemo,
      content: makeFromMarkdown('scatterplot.md')
    }
  }
];
