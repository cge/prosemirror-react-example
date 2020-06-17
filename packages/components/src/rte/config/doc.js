import { DOMParser, DOMSerializer } from 'prosemirror-model';

export const fromHtml = (schema, html) => {
  let node = document.createElement('div');
  node.innerHTML = html;
  return DOMParser.fromSchema(schema).parse(node);
};

export const toHtml = (schema, doc) => {
  let fragment = DOMSerializer.fromSchema(schema).serializeFragment(
    doc.content
  );
  let tmp = document.createElement('div');
  tmp.appendChild(fragment);
  return tmp.innerHTML;
};
