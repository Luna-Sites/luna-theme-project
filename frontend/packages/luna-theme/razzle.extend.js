/**
 * Luna Theme - Razzle Configuration
 * Extends the build configuration to include custom theme styles
 */

const path = require('path');

const plugins = (defaultPlugins) => {
  return defaultPlugins;
};

const modify = (config, { target, dev }, webpack) => {
  // Add alias for theme imports
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }

  config.resolve.alias['luna-theme'] = path.resolve(__dirname, 'src');

  return config;
};

module.exports = {
  plugins,
  modify,
};
