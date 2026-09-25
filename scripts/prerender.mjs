/**
 * Static pre-render step.
 *
 * Runs after `vite build`. Renders each public route to real HTML and writes
 * it into dist/, so the site is readable with JavaScript disabled — which is
 * the configuration the Security Center tells readers in China to use
 * (Tor Browser on Safer or Safest). React then hydrates the markup for
 * readers who do have JavaScript, so nobody pays twice.
 *
 * Deliberately does NOT use a headless browser. Cloudflare Workers Builds,
 * which deploys this repo, preinstalls Node but no Chromium, so a
 * browser-snapshot approach could not run at deploy time. This renders with
 * react-dom/static instead and needs nothing but Node.
 *
 * Routes come from public/sitemap.xml, which is already the canonical list of
 * public URLs and is already covered by tests.
 *
 * Usage: node scripts/prerender.mjs   (wired into `npm run build`)
 */
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SSR_OUT = join(ROOT, '.ssr-build');
const BASE_URL = 'https://global-anti-ccp-resistance-hub.stane203.workers.dev';

const log = (...a) => console.log('[prerender]', ...a);

/** Read the public route list from the sitemap. */
function routesFromSitemap() {
  const xml = readFileSync(join(ROOT, 'public/sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(m => m[1].replace(BASE_URL, '') || '/')
    .map(p => (p === '' ? '/' : p));
}

/** Where a route's HTML file lives, so Workers Static Assets serves it. */
function outputPathFor(route) {
  return route === '/'
    ? join(DIST, 'index.html')
    : join(DIST, route.replace(/^\//, ''), 'index.html');
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html missing — run `vite build` first.');
    process.exit(1);
  }

  // The client build's index.html is the template: it carries the hashed
  // script and stylesheet tags. Read it before anything overwrites it.
  const template = readFileSync(join(DIST, 'index.html'), 'utf8');
  if (!template.includes('<div id="root"></div>')) {
    console.error(
      '[prerender] dist/index.html has no empty #root, so it is already a\n' +
      '            pre-rendered page rather than a usable template.\n' +
      '            Run `vite build` to regenerate dist/ before pre-rendering\n' +
      '            (`npm run build` does both in order).'
    );
    process.exit(1);
  }

  log('building server bundle…');
  await build({
    logLevel: 'warn',
    // Do not inherit vite.config.js. Its manualChunks split react and
    // react-router into vendor chunks, which Rollup rejects in an SSR build
    // where those are external. The server bundle needs none of that config.
    configFile: false,
    plugins: [react()],
    resolve: { alias: { '@': resolve(ROOT, 'src') } },
    build: {
      ssr: resolve(ROOT, 'src/entry-server.tsx'),
      outDir: SSR_OUT,
      emptyOutDir: true,
      // CSS is already emitted by the client build and linked in the
      // template; the server bundle only needs the markup.
      cssCodeSplit: false,
    },
  });

  const { render } = await import(join(SSR_OUT, 'entry-server.js'));

  const routes = routesFromSitemap();
  log(`rendering ${routes.length} routes…`);

  const results = [];
  for (const route of routes) {
    const started = Date.now();
    let html;
    try {
      html = await render(route);
    } catch (err) {
      console.error(`[prerender] FAILED ${route}: ${err?.message ?? err}`);
      throw err;
    }
    const page = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    const out = outputPathFor(route);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, page);

    const controlNames = [...page.matchAll(/<(?:input|select|textarea)\b[^>]*?\saria-label="([^"]+)"/g)]
      .map(m => m[1]);
    const text = page
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    results.push({
      route,
      ms: Date.now() - started,
      gzipKB: +(gzipSync(Buffer.from(page)).length / 1024).toFixed(1),
      chars: text.length,
      hasRouteFallback: page.includes('loading system'),
      hiddenBlocks: (page.match(/<div hidden/g) || []).length,
      duplicateControlNames: [...new Set(controlNames.filter((n, i) => controlNames.indexOf(n) !== i))],
    });
  }

  rmSync(SSR_OUT, { recursive: true, force: true });

  const pad = (s, n) => String(s).padEnd(n);
  log('');
  log(`${pad('route', 34)} ${pad('gzip', 9)} ${pad('text', 9)} time`);
  for (const r of results) {
    log(`${pad(r.route, 34)} ${pad(r.gzipKB + 'KB', 9)} ${pad(r.chars.toLocaleString(), 9)} ${r.ms}ms`);
  }
  const total = results.reduce((a, r) => a + r.ms, 0);
  log('');
  log(`${results.length} routes in ${(total / 1000).toFixed(1)}s`);

  // Two regression guards, both for the same failure: markup that is present
  // in the file but invisible to a reader with JavaScript disabled. Both are
  // build-breaking, because the failure is silent otherwise — the page looks
  // perfect to anyone testing with JavaScript on, which is everyone.
  //
  // React's streaming renderer "outlines" a Suspense boundary by writing its
  // fallback in place and parking the real markup in a trailing `<div hidden>`
  // for a `$RC()` script to swap in. No script runs, no swap. It outlines when
  // a boundary suspends, and — the part that cost this project two wrong
  // diagnoses — also whenever a boundary's markup simply exceeds
  // `progressiveChunkSize`, whether or not anything suspended. See the comment
  // in src/entry-server.tsx.
  const deferred = results.filter(r => r.hasRouteFallback);
  if (deferred.length) {
    console.error(
      `\n[prerender] ${deferred.length} route(s) fell back to "$ loading" instead of\n` +
      `            rendering their content:\n` +
      deferred.map(r => `              ${r.route}`).join('\n') +
      `\n\n            Readers without JavaScript would see an empty page.\n` +
      `            The whole routed page is far larger than the default\n` +
      `            progressiveChunkSize, so check that src/entry-server.tsx\n` +
      `            still raises it.`
    );
    process.exit(1);
  }

  const withHidden = results.filter(r => r.hiddenBlocks > 0);
  if (withHidden.length) {
    const total = withHidden.reduce((a, r) => a + r.hiddenBlocks, 0);
    console.error(
      `\n[prerender] ${total} section(s) across ${withHidden.length} route(s) were written\n` +
      `            into <div hidden> and need JavaScript to become visible:\n` +
      withHidden.map(r => `              ${r.route} (${r.hiddenBlocks})`).join('\n') +
      `\n\n            The markup is in the file but a reader with JavaScript off\n` +
      `            never sees it. Either raise progressiveChunkSize in\n` +
      `            src/entry-server.tsx, or find what is suspending during the\n` +
      `            pre-render — a boundary that truly awaits something still\n` +
      `            gets outlined however large the chunk size.`
    );
    process.exit(1);
  }

  // A third guard, for readers using a screen reader or voice control. Every
  // form control on a page needs a name that says what it does. When two
  // share one, a reader tabbing through the controls hears "Search" twice and
  // cannot tell which list each one searches, and a voice command cannot
  // target either. Pages used to carry up to seven identical "Search" boxes
  // and a type filter announced as "Region filter".
  const withDuplicates = results.filter(r => r.duplicateControlNames.length);
  if (withDuplicates.length) {
    console.error(
      `\n[prerender] form controls share an accessible name on ${withDuplicates.length} route(s):\n` +
      withDuplicates.map(r => `              ${r.route}: ${r.duplicateControlNames.map(n => `"${n}"`).join(', ')}`).join('\n') +
      `\n\n            Name each control for what it searches or filters, e.g.\n` +
      `            aria-label="Search detention facilities", not "Search".`
    );
    process.exit(1);
  }
}

main().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
