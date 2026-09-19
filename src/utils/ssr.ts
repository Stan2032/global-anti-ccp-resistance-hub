import { useSyncExternalStore } from 'react';

/**
 * Helpers for code that runs both in the browser and during the static
 * pre-render build (see scripts/prerender.mjs).
 *
 * During pre-rendering there is no `window`, `document` or `localStorage`.
 * Anything that reads them on the render path — a `useState` initialiser, a
 * `useMemo`, module top-level — must go through these, or the build crashes.
 * Code inside `useEffect` and event handlers is already safe: effects do not
 * run during pre-rendering and handlers need a real user.
 *
 * @module ssr
 */

/** True when running in a real browser rather than the pre-render build. */
export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Read a key from localStorage, returning `fallback` when unavailable.
 *
 * Covers three cases that all look the same to a component: pre-rendering
 * (no localStorage at all), private browsing or blocked site data (the
 * accessor throws), and a key that was simply never set. Readers on Tor
 * Browser hit the middle case routinely, so this must never throw.
 */
export function readStoredValue(key: string, fallback: string | null = null): string | null {
  if (!isBrowser) return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Evaluate a media query, returning `fallback` when it cannot be evaluated.
 *
 * During pre-rendering there is no viewport to match against, so callers get
 * the fallback and correct themselves on hydration.
 */
export function matchesMediaQuery(query: string, fallback = false): boolean {
  if (!isBrowser || typeof window.matchMedia !== 'function') return fallback;
  try {
    return window.matchMedia(query).matches;
  } catch {
    return fallback;
  }
}

/**
 * Read a browser-only value without causing a hydration mismatch.
 *
 * Pre-rendered HTML cannot know anything about the reader — their stored
 * preferences, their device, their colour scheme. Naively reading those in a
 * `useState` initialiser makes the first client render disagree with the
 * server markup, and React throws the whole tree away and re-renders it
 * (error #418).
 *
 * `useSyncExternalStore` is built for this: React uses `serverValue` while
 * hydrating, then re-renders just this subtree with the real client value.
 *
 * `getClient` MUST return a primitive, or a referentially stable value.
 * Returning a fresh object or array on each call will loop forever.
 */
export function useBrowserValue<T extends string | number | boolean | null>(
  getClient: () => T,
  serverValue: T,
): T {
  return useSyncExternalStore(subscribeNever, getClient, () => serverValue);
}

/** No-op subscribe: these values do not change without a user action. */
function subscribeNever(): () => void {
  return () => {};
}
