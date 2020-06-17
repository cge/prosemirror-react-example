import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import Rte from '.';

storiesOf('Rte', module)
  .addDecorator(withKnobs)

  .add(
    'with value',
    () => (
      <Rte
        id="123"
        value={text(
          'value',
          '<p>Editing knob value <strong>re-initialises styling</strong>.</p><p>Normal use is to edit in component only.</p>'
        )}
        disabled={boolean('disabled', false)}
        onChange={() => {}}
      />
    ),
    {
      knobs: {
        escapeHTML: false
      }
    }
  );
