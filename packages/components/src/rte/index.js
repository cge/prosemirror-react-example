import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { unstyle } from './config/unstyler';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
// import { exampleSetup } from "prosemirror-example-setup";
import { exampleSetup } from './config/example-setup';
import { schema } from './config/schema';
import { getToolbarItems, updateButtonState } from './config/toolbarutils';
import { fromHtml, toHtml } from './config/doc';
import Toolbar from './toolbar';
import './index.scss';
import './editor.css';

class Rte extends Component {
  state = {
    contentMinH: 160,
    contentH: 160,
    toolbarItems: [],
    editorView: null
  };

  updateToolbar = (toolbarItems, editorView) => {
    this.setState({
      toolbarItems: toolbarItems.map(segment => {
        return segment.map(group => {
          return group.map(button => {
            return updateButtonState(button, editorView, this.props.disabled);
          });
        });
      }),
      editorView
    });
  };

  getToolbarPlugin = toolbarItems => {
    let self = this;
    return new Plugin({
      view(editorView) {
        self.updateToolbar(toolbarItems, editorView);
        return {
          update: () => {
            self.updateToolbar(toolbarItems, editorView);
          }
        };
      }
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.view.updateState(
        EditorState.create({
          doc: fromHtml(schema, this.props.value),
          plugins: this.defaultPlugins.concat([
            this.getToolbarPlugin(this.state.toolbarItems)
          ])
        })
      );
    }
    if (prevProps.disabled !== this.props.disabled) {
      this.view.setProps({
        editable: () => {
          return !this.props.disabled;
        }
      });
    }
  }

  componentDidMount() {
    const self = this;
    // we might still extend the imported schema
    const customSchema = schema;
    const toolbarItems = getToolbarItems(customSchema);

    // setup key bindings via example setup utility
    this.defaultPlugins = exampleSetup({
      schema: customSchema,
      mapKeys: {
        'Mod-i': false,
        'Mod-I': false,
        'Mod-`': false,
        'Ctrl->': false,
        'Shift-Ctrl-\\': false,
        'Shift-Ctrl-1': false,
        'Shift-Ctrl-2': false,
        'Shift-Ctrl-3': false,
        'Shift-Ctrl-4': false,
        'Shift-Ctrl-5': false,
        'Mod-_': false
      },
      menuBar: false
    });

    // define state and add our toolbar plugin to others
    let state = EditorState.create({
      doc: fromHtml(customSchema, this.props.value),
      plugins: this.defaultPlugins.concat([this.getToolbarPlugin(toolbarItems)])
    });

    this.view = new EditorView(this.editor, {
      state,
      dispatchTransaction(transaction) {
        self.props.onChange(
          self.props.id,
          toHtml(customSchema, transaction.doc)
        );
        let newState = self.view.state.apply(transaction);
        self.view.updateState(newState);
      },
      transformPastedHTML(html) {
        return unstyle(html);
      },
      editable: () => {
        return !this.props.disabled;
      }
    });
    this.focusView();
  }

  focusView = () => {
    this.view.focus();
  };

  resizeMove = event => {
    event.preventDefault();
    const deltaY = this.startResizeY - event.clientY;
    this.setState(state => ({
      ...state,
      contentH: Math.max(state.contentMinH, this.startHeight - deltaY)
    }));
  };

  resizeUp = event => {
    event.preventDefault();
    document.removeEventListener('mousemove', this.resizeMove);
    document.removeEventListener('mouseup', this.resizeUp);
  };

  onResizeDown = event => {
    event.preventDefault();
    this.startResizeY = event.clientY;
    this.startHeight = this.content.clientHeight;
    document.addEventListener('mousemove', this.resizeMove);
    document.addEventListener('mouseup', this.resizeUp);
  };

  render() {
    return (
      <div className="rte">
        <Toolbar
          ref={node => {
            this.toolbar = node;
          }}
          toolbarItems={this.state.toolbarItems}
          editorView={this.state.editorView}
          disabled={this.props.disabled}
        />
        <div
          ref={node => {
            this.content = node;
          }}
          className="rte-content"
          style={{
            minHeight: this.state.contentMinH,
            height: this.state.contentH
          }}
          onClick={this.focusView}>
          <div
            ref={node => {
              this.editor = node;
            }}
            className="rte-editor"
          />
        </div>
        <div className="rte-footer">
          <div className="rte-footer-resizer" onMouseDown={this.onResizeDown}>
            ◢
          </div>
        </div>
      </div>
    );
  }
}

Rte.defaultProps = {
  value: '', // '<p>abc</p><p>def</p>'
  disabled: false
};

Rte.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool
};

export default Rte;
