/**
 * Centralized Statistics & Facts
 *
 * Single source of truth for frequently cited statistics across the site.
 * Components should import from here instead of hardcoding numbers.
 *
 * Each statistic includes:
 *   - value: the displayable number/range
 *   - context: brief explanatory text
 *   - sources: array of credible sources
 *   - lastVerified: date the statistic was last fact-checked
 *
 * When updating a statistic, change it HERE and it updates everywhere.
 */

export const STATISTICS = {
  uyghurDetention: {
    value: '1-3 million',
    context: 'Uyghurs and other Turkic Muslims detained in internment camps since 2017',
    sources: ['ASPI', 'CECC', 'Xinjiang Police Files', 'Adrian Zenz research', 'UHRP'],
    lastVerified: '2026-02-26',
  },

  surveillanceCameras: {
    value: '600+ million',
    context: 'cameras in China\'s Skynet and Sharp Eyes surveillance networks',
    sources: ['Human Rights Watch', 'ASPI', 'Comparitech'],
    lastVerified: '2026-02-26',
  },

  overseasPoliceStations: {
    value: '100+',
    context: 'CCP overseas police stations identified in 53 countries',
    sources: ['Safeguard Defenders', 'FBI', 'European Parliament'],
    lastVerified: '2026-02-26',
  },

  hongKong47: {
    value: '47',
    context: 'pro-democracy activists prosecuted under the National Security Law',
    sources: ['Hong Kong Free Press', 'BBC', 'Reuters'],
    lastVerified: '2026-02-26',
  },

  confuciusInstitutes: {
    value: '500+',
    context: 'Confucius Institutes established worldwide (many now closed)',
    sources: ['National Association of Scholars', 'ASPI', 'US Senate Report'],
    lastVerified: '2026-02-26',
  },

  tiananmenYear: {
    value: '1989',
    context: 'Tiananmen Square massacre — peaceful pro-democracy protests violently suppressed',
    sources: ['Declassified UK cables', 'Amnesty International', 'HRIC'],
    lastVerified: '2026-02-26',
  },

  organHarvesting: {
    value: 'proven beyond reasonable doubt',
    context: 'China Tribunal (2019) found forced organ harvesting from prisoners of conscience',
    sources: ['China Tribunal', 'ETAC', 'Doctors Against Forced Organ Harvesting'],
    lastVerified: '2026-02-26',
  },

  forcedLabor: {
    value: '1+ million',
    context: 'Uyghurs estimated to be in forced labor programs linked to global supply chains',
    sources: ['ASPI', 'UFLPA enforcement data', 'Sheffield Hallam University'],
    lastVerified: '2026-02-26',
  },

  socialCreditSystem: {
    value: '1.4 billion',
    context: 'citizens subject to social credit system tracking behavior and compliance',
    sources: ['Human Rights Watch', 'Freedom House', 'MIT Technology Review'],
    lastVerified: '2026-02-26',
  },

  greatFirewall: {
    value: 'Google, Facebook, Twitter, Wikipedia',
    context: 'major platforms blocked by the Great Firewall of China',
    sources: ['Citizen Lab', 'GreatFire.org', 'Freedom House'],
    lastVerified: '2026-02-26',
  },
};

/**
 * Helper to format a statistic for display.
 * Returns a string like "1-3 million Uyghurs detained"
 */
export function formatStat(key) {
  const stat = STATISTICS[key];
  if (!stat) return '';
  return `${stat.value} ${stat.context}`;
}

/**
 * Get the source list for a statistic.
 */
export function getStatSources(key) {
  const stat = STATISTICS[key];
  return stat ? stat.sources : [];
}

export default STATISTICS;
