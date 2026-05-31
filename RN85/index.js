/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

// Loaded by EVERY runtime (main + each secondary "threaded" runtime). Gate so
// threaded runtimes load only the generated registry instead of re-registering
// the main app.
if (global.__THREADED_RUNTIME_ENV__) {
  require('./.threaded-runtime/entry');
} else {
  const App = require('./App').default;
  AppRegistry.registerComponent(appName, () => App);
}
