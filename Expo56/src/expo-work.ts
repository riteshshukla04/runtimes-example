import { getCurrentRuntimeName, runtimeFunction } from '@react-native-runtimes/core';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';

export type ExpoProbeResult = {
  ranOnRuntime: string;
  hasExpoHost: boolean;
  nativeModuleCount: number;
  nativeModuleSample: string[];
  sha256: string | null;
  randomUUID: string | null;
  randomBytes: number[] | null;
  deviceModel: string | null;
  osName: string | null;
  osVersion: string | null;
  errors: string[];
};

// Probe that exercises real Expo modules (expo-crypto + expo-device). It runs
// identically on the main runtime (control) and on a secondary runtime via
// `call(probeExpoModules).on('background')(...)` — the target runtime evaluates
// its own copy of this module, including the expo imports.
export async function runExpoProbe(input: string): Promise<ExpoProbeResult> {
  const errors: string[] = [];

  // Is the native `global.expo` host installed on this runtime (vs. absent or
  // the inert polyfill stub)? The real host object exposes the installed
  // native module names through `expo.modules`.
  const expoGlobal = (globalThis as { expo?: { modules?: object } }).expo;
  let nativeModuleNames: string[] = [];
  try {
    nativeModuleNames = expoGlobal?.modules ? Object.keys(expoGlobal.modules) : [];
  } catch (e) {
    errors.push(`expo.modules keys: ${String(e)}`);
  }

  let sha256: string | null = null;
  try {
    sha256 =
      (await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input)) ?? null;
  } catch (e) {
    errors.push(`Crypto.digestStringAsync: ${String(e)}`);
  }

  let randomUUID: string | null = null;
  try {
    randomUUID = Crypto.randomUUID() ?? null;
  } catch (e) {
    errors.push(`Crypto.randomUUID: ${String(e)}`);
  }

  let randomBytes: number[] | null = null;
  try {
    const bytes = Crypto.getRandomBytes(8);
    randomBytes = bytes ? Array.from(bytes) : null;
  } catch (e) {
    errors.push(`Crypto.getRandomBytes: ${String(e)}`);
  }

  let deviceModel: string | null = null;
  let osName: string | null = null;
  let osVersion: string | null = null;
  try {
    deviceModel = Device.modelName ?? null;
    osName = Device.osName ?? null;
    osVersion = Device.osVersion ?? null;
  } catch (e) {
    errors.push(`expo-device: ${String(e)}`);
  }

  return {
    ranOnRuntime: getCurrentRuntimeName(),
    hasExpoHost: expoGlobal != null,
    nativeModuleCount: nativeModuleNames.length,
    nativeModuleSample: nativeModuleNames.slice(0, 6),
    sha256,
    randomUUID,
    randomBytes,
    deviceModel,
    osName,
    osVersion,
    errors,
  };
}

// Awaitable cross-runtime entry point for the probe.
export const probeExpoModules = runtimeFunction(async (input: string) => {
  return runExpoProbe(input);
});
