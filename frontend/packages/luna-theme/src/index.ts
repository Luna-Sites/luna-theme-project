import type { ConfigType } from '@plone/registry';
import installSettings from './config/settings';
import sidebarVisibility from './reducers/sidebarVisibility';

// Import theme styles
import './theme/main.scss';

function applyConfig(config: ConfigType) {
  installSettings(config);

  // Register custom reducer for sidebar visibility
  config.addonReducers = {
    ...config.addonReducers,
    sidebarVisibility,
  };

  return config;
}

export default applyConfig;
