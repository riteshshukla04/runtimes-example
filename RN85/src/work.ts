import { getCurrentRuntimeName, runtimeFunction } from '@react-native-runtimes/core';

function fib(n: number): number {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

// Awaitable cross-runtime call. The body runs on whichever runtime the caller
// targets via `call(computeFib).on(name)(...)`.
export const computeFib = runtimeFunction((n: number) => {
  const start = Date.now();
  const result = fib(n);
  return {
    input: n,
    result,
    ranOnRuntime: getCurrentRuntimeName(),
    elapsedMs: Date.now() - start,
  };
});
