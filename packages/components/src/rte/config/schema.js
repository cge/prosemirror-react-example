/* eslint-disable */
import { Schema } from 'prosemirror-model';

const pDOM = ['p', 0],
  brDOM = ['br'],
  olDOM = ['ol', 0],
  ulDOM = ['ul', 0],
  liDOM = ['li', 0];

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  // :: NodeSpec The top level document node.
  doc: {
    content: 'block+'
  },

  // :: NodeSpec A plain paragraph textblock. Represented in the DOM
  // as a `<p>` element.
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return pDOM;
    }
  },

  // :: NodeSpec The text node.
  text: {
    group: 'inline'
  },

  // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return brDOM;
    }
  },

  // :: NodeSpec
  // An ordered list [node spec](#model.NodeSpec). Has a single
  // attribute, `order`, which determines the number at which the list
  // starts counting, and defaults to 1. Represented as an `<ol>`
  // element.
  ordered_list: {
    content: 'list_item+',
    group: 'block',
    attrs: { order: { default: 1 } },
    parseDOM: [
      {
        tag: 'ol',
        getAttrs(dom) {
          return {
            order: dom.hasAttribute('start') ? +dom.getAttribute('start') : 1
          };
        }
      }
    ],
    toDOM(node) {
      return node.attrs.order == 1
        ? olDOM
        : ['ol', { start: node.attrs.order }, 0];
    }
  },

  // :: NodeSpec
  // A bullet list node spec, represented in the DOM as `<ul>`.
  bullet_list: {
    content: 'list_item+',
    group: 'block',
    parseDOM: [{ tag: 'ul' }],
    toDOM() {
      return ulDOM;
    }
  },

  // :: NodeSpec
  // A list item (`<li>`) spec.
  list_item: {
    content: 'paragraph block*',
    parseDOM: [{ tag: 'li' }],
    toDOM() {
      return liDOM;
    },
    defining: true
  }
};

const strongDOM = ['strong', 0];

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
  // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
  // also match `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [
      { tag: 'strong' },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      { tag: 'b', getAttrs: node => node.style.fontWeight != 'normal' && null },
      {
        style: 'font-weight',
        getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
      }
    ],
    toDOM() {
      return strongDOM;
    }
  }
};

// :: Schema
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
export const schema = new Schema({ nodes, marks });
