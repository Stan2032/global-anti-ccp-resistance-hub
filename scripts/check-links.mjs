#!/usr/bin/env node
/**
 * Check every external link the site cites, and list the ones that are gone.
 *
 *   npm run check:links            # report, exit 1 if any link is broken
 *   npm run check:links -- --json  # the same, as JSON
 *
 * In October 2026, 161 of 919 cited URLs returned 404. Most were plausible
 * but non-existent slugs (hrw.org/news/2026/02/09/hong-kong-jimmy-lai-
 * sentenced-20-years for .../hong-kong-publisher-jimmy-lai-sentenced-to-
 * 20-years), not pages that had moved. A citation that leads nowhere is an
 * unsourced claim, so this lists them for re-sourcing.
 *
 * Only 404 and 410 count as broken. Sites that refuse bots (401, 403, 429,
 * Cloudflare challenges) are reported as unknown, not broken: check those by
 * hand. Needs the network, so it is not part of `npm test` or CI.
 * Behind a proxy, run it with NODE_USE_ENV_PROXY=1.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SCAN = ['src/data', 'src/pages', 'src/components', 'src/utils', 'src/services'];
const URL_RE = /https?:\/\/[^\s"'`<>)\\]+/g;
const CONCURRENCY = 8;
const PER_HOST = 2;
const TIMEOUT_MS = 30_000;
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (/\.(json|tsx?|jsx?)$/.test(name) && !/\.test\./.test(name)) yield path;
  }
}

/** url -> ["file:line", ...] */
function collect() {
  const where = new Map();
  for (const dir of SCAN) {
    for (const file of files(join(ROOT, dir))) {
      readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        for (const match of line.matchAll(URL_RE)) {
          const url = match[0].replace(/[.,;:]+$/, '');
          // Template literals build these at runtime; there is nothing to check.
          if (url.includes('${') || /localhost|127\.0\.0\.1|example\.(com|org)/.test(url)) continue;
          const at = `${relative(ROOT, file)}:${i + 1}`;
          where.set(url, [...(where.get(url) ?? []), at]);
        }
      });
    }
  }
  return where;
}

async function status(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html,application/pdf;q=0.9,*/*;q=0.8' },
    });
    res.body?.cancel();
    return res.status;
  } catch {
    return 0;
  } finally {
    clearTimeout(timer);
  }
}

function hostOf(url) {
  try { return new URL(url).host; } catch { return url; }
}

async function checkAll(urls) {
  const results = new Map();
  const active = new Map();
  const queue = [...urls];
  async function worker() {
    while (queue.length) {
      const i = queue.findIndex((u) => (active.get(hostOf(u)) ?? 0) < PER_HOST);
      if (i === -1) { await new Promise((r) => setTimeout(r, 50)); continue; }
      const [url] = queue.splice(i, 1);
      const host = hostOf(url);
      active.set(host, (active.get(host) ?? 0) + 1);
      results.set(url, await status(url));
      active.set(host, active.get(host) - 1);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

const where = collect();
const results = await checkAll([...where.keys()]);
const broken = [...results].filter(([, code]) => code === 404 || code === 410);
const unknown = [...results].filter(([, code]) => code === 0 || code >= 400 && code !== 404 && code !== 410);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({
    checked: results.size,
    broken: broken.map(([url, code]) => ({ url, code, at: where.get(url) })),
    unknown: unknown.map(([url, code]) => ({ url, code, at: where.get(url) })),
  }, null, 2));
} else {
  console.log(`Checked ${results.size} links: ${broken.length} broken, ${unknown.length} unknown (blocked, rate-limited or unreachable).\n`);
  for (const [url, code] of broken.sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`${code} ${url}`);
    for (const at of where.get(url)) console.log(`      ${at}`);
  }
}
process.exitCode = broken.length ? 1 : 0;
