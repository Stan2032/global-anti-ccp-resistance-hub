import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

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
 * Write a localStorage key, or remove it when `value` is null. Never throws:
 * where storage is blocked or full, the write is skipped. Blocking site data
 * makes every storage access throw, and one unguarded access on the render
 * path is enough to replace the whole page with the error screen.
 */
export function writeStoredValue(key: string, value: string | null): void {
  if (!isBrowser) return;
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked or full: nothing more to do.
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

/**
 * A value saved for the reader's next visit, without a hydration mismatch.
 *
 * Pre-rendered HTML is the same for every reader, so it cannot contain what a
 * returning reader saved last time: dismissed alerts, checklist progress,
 * their theme. Reading that in a `useState` initialiser makes the first client
 * render disagree with the HTML, and React discards the page and renders it
 * again from scratch (error #418) — on every visit, for every reader who had
 * saved anything. Here React renders `fallback` while hydrating, exactly as
 * the HTML was built, and applies the saved value straight afterwards.
 *
 * Nothing is written until the reader changes something, and saving the
 * fallback removes the key. A reader who only reads leaves no trace of this
 * site in browser storage — on an inspected device, a key naming the site is
 * itself a risk.
 *
 * Where storage is blocked, the value is kept in memory for the rest of the
 * visit, so the control still works; it just is not remembered.
 */
export function useStoredString(key: string, fallback: string): [string, (next: string) => void] {
  const subscribe = useCallback((notify: () => void) => {
    const set = storeSubscribers.get(key) ?? new Set<() => void>();
    storeSubscribers.set(key, set);
    set.add(notify);
    return () => { set.delete(notify); };
  }, [key]);

  const value = useSyncExternalStore(
    subscribe,
    () => readSaved(key) ?? fallback,
    () => fallback,
  );

  const save = useCallback((next: string) => {
    try {
      if (next === fallback) localStorage.removeItem(key);
      else localStorage.setItem(key, next);
      unsavedValues.delete(key);
    } catch {
      unsavedValues.set(key, next);
    }
    storeSubscribers.get(key)?.forEach(notify => notify());
  }, [key, fallback]);

  return [value, save];
}

/**
 * `useStoredString` for a JSON value. The setter also takes an updater
 * function, like `useState`'s, applied to the latest saved value.
 *
 * `fallback` is read once, on first render, so an inline `[]` is fine.
 */
export function useStoredJson<T>(
  key: string,
  fallback: T,
): [T, (update: T | ((current: T) => T)) => void] {
  const [fallbackText] = useState(() => JSON.stringify(fallback));
  const [text, saveText] = useStoredString(key, fallbackText);
  const value = useMemo(() => parseOr<T>(text, fallbackText), [text, fallbackText]);

  const save = useCallback((update: T | ((current: T) => T)) => {
    const current = parseOr<T>(readSaved(key) ?? fallbackText, fallbackText);
    const next = typeof update === 'function' ? (update as (c: T) => T)(current) : update;
    saveText(JSON.stringify(next));
  }, [key, fallbackText, saveText]);

  return [value, save];
}

/** Values the browser refused to store, kept for the rest of this visit. */
const unsavedValues = new Map<string, string>();
const storeSubscribers = new Map<string, Set<() => void>>();

function readSaved(key: string): string | null {
  return unsavedValues.has(key) ? unsavedValues.get(key)! : readStoredValue(key);
}

function parseOr<T>(text: string, fallbackText: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return JSON.parse(fallbackText) as T;
  }
}
