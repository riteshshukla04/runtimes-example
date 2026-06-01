import { call } from '@react-native-runtimes/core';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { probeExpoModules, runExpoProbe, type ExpoProbeResult } from '../expo-work';

const PROBE_INPUT = 'hello-from-runtimes-example';
const SECONDARY_RUNTIME = 'background';

// The same input must hash to the same SHA-256 on both runtimes — proves the
// secondary runtime called the REAL native module, not a stub.
function verdict(result: ExpoProbeResult | null, error: string | null) {
  if (error) return { ok: false, label: 'FAIL' };
  if (!result) return { ok: false, label: '…' };
  const ok =
    result.hasExpoHost &&
    result.nativeModuleCount > 0 &&
    !!result.sha256 &&
    !!result.randomUUID &&
    !!result.deviceModel &&
    result.errors.length === 0;
  return { ok, label: ok ? 'PASS' : 'FAIL' };
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowKey}>{k}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>
        {v}
      </Text>
    </View>
  );
}

function ResultCard({
  title,
  result,
  error,
}: {
  title: string;
  result: ExpoProbeResult | null;
  error: string | null;
}) {
  const v = verdict(result, error);
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={[styles.badge, result || error ? (v.ok ? styles.badgeOk : styles.badgeFail) : null]}>
          {v.label}
        </Text>
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : result ? (
        <>
          <Row k="runtime" v={result.ranOnRuntime} />
          <Row k="expo host" v={result.hasExpoHost ? 'installed' : 'MISSING'} />
          <Row
            k="native modules"
            v={`${result.nativeModuleCount}${
              result.nativeModuleSample.length ? ` (${result.nativeModuleSample.join(', ')}…)` : ''
            }`}
          />
          <Row k="sha256" v={result.sha256 ? `${result.sha256.slice(0, 24)}…` : 'null'} />
          <Row k="uuid" v={result.randomUUID ?? 'null'} />
          <Row k="random bytes" v={result.randomBytes ? result.randomBytes.join(',') : 'null'} />
          <Row
            k="device"
            v={`${result.deviceModel ?? 'null'} · ${result.osName ?? '?'} ${result.osVersion ?? '?'}`}
          />
          {result.errors.map(e => (
            <Text key={e} style={styles.error}>
              {e}
            </Text>
          ))}
        </>
      ) : (
        <ActivityIndicator style={styles.spinner} />
      )}
    </View>
  );
}

export function ExpoModulesScreen() {
  const [main, setMain] = useState<ExpoProbeResult | null>(null);
  const [secondary, setSecondary] = useState<ExpoProbeResult | null>(null);
  const [secondaryError, setSecondaryError] = useState<string | null>(null);

  useEffect(() => {
    // Control: run the probe locally on the main runtime.
    void runExpoProbe(PROBE_INPUT).then(setMain);
    // Test: run the same probe on the secondary runtime.
    call(probeExpoModules)
      .on(SECONDARY_RUNTIME)(PROBE_INPUT)
      .then(setSecondary)
      .catch(e => setSecondaryError(String(e)));
  }, []);

  const hashesMatch = !!main?.sha256 && !!secondary?.sha256 && main.sha256 === secondary.sha256;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>
        Runs expo-crypto + expo-device on the main runtime and on the “{SECONDARY_RUNTIME}”
        secondary runtime. Both must return real native values.
      </Text>

      <ResultCard title="Main runtime" result={main} error={null} />
      <ResultCard title="Secondary runtime" result={secondary} error={secondaryError} />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>SHA-256 cross-check</Text>
          <Text
            style={[
              styles.badge,
              main && (secondary || secondaryError)
                ? hashesMatch
                  ? styles.badgeOk
                  : styles.badgeFail
                : null,
            ]}
          >
            {main && (secondary || secondaryError) ? (hashesMatch ? 'MATCH' : 'MISMATCH') : '…'}
          </Text>
        </View>
        <Text style={styles.note}>
          Both runtimes hash “{PROBE_INPUT}” natively — identical digests prove the secondary
          runtime used the real ExpoCrypto module.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, gap: 14 },
  subtitle: { fontSize: 13, color: '#5b6072', marginBottom: 4 },
  card: {
    backgroundColor: '#f3f5fb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e8f5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1c2030' },
  badge: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8a90a6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  badgeOk: { color: '#fff', backgroundColor: '#0bb07b' },
  badgeFail: { color: '#fff', backgroundColor: '#e2454c' },
  row: { flexDirection: 'row', marginBottom: 6, gap: 8 },
  rowKey: { width: 110, fontSize: 13, color: '#6b7088', fontWeight: '600' },
  rowValue: { flex: 1, fontSize: 13, color: '#1c2030' },
  error: { fontSize: 12, color: '#e2454c', marginTop: 4 },
  note: { fontSize: 12, color: '#6b7088' },
  spinner: { marginVertical: 12 },
});
