const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Dodaj .cjs ekstenziju ako nije već tu
if (!defaultConfig.resolver.sourceExts.includes('cjs')) {
  defaultConfig.resolver.sourceExts.push('cjs');
}

// Rešavanje problema sa package exports
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
