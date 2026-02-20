import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_META = {
  '/': {
    title: 'Dashboard',
    description: 'Global coordination hub tracking CCP human rights abuses, political prisoners, and resistance movements worldwide.',
  },
  '/intelligence': {
    title: 'Intelligence Feeds',
    description: 'Live news aggregation from verified sources covering CCP human rights abuses, Hong Kong, Tibet, Xinjiang, and Taiwan.',
  },
  '/directory': {
    title: 'Resistance Directory',
    description: 'Directory of verified human rights organizations fighting CCP authoritarianism worldwide.',
  },
  '/campaigns': {
    title: 'Campaign Hubs',
    description: 'Active campaigns for human rights in China, Hong Kong, Tibet, and Xinjiang. Join petitions, letter-writing, and awareness efforts.',
  },
  '/community': {
    title: 'Community Support',
    description: 'Connect with diaspora communities, find support resources, and join solidarity efforts against CCP repression.',
  },
  '/communications': {
    title: 'Secure Communications',
    description: 'Secure communication tools and guides for activists operating under CCP surveillance and censorship.',
  },
  '/education': {
    title: 'Education Center',
    description: 'Educational resources about CCP human rights abuses including documentaries, books, research papers, and interactive courses.',
  },
  '/security': {
    title: 'Security Center',
    description: 'Digital security tools, VPN guides, and privacy resources for activists at risk of CCP surveillance.',
  },
  '/prisoners': {
    title: 'Political Prisoners',
    description: 'Database of political prisoners detained by the CCP including Jimmy Lai, Ilham Tohti, and 60+ verified cases with source links.',
  },
  '/threats': {
    title: 'Regional Threats',
    description: 'Tracking CCP military expansion, territorial aggression, overseas police stations, and influence operations across the Indo-Pacific.',
  },
  '/resources': {
    title: 'Resistance Resources',
    description: 'Comprehensive toolkit for activists: company trackers, forced labor data, academic experts, legal resources, and media bias guides.',
  },
  '/tactics': {
    title: 'CCP Tactics',
    description: 'Documented CCP tactics: transnational repression, surveillance, media manipulation, Confucius Institutes, and sanctions tracker.',
  },
  '/take-action': {
    title: 'Take Action',
    description: 'Eight concrete ways to fight CCP authoritarianism: petitions, boycotts, contacting representatives, and more.',
  },
  '/data-sources': {
    title: 'Data Sources',
    description: 'Transparency page listing all data sources used by the platform including HRW, Amnesty, ASPI, and government records.',
  },
  '/profiles/jimmy-lai': {
    title: 'Jimmy Lai — Profile',
    description: 'Detailed profile of Jimmy Lai (黎智英): Apple Daily founder sentenced to 20 years under Hong Kong NSL. Complete timeline, charges, CCP narrative analysis, and verified sources.',
  },
  '/profiles/ilham-tohti': {
    title: 'Ilham Tohti — Profile',
    description: 'Detailed profile of Ilham Tohti (伊力哈木·土赫提): Uyghur economist sentenced to life for "separatism" despite advocating dialogue. Sakharov Prize laureate. Timeline, charges, CCP narrative analysis.',
  },
};

const BASE_TITLE = 'Global Anti-CCP Resistance Hub';
const BASE_DESCRIPTION = 'Join the global movement against CCP authoritarianism. Track political prisoners, access live intelligence, and take action to defend human rights.';

export default function useDocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    const meta = ROUTE_META[location.pathname];
    document.title = meta ? `${meta.title} | ${BASE_TITLE}` : BASE_TITLE;

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', meta?.description || BASE_DESCRIPTION);
    }
  }, [location.pathname]);
}
