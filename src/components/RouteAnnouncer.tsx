/**
 * RouteAnnouncer — Invisible live-region that announces route changes
 * to screen readers. Uses ARIA live region to communicate page transitions.
 *
 * @returns {React.ReactElement} Hidden live-region element
 */
import { useMemo, type ReactElement } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/intelligence': 'Intelligence Feeds',
  '/directory': 'Resistance Directory',
  '/community': 'Community Support',
  '/education': 'Education Center',
  '/security': 'Security Center',
  '/prisoners': 'Political Prisoners',
  '/resources': 'Resistance Resources',
  '/take-action': 'Take Action',
  '/data-sources': 'Data Sources',
  '/profiles': 'Profiles',
};

/**
 * RouteAnnouncer — invisible live-region that announces route changes
 * to screen readers. Uses ARIA live region to communicate page transitions.
 *
 * @returns {ReactElement} Hidden live-region element
 */
export default function RouteAnnouncer(): ReactElement {
  const { pathname } = useLocation();

  const announcement = useMemo(() => {
    const label = ROUTE_LABELS[pathname] || 'Page';
    return `Navigated to ${label}`;
  }, [pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
