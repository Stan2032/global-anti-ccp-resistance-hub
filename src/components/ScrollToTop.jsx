import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top on every route change and moves focus
 * to the main content area so screen-reader users are aware of the
 * navigation.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
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
