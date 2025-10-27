import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Tab } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { withCookies } from 'react-cookie';
import { defineMessages, useIntl } from 'react-intl';
import cx from 'classnames';
import BodyClass from '@plone/volto/helpers/BodyClass/BodyClass';
import { getCookieOptions } from '@plone/volto/helpers/Cookies/cookies';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import forbiddenSVG from '@plone/volto/icons/forbidden.svg';
import { setSidebarTab } from '@plone/volto/actions/sidebar/sidebar';

const messages = defineMessages({
  document: {
    id: 'Document',
    defaultMessage: 'Document',
  },
  block: {
    id: 'Block',
    defaultMessage: 'Block',
  },
  settings: {
    id: 'Settings',
    defaultMessage: 'Settings',
  },
  shrinkSidebar: {
    id: 'Shrink sidebar',
    defaultMessage: 'Shrink sidebar',
  },
  expandSidebar: {
    id: 'Expand sidebar',
    defaultMessage: 'Expand sidebar',
  },
  order: {
    id: 'Order',
    defaultMessage: 'Order',
  },
});

const Sidebar = (props) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const {
    cookies,
    content,
    documentTab,
    blockTab,
    settingsTab,
    orderTab = true,
  } = props;
  const [expanded, setExpanded] = useState(
    cookies.get('sidebar_expanded') !== 'false',
  );
  const [size] = useState(0);

  const tab = useSelector((state) => state.sidebar.tab);
  const type = useSelector((state) => state.schema?.schema?.title);
  const sidebarVisible = useSelector(
    (state) => state.sidebarVisibility.visible,
  );

  const onToggleExpanded = () => {
    cookies.set('sidebar_expanded', !expanded, getCookieOptions());
    setExpanded(!expanded);
  };

  // Control sidebar visibility based on Redux state
  useEffect(() => {
    const sidebar = document.querySelector('#sidebar');
    if (!sidebar) return;

    if (sidebarVisible) {
      sidebar.style.display = '';
      document.body.classList.add('has-sidebar');
      document.body.classList.remove('has-sidebar-collapsed');
    } else {
      sidebar.style.display = 'none';
      document.body.classList.remove('has-sidebar');
      document.body.classList.add('has-sidebar-collapsed');
    }
  }, [sidebarVisible]);

  const onTabChange = (event, data) => {
    event.nativeEvent.stopImmediatePropagation();
    dispatch(setSidebarTab(data.activeIndex));
  };

  return (
    <Fragment>
      <BodyClass
        className={expanded ? 'has-sidebar' : 'has-sidebar-collapsed'}
      />
      <div
        className={cx('sidebar-container', { collapsed: !expanded })}
        style={size > 0 ? { width: size } : null}
      >
        <Button
          type="button"
          aria-label={
            expanded
              ? intl.formatMessage(messages.shrinkSidebar)
              : intl.formatMessage(messages.expandSidebar)
          }
          className={
            content && content.review_state
              ? `${content.review_state} trigger`
              : 'trigger'
          }
          onClick={onToggleExpanded}
        />
        <Tab
          menu={{
            secondary: true,
            pointing: true,
            attached: true,
            tabular: true,
            className: 'formtabs',
          }}
          className="tabs-wrapper"
          renderActiveOnly={false}
          activeIndex={tab}
          onTabChange={onTabChange}
          panes={[
            !!documentTab && {
              menuItem: {
                key: 'documentTab',
                as: 'button',
                className: 'ui button',
                content: type || intl.formatMessage(messages.document),
              },
              pane: (
                <Tab.Pane
                  key="metadata"
                  className="tab-wrapper"
                  id="sidebar-metadata"
                />
              ),
            },
            !!blockTab && {
              menuItem: {
                key: 'blockTab',
                as: 'button',
                className: 'ui button',
                content: intl.formatMessage(messages.block),
              },
              pane: (
                <Tab.Pane
                  key="properties"
                  className="tab-wrapper"
                  id="sidebar-properties"
                >
                  <Icon
                    className="tab-forbidden"
                    name={forbiddenSVG}
                    size="48px"
                  />
                </Tab.Pane>
              ),
            },
            !!orderTab && {
              menuItem: intl.formatMessage(messages.order),
              pane: (
                <Tab.Pane
                  key="order"
                  className="tab-wrapper"
                  id="sidebar-order"
                >
                  <Icon
                    className="tab-forbidden"
                    name={forbiddenSVG}
                    size="48px"
                  />
                </Tab.Pane>
              ),
            },
            !!settingsTab && {
              menuItem: intl.formatMessage(messages.settings),
              pane: (
                <Tab.Pane
                  key="settings"
                  className="tab-wrapper"
                  id="sidebar-settings"
                >
                  <Icon
                    className="tab-forbidden"
                    name={forbiddenSVG}
                    size="48px"
                  />
                </Tab.Pane>
              ),
            },
          ].filter((tab) => tab)}
        />
      </div>
      <div className={expanded ? 'pusher expanded' : 'pusher'} />
    </Fragment>
  );
};

Sidebar.propTypes = {
  documentTab: PropTypes.bool,
  blockTab: PropTypes.bool,
  settingsTab: PropTypes.bool,
};

Sidebar.defaultProps = {
  documentTab: true,
  blockTab: true,
  settingsTab: false,
};

export default compose(withCookies)(Sidebar);
