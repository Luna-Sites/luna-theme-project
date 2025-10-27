import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { withCookies } from 'react-cookie';
import { defineMessages, useIntl } from 'react-intl';
import BodyClass from '@plone/volto/helpers/BodyClass/BodyClass';
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
  order: {
    id: 'Order',
    defaultMessage: 'Order',
  },
});

const Sidebar = (props) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const { documentTab, blockTab, settingsTab, orderTab = true } = props;
  const [size] = useState(0);

  const tab = useSelector((state) => state.sidebar.tab);
  const type = useSelector((state) => state.schema?.schema?.title);
  const sidebarVisible = useSelector(
    (state) => state.sidebarVisibility.visible,
  );

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
      <BodyClass className="has-sidebar" />
      <div
        className="sidebar-container"
        style={size > 0 ? { width: size } : null}
      >
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
      <div className="pusher" />
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
