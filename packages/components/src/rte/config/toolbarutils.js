import { toggleMark, lift } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';
import { wrapInList } from 'prosemirror-schema-list';

// toolbar button definitions: segment > button group > button def
export const getToolbarItems = schema => {
  return [
    [
      [
        { icon: 'undo', command: undo },
        { icon: 'redo', command: redo }
      ]
    ],
    [
      [
        {
          icon: 'bold',
          command: toggleMark(schema.marks.strong)
        }
      ]
    ],
    [
      [
        {
          icon: 'orderedList',
          command: wrapInList(schema.nodes.ordered_list)
        },
        {
          icon: 'unorderedList',
          command: wrapInList(schema.nodes.bullet_list)
        }
      ],
      [{ icon: 'outdent', command: lift }]
    ]
  ];
};

export const updateButtonState = (button, editorView, disabled = false) => {
  const { state } = editorView;
  const { selection } = state;
  switch (button.icon) {
    case 'bold':
      // indicate whether strong mark is present in selection
      const low = Math.min(selection.head, selection.anchor);
      const high = Math.max(selection.head, selection.anchor);
      button.on = state.doc.rangeHasMark(low, high, state.schema.marks.strong);
      // only active when selection is not empty
      button.active = !disabled && low !== high;
      break;
    case 'undo':
    case 'redo':
    case 'orderedList':
    case 'unorderedList':
    case 'outdent':
      // active is set based on command status
      button.active =
        !disabled &&
        button.command &&
        button.command(editorView.state, null, editorView);
      button.on = false;
      break;
    default:
      button.active = !disabled && true;
  }
  return button;
};
