/**
 * Luna Theme UndoToolbar - Custom styled undo/redo with Volto functionality
 * @module components/UndoToolbar/UndoToolbar
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { defineMessages, useIntl } from 'react-intl';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import useUndoManager from '@plone/volto/helpers/UndoManager/useUndoManager';
import config from '@plone/volto/registry';

// Luna Theme custom icons
import undoSVG from 'luna-theme/icons/undo.svg';
import redoSVG from 'luna-theme/icons/redo.svg';

const messages = defineMessages({
  undo: {
    id: 'Undo',
    defaultMessage: 'Undo',
  },
  redo: {
    id: 'Redo',
    defaultMessage: 'Redo',
  },
});

const UndoToolbar = ({ state, onUndoRedo, maxUndoLevels, enableHotKeys }) => {
  const intl = useIntl();
  const undoLevels = maxUndoLevels ?? config.settings.maxUndoLevels;
  const { doUndo, doRedo, canUndo, canRedo } = useUndoManager(
    state,
    onUndoRedo,
    {
      maxUndoLevels: undoLevels,
    },
  );

  const toolbarCenter = document.querySelector('.luna-toolbar-center');

  if (!toolbarCenter) {
    return null;
  }

  return createPortal(
    <>
      <button
        type="button"
        className="luna-toolbar-button"
        onClick={() => doUndo()}
        aria-label={intl.formatMessage(messages.undo)}
        disabled={!canUndo}
        tabIndex={0}
      >
        <Icon
          name={undoSVG}
          size="24px"
          title={intl.formatMessage(messages.undo)}
        />
      </button>
      <button
        type="button"
        className="luna-toolbar-button"
        onClick={() => doRedo()}
        aria-label={intl.formatMessage(messages.redo)}
        disabled={!canRedo}
        tabIndex={0}
      >
        <Icon
          name={redoSVG}
          size="24px"
          title={intl.formatMessage(messages.redo)}
        />
      </button>
    </>,
    toolbarCenter,
  );
};

export default UndoToolbar;
