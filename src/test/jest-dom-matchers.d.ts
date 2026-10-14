/**
 * jest-dom's matchers, typed for Vitest 5.
 *
 * jest-dom still augments Vitest's `Assertion<T>`, which Vitest 5 made
 * `Assertion<R, T>`, so the two declarations no longer merge and every
 * `toBeInTheDocument()` in the tests failed to typecheck. The matchers
 * themselves are registered by `setup.ts` and work either way; this only
 * describes them, through Vitest 5's extension point, `Matchers<R, T>`.
 */
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  // T is unused here but must be declared to merge with Vitest's own.
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown>
    extends TestingLibraryMatchers<unknown, R> {}
}
