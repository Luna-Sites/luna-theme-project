import type { ConfigType } from '@plone/registry';
import installSettings from './config/settings';

// Import theme styles
import './theme/main.scss';

function applyConfig(config: ConfigType) {
  installSettings(config);

  return config;
}

export default applyConfig;
