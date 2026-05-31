import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Route } from '../navigation';

const LINKS: { route: Route; label: string; desc: string }[] = [
  { route: 'counter', label: 'Shared Counter', desc: 'State shared across runtimes' },
  { route: 'worker', label: 'Background Worker', desc: 'Awaitable runtimeFunction off the main thread' },
  { route: 'dashboard', label: 'Threaded Dashboard', desc: 'A full screen rendered on a secondary runtime' },
];

export function HomeScreen({ navigate }: { navigate: (route: Route) => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Runtimes</Text>
      <Text style={styles.subtitle}>
        Secondary Hermes runtimes for rendering, awaitable calls, and shared state.
      </Text>
      <View style={styles.list}>
        {LINKS.map(link => (
          <Pressable
            key={link.route}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            onPress={() => navigate(link.route)}
          >
            <Text style={styles.itemLabel}>{link.label}</Text>
            <Text style={styles.itemDesc}>{link.desc}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: '800', color: '#11131a' },
  subtitle: { fontSize: 15, color: '#5b6072', marginTop: 8, marginBottom: 28 },
  list: { gap: 14 },
  item: {
    backgroundColor: '#f3f5fb',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e4e8f5',
  },
  itemPressed: { backgroundColor: '#e7ebf8' },
  itemLabel: { fontSize: 18, fontWeight: '700', color: '#1c2030' },
  itemDesc: { fontSize: 13, color: '#6b7088', marginTop: 4 },
});
