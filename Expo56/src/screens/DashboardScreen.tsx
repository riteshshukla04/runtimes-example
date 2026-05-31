import {
  getCurrentRuntimeName,
  threadedComponent,
} from '@react-native-runtimes/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { counterPath, feedPath } from '../store';

type DashboardProps = { title: string };

function Dashboard({ title }: DashboardProps) {
  // These hooks subscribe to the shared C++ store. The values are written on the
  // MAIN runtime (CounterScreen) but render here, on the secondary runtime.
  const count = counterPath.use(v => v?.count ?? 0);
  const items = feedPath.use(v => v?.items ?? []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          rendering on “{getCurrentRuntimeName()}” runtime
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Shared counter</Text>
        <Text style={styles.counter}>{count}</Text>
        <Text style={styles.hint}>
          Updated from the main runtime — no props pushed across the boundary.
        </Text>
      </View>

      <Text style={styles.cardLabel}>Shared feed ({items.length})</Text>
      <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent}>
        {items.length === 0 ? (
          <Text style={styles.hint}>Add items from the Counter screen.</Text>
        ) : (
          items.map((item, i) => (
            <Text key={i} style={styles.feedItem}>
              • {item}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

export const DashboardScreen = threadedComponent<DashboardProps>(
  'DashboardScreen',
  Dashboard,
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 16, backgroundColor: '#0b1021' },
  title: { fontSize: 24, fontWeight: '700', color: '#fff' },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1f2a52',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  badgeText: { color: '#8fb4ff', fontSize: 12, fontWeight: '600' },
  card: {
    backgroundColor: '#161d3a',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  cardLabel: { color: '#9aa4c7', fontSize: 13, marginTop: 16, fontWeight: '600' },
  counter: { color: '#fff', fontSize: 56, fontWeight: '800' },
  hint: { color: '#6b76a0', fontSize: 12, textAlign: 'center', marginTop: 6 },
  feed: { marginTop: 8, flex: 1 },
  feedContent: { paddingVertical: 4 },
  feedItem: { color: '#dfe4f5', fontSize: 15, paddingVertical: 4 },
});
