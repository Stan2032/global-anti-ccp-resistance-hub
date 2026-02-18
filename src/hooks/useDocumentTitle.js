import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES = {
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

const BASE_TITLE = 'Global Anti-CCP Resistance Hub';

export default function useDocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = ROUTE_TITLES[location.pathname];
    document.title = pageTitle ? `${pageTitle} | ${BASE_TITLE}` : BASE_TITLE;
  }, [location.pathname]);
}
