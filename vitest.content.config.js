import { defineConfig } from 'vite'

/**
 * Content-freshness test project.
 *
 * These specs assert that the site's human-rights data has been re-verified
 * against its sources recently enough to be trustworthy. They fail with the
 * passage of time rather than because of a code change, so they are kept out
 * of the commit-gating suite (`npm test`) and run separately —
 * `npm run test:content`, plus a scheduled CI job.
 *
 * A failure here is a signal to go and re-verify data against Tier 1-2
 * sources. It must never be "fixed" by editing verification dates: doing so
 * fabricates provenance, which this project explicitly forbids.
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: [
      'src/test/data-freshness.test.ts',
      'src/test/data-staleness-guard.test.ts',
    ],
  },
})
