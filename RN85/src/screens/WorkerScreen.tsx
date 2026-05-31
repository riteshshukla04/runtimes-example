import { call, ThreadedRuntime } from '@react-native-runtimes/core';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { computeFib } from '../work';

const WORKER_RUNTIME = 'background';

export function WorkerScreen() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<null | {
    input: number;
    result: number;
    ranOnRuntime: string;
    elapsedMs: number;
  }>(null);

  useEffect(() => {
    ThreadedRuntime.prewarm(WORKER_RUNTIME);
  }, []);

  const run = async (n: number) => {
    setBusy(true);
    try {
      const r = await call(computeFib).on(WORKER_RUNTIME)(n);
      setResult(r);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Background worker</Text>
      <Text style={styles.subtitle}>
        Runs a naive Fibonacci on the “{WORKER_RUNTIME}” runtime and awaits the
        result — the UI thread stays responsive.
      </Text>

      <View style={styles.row}>
        {[30, 35, 40].map(n => (
          <Pressable
            key={n}
            disabled={busy}
            style={({ pressed }) => [styles.btn, (pressed || busy) && styles.btnPressed]}
            onPress={() => run(n)}
          >
            <Text style={styles.btnText}>fib({n})</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.resultBox}>
        {busy ? (
          <ActivityIndicator />
        ) : result ? (
          <>
            <Text style={styles.resultValue}>
              fib({result.input}) = {result.result}
            </Text>
            <Text style={styles.resultMeta}>
              ran on “{result.ranOnRuntime}” in {result.elapsedMs} ms
            </Text>
          </>
        ) : (
          <Text style={styles.resultMeta}>Tap a button to compute.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '800', color: '#11131a' },
  subtitle: { fontSize: 14, color: '#5b6072', textAlign: 'center', marginTop: 8, marginBottom: 28 },
  row: { flexDirection: 'row', gap: 12 },
  btn: { backgroundColor: '#0bb07b', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 14 },
  btnPressed: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultBox: { marginTop: 32, minHeight: 70, alignItems: 'center', justifyContent: 'center' },
  resultValue: { fontSize: 22, fontWeight: '800', color: '#11131a' },
  resultMeta: { fontSize: 13, color: '#8a90a6', marginTop: 6 },
});
