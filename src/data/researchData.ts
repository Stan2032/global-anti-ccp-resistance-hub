/**
 * Research data module — transforms raw JSON research data into typed arrays.
 *
 * Processes political prisoners, news, and police stations data from parallel
 * research JSON files into typed exports with camelCase fields.
 *
 * @module researchData
 */

import politicalPrisonersData from './political_prisoners_research.json';
import recentNewsData from './recent_news_research.json';
import policeStationsData from './police_stations_research.json';

/** Typed political prisoner record with camelCase field names. */
export interface PoliticalPrisoner {
  name: string;
  status: string;
  location: string;
  sentence: string;
  latestNews: string;
  healthStatus: string;
  internationalResponse: string;
  sourceUrl: string;
  confidence: string;
}

/** Typed news item record with camelCase field names. */
export interface NewsItem {
  topic: string;
  headline: string;
  summary: string;
  date: string;
  source: string;
  sourceUrl: string;
  significance: string;
  relatedPrisoners: string | string[];
  internationalResponse: string;
  actionNeeded: string;
}

/** Typed overseas police station record with camelCase field names. */
export interface PoliceStation {
  country: string;
  city: string;
  address: string;
  status: string;
  closureDate: string;
  arrestsMade: string;
  arrestDetails: string;
  governmentResponse: string;
  linkedTo: string;
  latestNews: string;
  sourceUrl: string;
}

/** Aggregate statistics computed from all research datasets. */
export interface ResearchStats {
  totalPrisoners: number;
  prisonersByStatus: {
    detained: number;
    released: number;
    disappeared: number;
    deceased: number;
    exile: number;
    atRisk: number;
  };
  totalNewsTopics: number;
  highSignificanceNews: number;
  totalPoliceStations: number;
  stationsByStatus: {
    closed: number;
    underInvestigation: number;
    operating: number;
    unknown: number;
  };
  lastUpdated: string;
}

/** Processed political prisoner records (mapped from JSON output fields). */
export const politicalPrisoners: PoliticalPrisoner[] = politicalPrisonersData.results.map(item => ({
  name: item.output.prisoner_name,
  status: item.output.status,
  location: item.output.location,
  sentence: item.output.sentence,
  latestNews: item.output.latest_news,
  healthStatus: item.output.health_status,
  internationalResponse: item.output.international_response,
  sourceUrl: item.output.source_url,
  confidence: item.output.confidence
}));

/** Processed recent news items (mapped from JSON output fields). */
export const recentNews: NewsItem[] = recentNewsData.results.map(item => ({
  topic: item.output.topic,
  headline: item.output.headline,
  summary: item.output.summary,
  date: item.output.date,
  source: item.output.source,
  sourceUrl: item.output.source_url,
  significance: item.output.significance,
  relatedPrisoners: item.output.related_prisoners,
  internationalResponse: item.output.international_response,
  actionNeeded: item.output.action_needed
}));

/** Processed overseas police station records (mapped from JSON output fields). */
export const policeStations: PoliceStation[] = policeStationsData.results.map(item => ({
  country: item.output.country,
  city: item.output.city,
  address: item.output.address,
  status: item.output.status,
  closureDate: item.output.closure_date,
  arrestsMade: item.output.arrests_made,
  arrestDetails: item.output.arrest_details,
  governmentResponse: item.output.government_response,
  linkedTo: item.output.linked_to,
  latestNews: item.output.latest_news,
  sourceUrl: item.output.source_url
}));

/** Live aggregate statistics computed from all research datasets. */
export const researchStats: ResearchStats = {
  totalPrisoners: politicalPrisoners.length,
  prisonersByStatus: {
    detained: politicalPrisoners.filter(p => p.status === 'DETAINED').length,
    released: politicalPrisoners.filter(p => p.status === 'RELEASED').length,
    disappeared: politicalPrisoners.filter(p => p.status === 'DISAPPEARED').length,
    deceased: politicalPrisoners.filter(p => p.status === 'DECEASED').length,
    exile: politicalPrisoners.filter(p => p.status === 'EXILE').length,
    atRisk: politicalPrisoners.filter(p => p.status === 'AT RISK').length
  },
  totalNewsTopics: recentNews.length,
  highSignificanceNews: recentNews.filter(n => n.significance === 'HIGH').length,
  totalPoliceStations: policeStations.length,
  stationsByStatus: {
    closed: policeStations.filter(s => s.status === 'CLOSED').length,
    underInvestigation: policeStations.filter(s => s.status === 'UNDER INVESTIGATION').length,
    operating: policeStations.filter(s => s.status === 'OPERATING').length,
    unknown: policeStations.filter(s => s.status === 'UNKNOWN').length
  },
  lastUpdated: new Date().toISOString()
};

export default {
  politicalPrisoners,
  recentNews,
  policeStations,
  researchStats
};
