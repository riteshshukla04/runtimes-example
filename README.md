# runtimes-example

Example apps exercising [`@react-native-runtimes/core`](https://github.com/Szymon20000/react-native-runtimes) (+ `/state`) across React Native versions and Expo SDKs:

| App | Stack |
| --- | --- |
| `RN85` | bare React Native 0.85.3 |
| `RN83` | bare React Native 0.83.9 |
| `Expo56` | Expo SDK 56 (RN 0.85) |
| `Expo55` | Expo SDK 55 (RN 0.83) |

Each app has the same screens: a shared-store counter (main runtime), a `runtimeFunction` worker (secondary `background` runtime), and a `ThreadedScreen` dashboard (secondary `dashboard-runtime`) that reads the shared store live.

## CI

`.github/workflows/ci.yml`:

- **`pack`** clones `react-native-runtimes@fix/rn-versions`, builds **one** tarball of `core` + `state`, and uploads it as a shared artifact.
- **`ios`** / **`android`** matrix jobs (all 4 apps) download that single artifact, install it, and build (iOS Simulator / `assembleDebug`). Expo apps are `expo prebuild`-ed in CI; their native config comes entirely from the `@react-native-runtimes/core` config plugin.

## Local

```sh
cd <app>
# vendor/rnr-core.tgz + vendor/rnr-state.tgz must exist (npm pack the library packages into vendor/)
npm install
npx expo prebuild -p ios   # Expo apps only
cd ios && pod install       # iOS
npx react-native run-ios    # bare apps  (or: npx expo run:ios)
```
