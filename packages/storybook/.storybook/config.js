import { addParameters, configure } from '@storybook/react';
import { create } from '@storybook/theming';
import './styles.css';

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'pm-comps-lib',
      brandUrl: '/'
      // To control appearance:
      // brandImage: 'http://url.of/some.svg',
    }),
    isFullscreen: false,
    panelPosition: 'right',
    isToolshown: true
  }
});

const comps = require.context('pm-comps-lib/src', true, /.stories.js$/);

configure(() => {
  comps.keys().forEach(filename => comps(filename));
}, module);
