/**
 * @format
 */

import { ThreadedRuntime } from '@react-native-runtimes/core';
import { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TITLES, type Route } from './src/navigation';
import { CounterScreen } from './src/screens/CounterScreen';
import { DashboardRoute } from './src/screens/DashboardRoute';
import { ExpoModulesScreen } from './src/screens/ExpoModulesScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkerScreen } from './src/screens/WorkerScreen';

function App() {
  const [route, setRoute] = useState<Route>('home');

  // Warm the secondary runtimes at startup so the first navigation doesn't pay
  // the cold bundle-load cost or render blank.
  useEffect(() => {
    void ThreadedRuntime.prewarm('dashboard-runtime');
    void ThreadedRuntime.prewarm('background');
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle={route === 'dashboard' ? 'light-content' : 'dark-content'}
      />
      <View style={styles.header}>
        {route !== 'home' ? (
          <Pressable hitSlop={12} onPress={() => setRoute('home')}>
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
        <Text style={styles.headerTitle}>{TITLES[route]}</Text>
        <View style={styles.backSpacer} />
      </View>

      <View style={styles.body}>
        {route === 'home' && <HomeScreen navigate={setRoute} />}
        {route === 'counter' && <CounterScreen />}
        {route === 'worker' && <WorkerScreen />}
        {route === 'dashboard' && <DashboardRoute />}
        {route === 'expomods' && <ExpoModulesScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e3e6ef',
  },
  back: { color: '#2f5bff', fontSize: 17, fontWeight: '600' },
  backSpacer: { width: 56 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#11131a' },
  body: { flex: 1 },
});

export default App;
