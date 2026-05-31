export type Route = 'home' | 'counter' | 'worker' | 'dashboard';

export const TITLES: Record<Route, string> = {
  home: 'Runtimes Demo',
  counter: 'Shared Counter',
  worker: 'Background Worker',
  dashboard: 'Threaded Dashboard',
};
