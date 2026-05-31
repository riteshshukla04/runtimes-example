import { registerRootComponent } from 'expo';

// Loaded by EVERY runtime (main + each secondary "threaded" runtime). Gate so
// threaded runtimes load only the generated registry instead of re-registering
// the main app.
if ((globalThis as any).__THREADED_RUNTIME_ENV__) {
  require('./.threaded-runtime/entry');
} else {
  const App = require('./App').default;
  registerRootComponent(App);
}
