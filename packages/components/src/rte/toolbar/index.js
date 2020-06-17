import React, { Component, Fragment } from 'react';
import {
  UndoOutlined,
  RedoOutlined,
  BoldOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import clsx from 'clsx';

const getIcon = icon => {
  switch (icon) {
    case 'undo':
      return <UndoOutlined />;
    case 'redo':
      return <RedoOutlined />;
    case 'bold':
      return <BoldOutlined />;
    case 'orderedList':
      return <OrderedListOutlined />;
    case 'unorderedList':
      return <UnorderedListOutlined />;
    case 'outdent':
      return <MenuFoldOutlined />;
    default:
      return null;
  }
};

class Toolbar extends Component {
  onClick = (e, button) => {
    const { editorView } = this.props;
    e.preventDefault();
    editorView.focus();
    if (button.command) {
      button.command(editorView.state, editorView.dispatch, editorView);
    }
  };

  getButtonGroup = buttons => {
    const { disabled } = this.props;
    return buttons.map((button, i) => {
      return (
        <div
          key={i}
          className={clsx('rte-toolbar-button', {
            'rte-toolbar-button-on': button.on,
            'rte-toolbar-button-disabled': disabled
          })}
          onClick={disabled ? null : e => this.onClick(e, button)}>
          <div
            className={clsx('rte-toolbar-button-icon')}
            style={{
              fontSize: 16,
              opacity: button.active || button.on ? 1 : 0.3
            }}>
            {getIcon(button.icon)}
          </div>
        </div>
      );
    });
  };

  getToolbarSegment = (buttonGroups, key) => {
    return (
      <div key={key} className={clsx('rte-toolbar-segment')}>
        {buttonGroups.map((buttons, i) => {
          return (
            <Fragment key={i}>
              {this.getButtonGroup(buttons)}
              {i < buttonGroups.length - 1 && (
                <div className={clsx('rte-toolbar-separator')} />
              )}
            </Fragment>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div className={clsx('rte-toolbar')}>
        <div className={clsx('rte-toolbar-segment-container')}>
          {this.props.toolbarItems.map((d, i) => {
            return this.getToolbarSegment(d, i);
          })}
        </div>
      </div>
    );
  }
}

export default Toolbar;
