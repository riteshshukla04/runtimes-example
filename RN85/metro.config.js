const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withThreadedRuntime } = require('@react-native-runtimes/core/metro');

/** @type {import('@react-native/metro-config').MetroConfig} */
const config = {};

module.exports = withThreadedRuntime(
  mergeConfig(getDefaultConfig(__dirname), config),
  { roots: ['App.tsx', 'src'] },
);
