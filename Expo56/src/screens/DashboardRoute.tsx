import { ThreadedRuntime, ThreadedScreen } from '@react-native-runtimes/core';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { DashboardScreen } from './DashboardScreen';

const RUNTIME_NAME = 'dashboard-runtime';

/**
 * A `<ThreadedScreen>` mounted on a COLD secondary runtime can render blank (the
 * surface asks the runtime to render before its bundle is ready). So prewarm the
 * runtime and only mount the surface once it's ready.
 */
export function DashboardRoute() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void ThreadedRuntime.prewarm(RUNTIME_NAME).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Starting dashboard runtime…</Text>
      </View>
    );
  }

  return (
    <ThreadedScreen
      component={DashboardScreen}
      props={{ title: 'Live Dashboard' }}
      runtimeName={RUNTIME_NAME}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1021',
    gap: 12,
  },
  loadingText: { color: '#8fb4ff', fontSize: 14 },
});
