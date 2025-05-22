const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ručno podesimo da Webpack zna gde je `app` folder
  config.resolve.alias['app'] = path.resolve(__dirname, 'app');

  // Entry point za expo-router
  config.entry = path.resolve(__dirname, 'node_modules/expo-router/entry');

  return config;
};
