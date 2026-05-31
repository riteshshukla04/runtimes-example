const { getDefaultConfig } = require('expo/metro-config');
const { withThreadedRuntime } = require('@react-native-runtimes/core/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Generates `.threaded-runtime/entry.js`, keeps Expo's babel transformer (adds
// the runtime-function plugin), and installs the secondary-runtime polyfill.
module.exports = withThreadedRuntime(config, { roots: ['App.tsx', 'src'] });
