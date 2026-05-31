import { createSharedStore } from '@react-native-runtimes/state';

export type AppState = {
  counter: { count: number };
  feed: { items: string[] };
};

export const appStore = createSharedStore<AppState>({
  name: 'app',
  initialState: {
    counter: { count: 0 },
    feed: { items: [] },
  },
  subtrees: ['counter', 'feed'],
  persist: {
    key: 'app-v1',
    subtrees: ['counter'],
    version: 1,
  },
});

export const counterPath = appStore.path<AppState['counter']>(['counter']);
export const feedPath = appStore.path<AppState['feed']>(['feed']);
