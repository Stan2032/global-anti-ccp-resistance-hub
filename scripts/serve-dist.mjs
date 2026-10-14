/**
 * Serve dist/ the way Cloudflare Workers Static Assets does, for verifying
 * what a reader actually receives.
 *
 * `vite preview` is not usable for this. It SPA-falls-back to
 * `dist/index.html` for any path it does not recognise, so `/prisoners`,
 * `/take-action` and every other route return the Dashboard. All routes then
 * measure identically and hydration errors show up on routes that do not
 * have them — a verification run against it reported 11,005 visible
 * characters for nine different routes and looked plausible.
 *
 * Workers resolves `/prisoners` to `dist/prisoners/index.html`, which is what
 * `html_handling: "drop-trailing-slash"` in wrangler.jsonc asks for and what
 * `scripts/prerender.mjs` writes. This does the same and nothing else: no
 * SPA fallback, so a 404 here is a 404 in production.
 *
 * Usage: npm run serve:dist   (after `npm run build`)
 *
 * Check a page the way the readers this site is for will see it — Tor
 * Browser on Safer or Safest, which means JavaScript disabled.
 */
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname, resolve, dirname, relative, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT ?? 4174);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

/** Reject anything that escapes dist/, e.g. a `..` traversal. */
function within(path) {
  const rel = relative(DIST, path);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
}

createServer(async (req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('bad request');
    return;
  }

  // The asset itself, then the folder index — Workers' resolution order.
  for (const candidate of [join(DIST, pathname), join(DIST, pathname, 'index.html')]) {
    if (within(candidate) && (await isFile(candidate))) {
      res.writeHead(200, {
        'content-type': TYPES[extname(candidate)] ?? 'application/octet-stream',
      });
      res.end(await readFile(candidate));
      return;
    }
  }

  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('404 — not in dist/. Workers would also 404 here; there is no SPA fallback.');
}).listen(PORT, '127.0.0.1', () => {
  console.log(`[serve-dist] dist/ on http://127.0.0.1:${PORT} (no SPA fallback)`);
});
