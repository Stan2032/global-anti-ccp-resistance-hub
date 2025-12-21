// Research Data - Generated from Wide Research parallel processing
// Last updated: December 2024

import politicalPrisonersData from './political_prisoners_research.json';
import recentNewsData from './recent_news_research.json';
import policeStationsData from './police_stations_research.json';

// Process political prisoners data
export const politicalPrisoners = politicalPrisonersData.results.map(item => ({
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
export const recentNews = recentNewsData.results.map(item => ({
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
export const policeStations = policeStationsData.results.map(item => ({
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
export const researchStats = {
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
