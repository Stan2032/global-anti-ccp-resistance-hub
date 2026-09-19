/**
 * PRERENDER SPIKE — measurement only. NOT wired into the build.
 *
 * Run against a local `vite preview` to measure what a JavaScript-disabled
 * reader would receive if the site were pre-rendered:
 *
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/prerender-spike.mjs
 *
 * Findings from the 2026-09-19 run are in docs/MODERNIZATION.md section 12.
 * Adopt or delete after that decision — do not leave this drifting.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { gzipSync } from 'zlib';

const BASE = 'http://127.0.0.1:4173';
const DIST = '/home/user/global-anti-ccp-resistance-hub/dist';
const OUT = '/tmp/claude-0/-home-user-global-anti-ccp-resistance-hub/fbd13bcc-c018-5bc0-bedf-7a28dfde0c48/scratchpad/prerendered2';
const ROUTES = ['/', '/prisoners', '/profiles/jimmy-lai'];

fs.mkdirSync(OUT, { recursive: true });
const shell = fs.readFileSync(`${DIST}/index.html`, 'utf8');
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

// Discover the keys the tour uses so we seed the right ones.
const probe = await browser.newContext();
const pp = await probe.newPage();
await pp.goto(BASE + '/', { waitUntil: 'networkidle' });
await pp.waitForTimeout(3000);
const keys = await pp.evaluate(() => Object.keys(localStorage));
console.log('localStorage keys the app sets:', keys);
await probe.close();

const written = [];
for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // Seed BEFORE any app code runs, so the tour never mounts.
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('hasSeenQuickStart', 'true');
      localStorage.setItem('quickStartCompleted', 'true');
      localStorage.setItem('resistance-hub-onboarding-seen', 'true');
    } catch { /* private mode */ }
  });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2500);
  const rootHtml = await page.$eval('#root', el => el.innerHTML);
  await ctx.close();

  const out = shell.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`);
  const name = (route === '/' ? 'index' : route.replace(/^\//, '').replace(/\//g, '_')) + '.html';
  fs.writeFileSync(path.join(OUT, name), out);
  written.push({ route, name, gzipKB: +(gzipSync(Buffer.from(out)).length / 1024).toFixed(1) });
  const tour = /Welcome to the Resistance Hub|1\/7/.test(out);
  console.log(`${route.padEnd(22)} tour baked in: ${tour ? 'YES (bad)' : 'no'}   gzip ${written.at(-1).gzipKB}KB`);
}

// ---- hydration check: serve prerendered HTML + real dist assets ----
const server = http.createServer((req, res) => {
  let p = req.url.split('?')[0];
  const pre = path.join(OUT, p === '/' ? 'index.html' : p.replace(/^\//, '').replace(/\//g, '_') + '.html');
  if (fs.existsSync(pre)) {
    res.writeHead(200, { 'content-type': 'text/html' });
    return res.end(fs.readFileSync(pre));
  }
  const asset = path.join(DIST, p);
  if (fs.existsSync(asset) && fs.statSync(asset).isFile()) {
    const ext = path.extname(asset);
    const ct = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
                 '.svg': 'image/svg+xml', '.png': 'image/png' }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': ct });
    return res.end(fs.readFileSync(asset));
  }
  res.writeHead(404); res.end('nf');
});
await new Promise(r => server.listen(4199, '127.0.0.1', r));

console.log('\n--- hydration check (JS ON, loading the prerendered HTML) ---');
for (const { route } of written) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  page.on('console', m => {
    const t = m.text();
    if (m.type() === 'error' && !/ERR_CERT|Failed to load resource/.test(t)) errs.push(t.slice(0, 140));
  });
  await page.goto('http://127.0.0.1:4199' + route, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(3000);
  // is the app interactive? click a nav link and see if the route changes
  const interactive = await page.evaluate(() => !!document.querySelector('#root')?.children.length);
  console.log(`${route.padEnd(22)} hydrated=${interactive}  errors=${errs.length}`);
  errs.slice(0, 3).forEach(e => console.log(`    ! ${e}`));
  await ctx.close();
}
server.close();
await browser.close();

// ---- no-JS check on the prerendered output ----
console.log('\n--- what a JS-disabled reader now gets ---');
for (const { route, name } of written) {
  const html = fs.readFileSync(path.join(OUT, name), 'utf8');
  const body = /<body[^>]*>([\s\S]*?)<\/body>/.exec(html)[1];
  const text = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`${route.padEnd(22)} ${text.length.toLocaleString()} chars`);
}
