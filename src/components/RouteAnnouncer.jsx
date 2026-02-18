import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_LABELS = {
  '/': 'Dashboard',
  '/intelligence': 'Intelligence Feeds',
  '/directory': 'Resistance Directory',
  '/campaigns': 'Campaign Hubs',
  '/community': 'Community Support',
  '/communications': 'Secure Communications',
  '/education': 'Education Center',
  '/security': 'Security Center',
  '/prisoners': 'Political Prisoners',
  '/threats': 'Regional Threats',
  '/resources': 'Resistance Resources',
  '/tactics': 'CCP Tactics',
  '/take-action': 'Take Action',
  '/data-sources': 'Data Sources',
};

/**
 * Invisible live-region that announces route changes to screen readers.
 */
export default function RouteAnnouncer() {
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
