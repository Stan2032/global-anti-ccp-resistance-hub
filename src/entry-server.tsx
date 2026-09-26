/**
 * Static pre-render entry.
 *
 * Renders a route to HTML at build time so the site is readable without
 * JavaScript. This matters more here than on most sites: the Security Center
 * tells readers in China to use Tor Browser, and Tor's Safer and Safest
 * levels disable JavaScript. Before pre-rendering, those readers — the most
 * at-risk ones — received 217 characters and no content at all.
 *
 * Uses `prerender` from react-dom/static rather than `renderToString`.
 * `renderToString` does not wait for Suspense boundaries, so every one of the
 * ~120 lazily-loaded components would have been emitted as its `$ loading`
 * fallback. `prerender` resolves them and returns the finished markup.
 *
 * Driven by scripts/prerender.mjs.
 *
 * @module entry-server
 */
import { prerender } from 'react-dom/static';
// React Router 7 exports StaticRouter from the package root; the v6
// `react-router-dom/server` subpath no longer exists.
import { StaticRouter } from 'react-router-dom';
import { AppProviders, AppLayout } from './App';

/**
 * Render one route to an HTML string.
 *
 * @param url - Route path to render, e.g. `/prisoners`.
 * @returns The markup for `#root`, with all Suspense boundaries resolved.
 */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <AppProviders>
      <StaticRouter location={url}>
        <AppLayout />
      </StaticRouter>
    </AppProviders>,
    {
      // The single setting that makes this site readable without JavaScript.
      //
      // React's streaming renderer decides per Suspense boundary whether to
      // write the content inline or to "outline" it: emit the fallback in
      // place and park the real markup in a trailing `<div hidden>` for a
      // `$RC()` script to swap in. It outlines whenever a boundary's markup
      // exceeds `progressiveChunkSize` — 12,800 bytes by default — and it
      // does that even when the boundary finished rendering and nothing
      // suspended. The threshold is a *streaming* optimisation: it lets a
      // browser paint the shell sooner on a slow connection.
      //
      // For a build-time render there is no shell to paint sooner; the file
      // is written whole either way. All the threshold buys us here is
      // sections that vanish for anyone with JavaScript off — and they were
      // the largest sections, because size is the trigger. Raising it past
      // any plausible page inlines everything.
      //
      // This is also what lets RouteBoundary render a real <Suspense> during
      // the pre-render, which is what fixes hydration error #418: the whole
      // routed page is far over 12,800 bytes, so with the default it was
      // outlined on every single route.
      progressiveChunkSize: Number.MAX_SAFE_INTEGER,

      // A route that throws during the build must fail the build loudly
      // rather than silently publish a blank page.
      onError(error) {
        throw error;
      },
    },
  );

  const reader = prelude.getReader();
  const decoder = new TextDecoder();
  let html = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
  }
  html += decoder.decode();
  return html;
}
