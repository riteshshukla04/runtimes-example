import { Pressable, StyleSheet, Text, View } from 'react-native';
import { counterPath, feedPath } from '../store';

export function CounterScreen() {
  const count = counterPath.use(v => v?.count ?? 0);
  const itemCount = feedPath.use(v => v?.items.length ?? 0);

  const bump = (delta: number) =>
    counterPath.update(prev => ({ count: (prev?.count ?? 0) + delta }));

  const addFeedItem = () =>
    feedPath.update(prev => ({
      items: [...(prev?.items ?? []), `Item #${(prev?.items.length ?? 0) + 1}`],
    }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Shared counter</Text>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.row}>
        <Button title="−1" onPress={() => bump(-1)} />
        <Button title="+1" onPress={() => bump(1)} />
        <Button title="+10" onPress={() => bump(10)} />
      </View>
      <Pressable style={styles.feedBtn} onPress={addFeedItem}>
        <Text style={styles.feedBtnText}>Add feed item ({itemCount})</Text>
      </Pressable>
      <Text style={styles.hint}>
        Open the Threaded Dashboard — it reads these same values from a separate
        Hermes runtime, with nothing passed as props.
      </Text>
    </View>
  );
}

function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      onPress={onPress}
    >
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  label: { fontSize: 15, color: '#6b7088', fontWeight: '600' },
  count: { fontSize: 80, fontWeight: '800', color: '#11131a', marginVertical: 8 },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { backgroundColor: '#2f5bff', paddingHorizontal: 22, paddingVertical: 14, borderRadius: 14, minWidth: 64, alignItems: 'center' },
  btnPressed: { backgroundColor: '#2447cc' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  feedBtn: { marginTop: 24, backgroundColor: '#eef1fb', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  feedBtnText: { color: '#2f5bff', fontWeight: '700', fontSize: 15 },
  hint: { color: '#8a90a6', fontSize: 13, textAlign: 'center', marginTop: 28, paddingHorizontal: 12 },
});
