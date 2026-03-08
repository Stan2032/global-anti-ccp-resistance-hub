import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs — shows current location hierarchy.
 * Helps users navigate back through the site structure.
 * Auto-generates breadcrumbs from the current URL path.
 *
 * @returns {React.ReactElement|null} Breadcrumb navigation or null for root
 */

const ROUTE_LABELS = {
  '': 'Dashboard',
  'intelligence': 'Intelligence',
  'prisoners': 'Political Prisoners',
  'profiles': 'Profiles',
  'take-action': 'Take Action',
  'education': 'Education',
  'security': 'Security',
  'directory': 'Directory',
  'community': 'Community',
  'resources': 'Resources',
  'data-sources': 'Data Sources',
  'admin': 'Admin',
  'login': 'Login',
  // Profile slugs
  'jimmy-lai': 'Jimmy Lai',
  'ilham-tohti': 'Ilham Tohti',
  'panchen-lama': 'Panchen Lama',
  'liu-xiaobo': 'Liu Xiaobo',
  'joshua-wong': 'Joshua Wong',
  'gui-minhai': 'Gui Minhai',
  'zhang-zhan': 'Zhang Zhan',
  'gao-zhisheng': 'Gao Zhisheng',
  'benny-tai': 'Benny Tai',
  'nathan-law': 'Nathan Law',
  'cardinal-zen': 'Cardinal Zen',
  'agnes-chow': 'Agnes Chow',
  'tashi-wangchuk': 'Tashi Wangchuk',
  'ren-zhiqiang': 'Ren Zhiqiang',
  'xu-zhiyong': 'Xu Zhiyong',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on the dashboard (root)
  if (pathSegments.length === 0) return null;

  const crumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = ROUTE_LABELS[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const isLast = index === pathSegments.length - 1;
    return { path, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-xs font-mono text-slate-400 flex-wrap">
        <li>
          <Link to="/" className="flex items-center gap-1 hover:text-[#4afa82] transition-colors" aria-label="Dashboard">
            <Home className="w-3 h-3" />
            <span className="hidden sm:inline">home</span>
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.path} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-slate-600" aria-hidden="true" />
            {crumb.isLast ? (
              <span className="text-slate-300" aria-current="page">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="hover:text-[#4afa82] transition-colors">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
