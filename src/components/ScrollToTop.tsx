/**
 * ScrollToTop — Resets scroll position when the reader moves to another page.
 *
 * On an in-app route change, scrolls the window to the top and moves
 * focus to the main content area so screen-reader users are aware of the
 * navigation.
 *
 * @module ScrollToTop
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — scrolls window to top on every in-app route change and
 * moves focus to the main content area so screen-reader users are aware
 * of the navigation.
 *
 * The page the reader arrives on is left alone. The browser has already
 * placed them: at the top, or at the #fragment their link named, which a
 * scroll to the top would undo. Moving focus to <main> there would also
 * put keyboard users past the skip links and the header on every page
 * they open.
 *
 * @returns {null} Renders nothing (side-effect only)
 */
export default function ScrollToTop(): null {
  const { pathname } = useLocation();
  const shownPathname = useRef(pathname);

  useEffect(() => {
    // Nothing has changed yet on the first render, nor on StrictMode's
    // second run of it.
    if (shownPathname.current === pathname) return;
    shownPathname.current = pathname;

    window.scrollTo(0, 0);

    // After scroll, move focus to the main content region so assistive
    // technology announces the new page.  We use a small timeout to
    // allow Suspense fallbacks to settle.
    const timer = setTimeout(() => {
      const main = document.getElementById('main-content');
      if (main) {
        // tabIndex -1 makes the element programmatically focusable
        // without adding it to the natural tab order.
        if (!main.hasAttribute('tabindex')) {
          main.setAttribute('tabindex', '-1');
        }
        main.focus({ preventScroll: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
