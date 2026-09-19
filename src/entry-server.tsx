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
 * ~80 lazily-loaded components would have been emitted as its `$ loading`
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
  // Two passes. The app's ~80 route and section components are React.lazy,
  // so on a cold pass every boundary suspends and prerender emits the
  // `$ loading` fallback into the shell instead of the content. The first
  // pass exists only to kick those dynamic imports off and let them settle;
  // by the second pass React.lazy resolves synchronously and the real markup
  // lands in the HTML. The discarded pass is why this is still sub-second.
  await warmLazyComponents(url);

  const { prelude } = await prerender(
    <AppProviders>
      <StaticRouter location={url}>
        <AppLayout />
      </StaticRouter>
    </AppProviders>,
    {
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

/**
 * Render once and throw the result away, so every React.lazy boundary on the
 * route has started (and finished) its dynamic import before the real pass.
 *
 * Errors are swallowed deliberately: this pass exists only for its side
 * effect on the module cache. Anything genuinely broken will surface in the
 * real render, where onError rethrows and fails the build.
 */
async function warmLazyComponents(url: string): Promise<void> {
  for (let pass = 0; pass < 3; pass++) {
    try {
      const { prelude } = await prerender(
        <AppProviders>
          <StaticRouter location={url}>
            <AppLayout />
          </StaticRouter>
        </AppProviders>,
        { onError() {} },
      );
      // Drain so the render actually completes rather than being abandoned.
      const reader = prelude.getReader();
      let text = '';
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
      }
      // Once no boundary falls back, everything the route needs is loaded.
      if (!text.includes('$ loading')) return;
    } catch {
      return;
    }
  }
}
