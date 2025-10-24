/**
 * Toolbar component - Luna Theme Horizontal Design
 * @module components/manage/Toolbar/Toolbar
 */

import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { compose } from 'redux';
import doesNodeContainClick from 'semantic-ui-react/dist/commonjs/lib/doesNodeContainClick';
import { withCookies } from 'react-cookie';
import filter from 'lodash/filter';
import find from 'lodash/find';
import cx from 'classnames';
import config from '@plone/volto/registry';

import More from '@plone/volto/components/manage/Toolbar/More';
import PersonalTools from '@plone/volto/components/manage/Toolbar/PersonalTools';
import Types from '@plone/volto/components/manage/Toolbar/Types';
import PersonalInformation from '@plone/volto/components/manage/Preferences/PersonalInformation';
import PersonalPreferences from '@plone/volto/components/manage/Preferences/PersonalPreferences';
import StandardWrapper from '@plone/volto/components/manage/Toolbar/StandardWrapper';
import { getTypes } from '@plone/volto/actions/types/types';
import { listActions } from '@plone/volto/actions/actions/actions';
import { setExpandedToolbar } from '@plone/volto/actions/toolbar/toolbar';
import { unlockContent } from '@plone/volto/actions/content/content';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import BodyClass from '@plone/volto/helpers/BodyClass/BodyClass';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { getCookieOptions } from '@plone/volto/helpers/Cookies/cookies';
import { hasApiExpander } from '@plone/volto/helpers/Utils/Utils';
import { Pluggable } from '@plone/volto/components/manage/Pluggable';
import Logo from 'luna-theme/components/Logo';

// Luna Theme custom icons
import editSVG from 'luna-theme/icons/edit.svg';
import folderSVG from 'luna-theme/icons/folder.svg';
import addSVG from 'luna-theme/icons/add-document.svg';
import moreSVG from 'luna-theme/icons/more.svg';
// import undoSVG from 'luna-theme/icons/undo.svg';
// import redoSVG from 'luna-theme/icons/redo.svg';
import userSVG from 'luna-theme/icons/user.svg';
import unlockSVG from '@plone/volto/icons/unlock.svg';
import backSVG from '@plone/volto/icons/back.svg';

const messages = defineMessages({
  edit: {
    id: 'Edit',
    defaultMessage: 'Edit',
  },
  contents: {
    id: 'Contents',
    defaultMessage: 'Contents',
  },
  add: {
    id: 'Add',
    defaultMessage: 'Add',
  },
  more: {
    id: 'More',
    defaultMessage: 'More',
  },
  undo: {
    id: 'Undo',
    defaultMessage: 'Undo',
  },
  redo: {
    id: 'Redo',
    defaultMessage: 'Redo',
  },
  themeToggle: {
    id: 'Toggle theme',
    defaultMessage: 'Toggle theme',
  },
  personalTools: {
    id: 'Personal tools',
    defaultMessage: 'Personal tools',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  unlock: {
    id: 'Unlock',
    defaultMessage: 'Unlock',
  },
});

let toolbarComponents = {
  personalTools: { component: PersonalTools, wrapper: null },
  more: { component: More, wrapper: null },
  types: { component: Types, wrapper: null, contentAsProps: true },
  profile: {
    component: PersonalInformation,
    wrapper: StandardWrapper,
    wrapperTitle: messages.personalInformation,
    hideToolbarBody: true,
  },
  preferences: {
    component: PersonalPreferences,
    wrapper: StandardWrapper,
    wrapperTitle: messages.personalPreferences,
    hideToolbarBody: true,
  },
};

/**
 * Luna Theme Toolbar - Horizontal Layout
 * @class Toolbar
 * @extends Component
 */
class Toolbar extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      object: PropTypes.arrayOf(PropTypes.object),
      object_buttons: PropTypes.arrayOf(PropTypes.object),
      user: PropTypes.arrayOf(PropTypes.object),
    }),
    token: PropTypes.string,
    userId: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    content: PropTypes.shape({
      '@type': PropTypes.string,
      is_folderish: PropTypes.bool,
      review_state: PropTypes.string,
    }),
    getTypes: PropTypes.func.isRequired,
    types: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        addable: PropTypes.bool,
        title: PropTypes.string,
      }),
    ),
    listActions: PropTypes.func.isRequired,
    unlockContent: PropTypes.func,
    unlockRequest: PropTypes.objectOf(PropTypes.any),
    inner: PropTypes.element,
    hideDefaultViewButtons: PropTypes.bool,
  };

  static defaultProps = {
    actions: null,
    token: null,
    userId: null,
    content: null,
    hideDefaultViewButtons: false,
    types: [],
  };

  toolbarRef = React.createRef();
  toolbarWindow = React.createRef();
  buttonRef = React.createRef();

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      expanded: true, // Always expanded for horizontal layout
      showMenu: false,
      menuStyle: {},
      menuComponents: [],
      loadedComponents: [],
      hideToolbarBody: false,
      isDarkTheme: false, // Track theme state
    };
  }

  componentDidMount() {
    if (!hasApiExpander('actions', getBaseUrl(this.props.pathname))) {
      this.props.listActions(getBaseUrl(this.props.pathname));
    }
    if (!hasApiExpander('types', getBaseUrl(this.props.pathname))) {
      this.props.getTypes(getBaseUrl(this.props.pathname));
    }
    toolbarComponents = {
      ...(config.settings
        ? config.settings.additionalToolbarComponents || {}
        : {}),
      ...toolbarComponents,
    };
    this.props.setExpandedToolbar(this.state.expanded);
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      if (!hasApiExpander('actions', getBaseUrl(nextProps.pathname))) {
        this.props.listActions(getBaseUrl(nextProps.pathname));
      }
      if (!hasApiExpander('types', getBaseUrl(nextProps.pathname))) {
        this.props.getTypes(getBaseUrl(nextProps.pathname));
      }
    }

    if (this.props.unlockRequest.loading && nextProps.unlockRequest.loaded) {
      this.props.listActions(getBaseUrl(nextProps.pathname));
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  closeMenu = () => {
    this.setState(() => ({ showMenu: false, loadedComponents: [] }));
  };

  loadComponent = (type) => {
    const { loadedComponents } = this.state;
    if (!this.state.loadedComponents.includes(type)) {
      this.setState({
        loadedComponents: [...loadedComponents, type],
        hideToolbarBody: toolbarComponents[type].hideToolbarBody || false,
      });
    }
  };

  unloadComponent = () => {
    this.setState((state) => ({
      loadedComponents: state.loadedComponents.slice(0, -1),
      hideToolbarBody:
        toolbarComponents[
          state.loadedComponents[state.loadedComponents.length - 2]
        ]?.hideToolbarBody || false,
    }));
  };

  toggleButtonPressed = (e) => {
    const target = e.target;
    const button =
      target.tagName === 'BUTTON'
        ? target
        : this.findAncestor(e.target, 'button');
    this.buttonRef.current = button;
  };

  toggleMenu = (e, selector) => {
    if (this.state.showMenu) {
      this.closeMenu();
      return;
    }
    this.setState((state) => ({
      showMenu: !state.showMenu,
      menuStyle: { top: '100%', left: 0, right: 0 },
    }));
    this.toggleButtonPressed(e);
    this.loadComponent(selector);
  };

  toggleTheme = () => {
    this.setState((state) => ({ isDarkTheme: !state.isDarkTheme }));
    // Theme toggle logic will be implemented later
  };

  /* Commented out for later decision
  handleUndo = () => {
    // Undo logic will be implemented later
    console.log('Undo clicked');
  };

  handleRedo = () => {
    // Redo logic will be implemented later
    console.log('Redo clicked');
  };
  */

  findAncestor = (el, sel) => {
    while (
      (el = el.parentElement) &&
      !(el.matches || el.matchesSelector).call(el, sel)
    );
    return el;
  };

  handleClickOutside = (e) => {
    const target = e.target;
    if (this.pusher && doesNodeContainClick(this.pusher, e)) return;

    const button =
      doesNodeContainClick(this.toolbarRef.current, e) &&
      this.findAncestor(target, 'button');
    if (button && button === this.buttonRef.current) return;

    this.closeMenu();
  };

  unlock = (e) => {
    this.props.unlockContent(getBaseUrl(this.props.pathname), true);
  };

  render() {
    const path = getBaseUrl(this.props.pathname);
    const lock = this.props.content?.lock;
    const unlockAction =
      lock?.locked && lock?.stealable && lock?.creator !== this.props.userId;
    const editAction =
      !unlockAction && find(this.props.actions.object, { id: 'edit' });
    const folderContentsAction = find(this.props.actions.object, {
      id: 'folderContents',
    });

    return (
      this.props.token && (
        <>
          <BodyClass className={cx('has-toolbar-luna', { 'theme-dark': this.state.isDarkTheme })} />
          <div className="luna-toolbar" ref={this.toolbarRef}>
            {/* Left Section: Logo + User Button */}
            <div className="luna-toolbar-left">
              <Logo
                pathname={this.props.pathname}
                onToggleTheme={this.toggleTheme}
                isDarkTheme={this.state.isDarkTheme}
              />
              {!this.props.hideDefaultViewButtons && (
                <button
                  className="luna-toolbar-button"
                  aria-label="Account"
                  onClick={(e) => this.toggleMenu(e, 'personalTools')}
                  tabIndex={0}
                  id="toolbar-personal"
                >
                  <Icon
                    name={userSVG}
                    size="24px"
                    title="Account"
                  />
                </button>
              )}
            </div>

            {/* Center Section: All Action Buttons */}
            <div className="luna-toolbar-center">
              {!this.props.hideDefaultViewButtons && (
                <>
                  {unlockAction && (
                    <button
                      aria-label={this.props.intl.formatMessage(
                        messages.unlock,
                      )}
                      className="luna-toolbar-button"
                      onClick={(e) => this.unlock(e)}
                      tabIndex={0}
                    >
                      <Icon
                        name={unlockSVG}
                        size="24px"
                        title={this.props.intl.formatMessage(messages.unlock)}
                      />
                    </button>
                  )}

                  {editAction && (
                    <Link
                      aria-label={this.props.intl.formatMessage(messages.edit)}
                      className="luna-toolbar-button"
                      to={`${path}/edit`}
                    >
                      <Icon
                        name={editSVG}
                        size="24px"
                        title={this.props.intl.formatMessage(messages.edit)}
                      />
                    </Link>
                  )}

                  {this.props.content &&
                    this.props.content.is_folderish &&
                    folderContentsAction &&
                    !this.props.pathname.endsWith('/contents') && (
                      <Link
                        aria-label={this.props.intl.formatMessage(
                          messages.contents,
                        )}
                        className="luna-toolbar-button"
                        to={`${path}/contents`}
                      >
                        <Icon
                          name={folderSVG}
                          size="24px"
                          title={this.props.intl.formatMessage(
                            messages.contents,
                          )}
                        />
                      </Link>
                    )}

                  {this.props.content &&
                    this.props.content.is_folderish &&
                    folderContentsAction &&
                    this.props.pathname.endsWith('/contents') && (
                      <Link
                        to={`${path}`}
                        aria-label={this.props.intl.formatMessage(
                          messages.back,
                        )}
                        className="luna-toolbar-button"
                      >
                        <Icon
                          name={backSVG}
                          size="24px"
                          title={this.props.intl.formatMessage(messages.back)}
                        />
                      </Link>
                    )}

                  {this.props.content &&
                    this.props.content.is_folderish &&
                    (this.props.types.length > 0 ||
                      this.props.content['@components']?.translations) && (
                      <button
                        className="luna-toolbar-button"
                        aria-label={this.props.intl.formatMessage(messages.add)}
                        onClick={(e) => this.toggleMenu(e, 'types')}
                        tabIndex={0}
                        id="toolbar-add"
                      >
                        <Icon
                          name={addSVG}
                          size="24px"
                          title={this.props.intl.formatMessage(messages.add)}
                        />
                      </button>
                    )}

                  <button
                    className="luna-toolbar-button"
                    aria-label={this.props.intl.formatMessage(messages.more)}
                    onClick={(e) => this.toggleMenu(e, 'more')}
                    tabIndex={0}
                    id="toolbar-more"
                  >
                    <Icon
                      name={moreSVG}
                      size="24px"
                      title={this.props.intl.formatMessage(messages.more)}
                    />
                  </button>
                </>
              )}
            </div>

            {/* Undo/Redo Section: White Background */}
            {/* Commented out for later decision
            <div className="luna-toolbar-undo-redo">
              {!this.props.hideDefaultViewButtons && (
                <>
                  <button
                    className="luna-toolbar-button"
                    aria-label={this.props.intl.formatMessage(messages.undo)}
                    onClick={this.handleUndo}
                    tabIndex={0}
                  >
                    <Icon
                      name={undoSVG}
                      size="24px"
                      title={this.props.intl.formatMessage(messages.undo)}
                    />
                  </button>

                  <button
                    className="luna-toolbar-button"
                    aria-label={this.props.intl.formatMessage(messages.redo)}
                    onClick={this.handleRedo}
                    tabIndex={0}
                  >
                    <Icon
                      name={redoSVG}
                      size="24px"
                      title={this.props.intl.formatMessage(messages.redo)}
                    />
                  </button>
                </>
              )}
            </div>
            */}

            {/* Right Section: Empty for sidebar space */}
            <div className="luna-toolbar-right">
              <Pluggable name="main.toolbar.bottom" />
            </div>
          </div>

          {/* Dropdown Menu Content */}
          <div
            style={this.state.menuStyle}
            className={
              this.state.showMenu
                ? 'luna-toolbar-content show'
                : 'luna-toolbar-content'
            }
            ref={this.toolbarWindow}
          >
            {this.state.showMenu && (
              <BodyClass className="has-toolbar-menu-open" />
            )}
            <div
              className="luna-pusher-puller"
              ref={(node) => (this.pusher = node)}
              style={{
                transform: this.toolbarWindow.current
                  ? `translateX(-${
                      (this.state.loadedComponents.length - 1) *
                      this.toolbarWindow.current.getBoundingClientRect().width
                    }px)`
                  : null,
              }}
            >
              {this.state.loadedComponents.map((component, index) =>
                (() => {
                  const ToolbarComponent =
                    toolbarComponents[component].component;
                  const WrapperComponent = toolbarComponents[component].wrapper;
                  const haveActions =
                    toolbarComponents[component].hideToolbarBody;
                  const title =
                    toolbarComponents[component].wrapperTitle &&
                    this.props.intl.formatMessage(
                      toolbarComponents[component].wrapperTitle,
                    );
                  if (WrapperComponent) {
                    return (
                      <WrapperComponent
                        componentName={component}
                        componentTitle={title}
                        pathname={this.props.pathname}
                        loadComponent={this.loadComponent}
                        unloadComponent={this.unloadComponent}
                        componentIndex={index}
                        theToolbar={this.toolbarWindow}
                        key={`personalToolsComponent-${index}`}
                        closeMenu={this.closeMenu}
                        hasActions={haveActions}
                      >
                        <ToolbarComponent
                          pathname={this.props.pathname}
                          loadComponent={this.loadComponent}
                          unloadComponent={this.unloadComponent}
                          componentIndex={index}
                          theToolbar={this.toolbarWindow}
                          closeMenu={this.closeMenu}
                          isToolbarEmbedded
                        />
                      </WrapperComponent>
                    );
                  } else {
                    return (
                      <ToolbarComponent
                        pathname={this.props.pathname}
                        loadComponent={this.loadComponent}
                        unloadComponent={this.unloadComponent}
                        componentIndex={index}
                        theToolbar={this.toolbarWindow}
                        key={`personalToolsComponent-${index}`}
                        closeMenu={this.closeMenu}
                        content={
                          toolbarComponents[component].contentAsProps
                            ? this.props.content
                            : null
                        }
                      />
                    );
                  }
                })(),
              )}
            </div>
          </div>
        </>
      )
    );
  }
}

export default compose(
  injectIntl,
  withCookies,
  connect(
    (state, props) => ({
      actions: state.actions.actions,
      token: state.userSession.token,
      userId: state.userSession.token
        ? jwtDecode(state.userSession.token).sub
        : '',
      content: state.content.data,
      pathname: props.pathname,
      types: filter(state.types.types, 'addable'),
      unlockRequest: state.content.unlock,
    }),
    { getTypes, listActions, setExpandedToolbar, unlockContent },
  ),
)(Toolbar);
