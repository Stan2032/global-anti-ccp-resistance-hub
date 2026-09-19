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

  // Regression guard. If the route-level Suspense boundary is ever restored
  // during SSR, React defers the whole page into `<div hidden>` and emits the
  // `$ loading` fallback in its place. The build still succeeds and the page
  // still works for anyone with JavaScript — but readers without it silently
  // get an empty page again. That is the exact failure this whole step
  // exists to prevent, so fail the build loudly instead.
  const deferred = results.filter(r => r.hasRouteFallback);
  if (deferred.length) {
    console.error(
      `\n[prerender] ${deferred.length} route(s) fell back to "$ loading" instead of\n` +
      `            rendering their content:\n` +
      deferred.map(r => `              ${r.route}`).join('\n') +
      `\n\n            Readers without JavaScript would see an empty page.\n` +
      `            Check RouteBoundary in src/App.tsx — it must render its\n` +
      `            children without a Suspense boundary when import.meta.env.SSR.`
    );
    process.exit(1);
  }

  const hidden = results.reduce((a, r) => a + r.hiddenBlocks, 0);
  if (hidden) {
    log(`note: ${hidden} section(s) across all routes still defer to <div hidden>;`);
    log('      those are inner Suspense boundaries and need JavaScript to appear.');
  }
}

main().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
