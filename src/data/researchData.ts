// Research Data - Generated from Wide Research parallel processing
// Last updated: December 2024

import politicalPrisonersData from './political_prisoners_research.json';
import recentNewsData from './recent_news_research.json';
import policeStationsData from './police_stations_research.json';

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

// Process political prisoners data
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

// Process recent news data
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

// Process police stations data
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

// Statistics
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
