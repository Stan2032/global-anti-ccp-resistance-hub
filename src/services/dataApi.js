/**
 * Data API — Structured access to all research datasets
 *
 * Provides a unified interface for accessing the platform's verified
 * human rights data. All data is sourced from Tier 1-2 outlets
 * (BBC, Reuters, HRW, Amnesty, government records).
 *
 * Usage:
 *   import { dataApi } from '../services/dataApi';
 *   const prisoners = dataApi.getPoliticalPrisoners();
 *   const filtered = dataApi.searchPoliticalPrisoners('Hong Kong');
 *
 * @module dataApi
 */

// ── Type definitions ────────────────────────────────────
/**
 * @typedef {Object} PoliticalPrisoner
 * @property {string} id - Unique identifier (from input field)
 * @property {string} prisoner_name - Full name
 * @property {string} status - Current status (e.g., "imprisoned", "released", "disappeared")
 * @property {string} [location] - Detention location
 * @property {string} [sentence] - Sentence details
 * @property {string} [latest_news] - Most recent news about the case
 * @property {string} [health_status] - Current health information
 * @property {string} [international_response] - International community response
 * @property {string} source_url - Primary source URL
 * @property {string} [last_verified] - Date of last verification (YYYY-MM-DD)
 */

/**
 * @typedef {Object} Sanction
 * @property {string} country - Sanctioning country
 * @property {string} type - Type of sanction
 * @property {string} target - Sanctioned entity or person
 * @property {string} [role] - Role/position of the target
 * @property {string} reason - Reason for sanction
 * @property {string} date - Date imposed (YYYY-MM-DD)
 * @property {string} [law] - Legal basis
 * @property {string} [status] - Current status
 * @property {string} source_url - Primary source URL
 */

/**
 * @typedef {Object} SanctionedOfficial
 * @property {string} id - Unique identifier
 * @property {string} name - Full name
 * @property {string} position - Official position
 * @property {string} [responsibility_area] - Area of responsibility
 * @property {string[]} [key_abuses] - List of key abuses
 * @property {string} [current_status] - Current status
 * @property {string} source_url - Primary source URL
 */

/**
 * @typedef {Object} TimelineEvent
 * @property {string} date - Event date (YYYY-MM-DD)
 * @property {string} title - Event title
 * @property {string} [category] - Category (e.g., "hongkong", "uyghur", "tibet")
 * @property {string} [significance] - Significance level
 * @property {string} [description] - Detailed description
 * @property {string[]} [sources] - Source references
 */

/**
 * @typedef {Object} ForcedLaborCompany
 * @property {string} id - Unique identifier
 * @property {string} company - Company name
 * @property {string} [industry] - Industry sector
 * @property {string} [connection_type] - Type of forced labor connection
 * @property {string} [evidence] - Evidence details
 * @property {string} [uflpa_actions] - UFLPA enforcement actions
 * @property {string} [status] - Current status
 * @property {string} source_url - Primary source URL
 */

/**
 * @typedef {Object} DetentionFacility
 * @property {string} name - Facility name
 * @property {string} type - Facility type
 * @property {string} region - Geographic region
 * @property {string} [city] - City location
 * @property {Object} [coordinates] - Geographic coordinates
 * @property {number} coordinates.lat - Latitude
 * @property {number} coordinates.lng - Longitude
 * @property {number} [estimated_capacity] - Estimated capacity
 * @property {string} [status] - Current operational status
 * @property {string[]} [sources] - Source references
 */

/**
 * @typedef {Object} EmergencyAlert
 * @property {string} id - Alert identifier
 * @property {string} type - Alert type
 * @property {string} title - Alert title
 * @property {string} [summary] - Brief summary
 * @property {string} [date] - Alert date (YYYY-MM-DD)
 * @property {string} [eventDate] - Event date if different
 * @property {string} [expires] - Expiry date (YYYY-MM-DD)
 * @property {boolean} active - Whether alert is currently active
 */

/**
 * @typedef {Object} Statistic
 * @property {string} id - Statistic identifier
 * @property {string} label - Display label
 * @property {string|number} value - Statistical value
 * @property {string} [suffix] - Display suffix
 * @property {string} description - Description text
 * @property {string} [source] - Source name
 * @property {string} [sourceUrl] - Source URL
 * @property {string} [lastVerified] - Last verification date
 */

/**
 * @typedef {Object} InternationalResponse
 * @property {string} id - Unique identifier
 * @property {string} country - Country name
 * @property {string} [genocide_recognition] - Genocide recognition status
 * @property {string} [sanctions_imposed] - Sanctions imposed
 * @property {string} [legislative_actions] - Legislative actions taken
 * @property {string} [diplomatic_actions] - Diplomatic actions taken
 * @property {string} [pending_proposals] - Pending proposals
 * @property {string} [overall_stance] - Overall stance
 * @property {string} source_url - Primary source URL
 */

/**
 * @typedef {Object} HumanRightsOrg
 * @property {string} id - Unique identifier
 * @property {string} organization - Organization name
 * @property {string} [focus_area] - Primary focus area
 * @property {string} [org_type] - Organization type
 * @property {number} [founded_year] - Year founded
 * @property {string} [headquarters] - HQ location
 * @property {string} [website] - Official website
 * @property {string} [donation_url] - Donation page URL
 * @property {string} [key_work] - Key work description
 * @property {string} [credibility] - Credibility assessment
 * @property {string} source_url - Primary source URL
 */

/**
 * @typedef {Object} PoliceStation
 * @property {string} id - Unique identifier
 * @property {string} country - Host country
 * @property {string} city - City location
 * @property {string} [status] - Current status (e.g., "active", "closed")
 * @property {string} [closure_date] - Date closed if applicable
 * @property {boolean} [arrests_made] - Whether arrests were made
 * @property {string} [government_response] - Host government response
 * @property {string} [linked_to] - Linked CCP organization
 * @property {string} source_url - Primary source URL
 */

/**
 * @typedef {Object} LegalCase
 * @property {string} id - Unique identifier
 * @property {string} case_name - Case name
 * @property {string} jurisdiction - Legal jurisdiction
 * @property {string} [court] - Court name
 * @property {string} [defendant] - Defendant(s)
 * @property {string} [charges] - Charges filed
 * @property {string} [status] - Case status
 * @property {Object} [key_dates] - Important dates
 * @property {string} [outcome] - Case outcome
 * @property {string} [significance] - Significance description
 * @property {string} source_url - Primary source URL
 */

/**
 * @typedef {Object} DatasetSummary
 * @property {Object<string, {count: number, description: string, fields: string[]}>} datasets
 * @property {string} lastUpdated - Date of last update (YYYY-MM-DD)
 * @property {string} license - Data license
 * @property {string} sourcePolicy - Source policy description
 */

/**
 * @typedef {Object} GlobalSearchResults
 * @property {PoliticalPrisoner[]} political_prisoners
 * @property {Sanction[]} sanctions
 * @property {SanctionedOfficial[]} sanctioned_officials
 * @property {ForcedLaborCompany[]} forced_labor_companies
 * @property {TimelineEvent[]} timeline_events
 * @property {InternationalResponse[]} international_responses
 * @property {HumanRightsOrg[]} human_rights_orgs
 * @property {PoliceStation[]} police_stations
 * @property {LegalCase[]} legal_cases
 */

// ── Data imports ────────────────────────────────────────
import politicalPrisonersData from '../data/political_prisoners_research.json';
import sanctionsData from '../data/sanctions_tracker.json';
import officialsData from '../data/sanctioned_officials_research.json';
import timelineData from '../data/timeline_events.json';
import forcedLaborData from '../data/forced_labor_companies_research.json';
import detentionData from '../data/detention_facilities_research.json';
import emergencyAlertsData from '../data/emergency_alerts.json';
import liveStatisticsData from '../data/live_statistics.json';
import recentUpdatesData from '../data/recent_updates.json';
import internationalResponsesData from '../data/international_responses_research.json';
import humanRightsOrgsData from '../data/human_rights_orgs_research.json';
import policeStationsData from '../data/police_stations_research.json';
import legalCasesData from '../data/legal_cases_research.json';

// ── Helpers ─────────────────────────────────────────────

/**
 * Extract records from the { results: [{ input, output, error }] } wrapper
 * format used by many research JSON files.
 * @param {Object} data - Data object with results array
 * @returns {Object[]} Extracted records with id field added
 */
function extractResults(data) {
  const results = data?.results || [];
  return results
    .filter((r) => !r.error)
    .map((r) => ({
      id: r.input,
      ...r.output,
    }));
}

/**
 * Case-insensitive search across all string fields of an object.
 * @param {Object} obj - Object to search through
 * @param {string} query - Search query
 * @returns {boolean} Whether any string field matches the query
 */
function matchesSearch(obj, query) {
  if (!query) return true;
  const lower = query.toLowerCase();
  return Object.values(obj).some(
    (val) => typeof val === 'string' && val.toLowerCase().includes(lower)
  );
}

// ── Public API ──────────────────────────────────────────

export const dataApi = {
  // ── Metadata ────────────────────────────────────────
  /** @returns {DatasetSummary} Summary of all available datasets */
  getDatasetSummary() {
    return {
      datasets: {
        political_prisoners: {
          count: this.getPoliticalPrisoners().length,
          description: 'Documented cases of political detention in China',
          fields: ['prisoner_name', 'status', 'location', 'sentence', 'latest_news', 'health_status', 'international_response', 'source_url'],
        },
        sanctions: {
          count: this.getSanctions().length,
          description: 'International sanctions against CCP officials and entities',
          fields: ['country', 'type', 'target', 'role', 'reason', 'date', 'law', 'status', 'source_url'],
        },
        sanctioned_officials: {
          count: this.getSanctionedOfficials().length,
          description: 'CCP officials sanctioned by multiple countries',
          fields: ['name', 'position', 'responsibility_area', 'key_abuses', 'current_status', 'source_url'],
        },
        timeline_events: {
          count: this.getTimelineEvents().length,
          description: 'Chronological events documenting CCP human rights violations',
          fields: ['date', 'title', 'category', 'significance', 'description', 'sources'],
        },
        forced_labor_companies: {
          count: this.getForcedLaborCompanies().length,
          description: 'Companies linked to Uyghur forced labor supply chains',
          fields: ['company', 'industry', 'connection_type', 'evidence', 'uflpa_actions', 'status', 'source_url'],
        },
        detention_facilities: {
          count: this.getDetentionFacilities().length,
          description: 'Documented detention and re-education facilities',
          fields: ['name', 'type', 'region', 'city', 'coordinates', 'estimated_capacity', 'status', 'sources'],
        },
        emergency_alerts: {
          count: this.getActiveAlerts().length,
          description: 'Active emergency alerts and urgent cases',
          fields: ['type', 'title', 'summary', 'date', 'eventDate', 'expires', 'active'],
        },
        live_statistics: {
          count: this.getStatistics().length,
          description: 'Key statistics on CCP human rights violations',
          fields: ['label', 'value', 'suffix', 'description', 'source', 'sourceUrl'],
        },
        international_responses: {
          count: this.getInternationalResponses().length,
          description: 'Country-level responses to CCP human rights violations',
          fields: ['country', 'genocide_recognition', 'sanctions_imposed', 'legislative_actions', 'diplomatic_actions', 'pending_proposals', 'overall_stance', 'source_url'],
        },
        human_rights_orgs: {
          count: this.getHumanRightsOrgs().length,
          description: 'Verified human rights organizations working on China issues',
          fields: ['organization', 'focus_area', 'org_type', 'founded_year', 'headquarters', 'website', 'donation_url', 'key_work', 'credibility', 'latest_news', 'source_url'],
        },
        police_stations: {
          count: this.getPoliceStations().length,
          description: 'CCP overseas police service stations operating in foreign countries',
          fields: ['country', 'city', 'status', 'closure_date', 'arrests_made', 'government_response', 'linked_to', 'latest_news', 'source_url'],
        },
        legal_cases: {
          count: this.getLegalCases().length,
          description: 'Court cases and legal proceedings related to CCP human rights violations worldwide',
          fields: ['case_name', 'jurisdiction', 'court', 'defendant', 'charges', 'status', 'key_dates', 'outcome', 'significance', 'international_response', 'source_url'],
        },
      },
      lastUpdated: '2026-03-06',
      license: 'CC BY 4.0',
      sourcePolicy: 'Tier 1-2 sources only (BBC, Reuters, HRW, Amnesty, government records). CCP state media never cited.',
    };
  },

  // ── Political Prisoners ─────────────────────────────
  /** @returns {PoliticalPrisoner[]} All documented political prisoners */
  getPoliticalPrisoners() {
    return extractResults(politicalPrisonersData);
  },

  /**
   * Find a political prisoner by exact name match (case-insensitive).
   * @param {string} name - Prisoner name to find
   * @returns {PoliticalPrisoner|null} Matching prisoner or null
   */
  getPoliticalPrisonerByName(name) {
    return this.getPoliticalPrisoners().find(
      (p) => p.prisoner_name?.toLowerCase() === name.toLowerCase()
    ) || null;
  },

  /**
   * Search political prisoners across all text fields.
   * @param {string} query - Search query
   * @returns {PoliticalPrisoner[]} Matching prisoners
   */
  searchPoliticalPrisoners(query) {
    return this.getPoliticalPrisoners().filter((p) => matchesSearch(p, query));
  },

  /**
   * Filter prisoners by status (e.g., "imprisoned", "released").
   * @param {string} status - Status to filter by
   * @returns {PoliticalPrisoner[]} Prisoners with matching status
   */
  getPoliticalPrisonersByStatus(status) {
    return this.getPoliticalPrisoners().filter(
      (p) => p.status?.toLowerCase() === status.toLowerCase()
    );
  },

  // ── Sanctions ───────────────────────────────────────
  /** @returns {Sanction[]} All sanctions entries */
  getSanctions() {
    return sanctionsData?.sanctions || [];
  },

  /**
   * Filter sanctions by issuing country.
   * @param {string} country - Country name
   * @returns {Sanction[]} Sanctions from that country
   */
  getSanctionsByCountry(country) {
    return this.getSanctions().filter(
      (s) => s.country?.toLowerCase() === country.toLowerCase()
    );
  },

  /**
   * Search sanctions across all text fields.
   * @param {string} query - Search query
   * @returns {Sanction[]} Matching sanctions
   */
  searchSanctions(query) {
    return this.getSanctions().filter((s) => matchesSearch(s, query));
  },

  // ── Sanctioned Officials ────────────────────────────
  /** @returns {SanctionedOfficial[]} All sanctioned CCP officials */
  getSanctionedOfficials() {
    return extractResults(officialsData);
  },

  /**
   * Find a sanctioned official by exact name (case-insensitive).
   * @param {string} name - Official's name
   * @returns {SanctionedOfficial|null} Matching official or null
   */
  getSanctionedOfficialByName(name) {
    return this.getSanctionedOfficials().find(
      (o) => o.name?.toLowerCase() === name.toLowerCase()
    ) || null;
  },

  /**
   * Search sanctioned officials across all text fields.
   * @param {string} query - Search query
   * @returns {SanctionedOfficial[]} Matching officials
   */
  searchSanctionedOfficials(query) {
    return this.getSanctionedOfficials().filter((o) => matchesSearch(o, query));
  },

  // ── Timeline Events ─────────────────────────────────
  /** @returns {TimelineEvent[]} All chronological events */
  getTimelineEvents() {
    return timelineData || [];
  },

  /**
   * Filter timeline events by category.
   * @param {string} category - Category (e.g., "hongkong", "uyghur", "tibet")
   * @returns {TimelineEvent[]} Events in that category
   */
  getTimelineEventsByCategory(category) {
    return this.getTimelineEvents().filter(
      (e) => e.category?.toLowerCase() === category.toLowerCase()
    );
  },

  /**
   * Filter timeline events by significance level.
   * @param {string} significance - Significance level
   * @returns {TimelineEvent[]} Events with that significance
   */
  getTimelineEventsBySignificance(significance) {
    return this.getTimelineEvents().filter(
      (e) => e.significance?.toLowerCase() === significance.toLowerCase()
    );
  },

  /**
   * Get timeline events within a date range.
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {TimelineEvent[]} Events within the range
   */
  getTimelineEventsInRange(startDate, endDate) {
    return this.getTimelineEvents().filter(
      (e) => e.date >= startDate && e.date <= endDate
    );
  },

  // ── Forced Labor Companies ──────────────────────────
  /** @returns {ForcedLaborCompany[]} All companies linked to forced labor */
  getForcedLaborCompanies() {
    return extractResults(forcedLaborData);
  },

  /**
   * Filter forced labor companies by industry.
   * @param {string} industry - Industry sector
   * @returns {ForcedLaborCompany[]} Companies in that industry
   */
  getForcedLaborCompaniesByIndustry(industry) {
    return this.getForcedLaborCompanies().filter(
      (c) => c.industry?.toLowerCase() === industry.toLowerCase()
    );
  },

  /**
   * Search forced labor companies across all text fields.
   * @param {string} query - Search query
   * @returns {ForcedLaborCompany[]} Matching companies
   */
  searchForcedLaborCompanies(query) {
    return this.getForcedLaborCompanies().filter((c) => matchesSearch(c, query));
  },

  // ── Detention Facilities ────────────────────────────
  /** @returns {DetentionFacility[]} All documented detention facilities */
  getDetentionFacilities() {
    return detentionData?.facilities || [];
  },

  /**
   * Filter detention facilities by region.
   * @param {string} region - Geographic region
   * @returns {DetentionFacility[]} Facilities in that region
   */
  getDetentionFacilitiesByRegion(region) {
    return this.getDetentionFacilities().filter(
      (f) => f.region?.toLowerCase() === region.toLowerCase()
    );
  },

  /**
   * Filter detention facilities by type.
   * @param {string} type - Facility type
   * @returns {DetentionFacility[]} Facilities of that type
   */
  getDetentionFacilitiesByType(type) {
    return this.getDetentionFacilities().filter(
      (f) => f.type?.toLowerCase() === type.toLowerCase()
    );
  },

  // ── Emergency Alerts ────────────────────────────────
  /** @returns {EmergencyAlert[]} All emergency alerts (active and expired) */
  getAlerts() {
    return emergencyAlertsData || [];
  },

  /** @returns {EmergencyAlert[]} Currently active, non-expired alerts */
  getActiveAlerts() {
    const today = new Date().toISOString().split('T')[0];
    return this.getAlerts().filter(
      (a) => a.active && (!a.expires || a.expires >= today)
    );
  },

  /**
   * Find an alert by ID.
   * @param {string} id - Alert identifier
   * @returns {EmergencyAlert|null} Matching alert or null
   */
  getAlertById(id) {
    return this.getAlerts().find((a) => a.id === id) || null;
  },

  // ── Statistics ──────────────────────────────────────
  /** @returns {Statistic[]} All live statistics */
  getStatistics() {
    return liveStatisticsData || [];
  },

  /**
   * Find a statistic by ID.
   * @param {string} id - Statistic identifier
   * @returns {Statistic|null} Matching statistic or null
   */
  getStatisticById(id) {
    return this.getStatistics().find((s) => s.id === id) || null;
  },

  // ── Recent Updates ──────────────────────────────────
  /**
   * Get recent platform updates, optionally limited.
   * @param {number} [limit] - Maximum number of updates to return
   * @returns {Object[]} Recent updates
   */
  getRecentUpdates(limit) {
    const updates = recentUpdatesData || [];
    return limit ? updates.slice(0, limit) : updates;
  },

  /**
   * Filter recent updates by category.
   * @param {string} category - Update category
   * @returns {Object[]} Updates in that category
   */
  getRecentUpdatesByCategory(category) {
    return (recentUpdatesData || []).filter(
      (u) => u.category?.toLowerCase() === category.toLowerCase()
    );
  },

  // ── International Responses ──────────────────────────
  /** @returns {InternationalResponse[]} All country-level responses */
  getInternationalResponses() {
    return extractResults(internationalResponsesData);
  },

  /**
   * Find a country's international response by exact name (case-insensitive).
   * @param {string} country - Country name
   * @returns {InternationalResponse|null} Matching response or null
   */
  getInternationalResponseByCountry(country) {
    return this.getInternationalResponses().find(
      (r) => r.country?.toLowerCase() === country.toLowerCase()
    ) || null;
  },

  /**
   * Search international responses across all text fields.
   * @param {string} query - Search query
   * @returns {InternationalResponse[]} Matching responses
   */
  searchInternationalResponses(query) {
    return this.getInternationalResponses().filter((r) => matchesSearch(r, query));
  },

  // ── Human Rights Organizations ──────────────────────
  /** @returns {HumanRightsOrg[]} All verified human rights organizations */
  getHumanRightsOrgs() {
    return extractResults(humanRightsOrgsData);
  },

  /**
   * Filter organizations by focus area.
   * @param {string} focusArea - Focus area to filter by
   * @returns {HumanRightsOrg[]} Organizations with that focus
   */
  getHumanRightsOrgsByFocus(focusArea) {
    return this.getHumanRightsOrgs().filter(
      (o) => o.focus_area?.toLowerCase() === focusArea.toLowerCase()
    );
  },

  /**
   * Filter organizations by type.
   * @param {string} orgType - Organization type
   * @returns {HumanRightsOrg[]} Organizations of that type
   */
  getHumanRightsOrgsByType(orgType) {
    return this.getHumanRightsOrgs().filter(
      (o) => o.org_type?.toLowerCase().includes(orgType.toLowerCase())
    );
  },

  /**
   * Search organizations across all text fields.
   * @param {string} query - Search query
   * @returns {HumanRightsOrg[]} Matching organizations
   */
  searchHumanRightsOrgs(query) {
    return this.getHumanRightsOrgs().filter((o) => matchesSearch(o, query));
  },

  // ── Overseas Police Stations ───────────────────────────
  /** @returns {PoliceStation[]} All documented CCP overseas police stations */
  getPoliceStations() {
    return extractResults(policeStationsData);
  },

  /**
   * Filter police stations by host country.
   * @param {string} country - Country name
   * @returns {PoliceStation[]} Stations in that country
   */
  getPoliceStationsByCountry(country) {
    return this.getPoliceStations().filter(
      (s) => s.country?.toLowerCase() === country.toLowerCase()
    );
  },

  /**
   * Filter police stations by status.
   * @param {string} status - Station status (e.g., "active", "closed")
   * @returns {PoliceStation[]} Stations with that status
   */
  getPoliceStationsByStatus(status) {
    return this.getPoliceStations().filter(
      (s) => s.status?.toLowerCase() === status.toLowerCase()
    );
  },

  /**
   * Search police stations across all text fields.
   * @param {string} query - Search query
   * @returns {PoliceStation[]} Matching stations
   */
  searchPoliceStations(query) {
    return this.getPoliceStations().filter((s) => matchesSearch(s, query));
  },

  // ── Legal Cases ─────────────────────────────────────
  /** @returns {LegalCase[]} All documented legal cases */
  getLegalCases() {
    return extractResults(legalCasesData);
  },

  /**
   * Filter legal cases by jurisdiction.
   * @param {string} jurisdiction - Jurisdiction to filter by
   * @returns {LegalCase[]} Cases in that jurisdiction
   */
  getLegalCasesByJurisdiction(jurisdiction) {
    return this.getLegalCases().filter(
      (c) => c.jurisdiction?.toLowerCase().includes(jurisdiction.toLowerCase())
    );
  },

  /**
   * Filter legal cases by status.
   * @param {string} status - Case status
   * @returns {LegalCase[]} Cases with that status
   */
  getLegalCasesByStatus(status) {
    return this.getLegalCases().filter(
      (c) => c.status?.toLowerCase() === status.toLowerCase()
    );
  },

  /**
   * Search legal cases across all text fields.
   * @param {string} query - Search query
   * @returns {LegalCase[]} Matching cases
   */
  searchLegalCases(query) {
    return this.getLegalCases().filter((c) => matchesSearch(c, query));
  },

  // ── Cross-dataset queries ───────────────────────────
  /**
   * Global search across all datasets. Returns results grouped by dataset.
   * @param {string} query - Search query (minimum 2 characters)
   * @returns {GlobalSearchResults|{}} Results grouped by dataset, or empty object if query too short
   */
  globalSearch(query) {
    if (!query || query.trim().length < 2) return {};

    return {
      political_prisoners: this.searchPoliticalPrisoners(query),
      sanctions: this.searchSanctions(query),
      sanctioned_officials: this.searchSanctionedOfficials(query),
      forced_labor_companies: this.searchForcedLaborCompanies(query),
      timeline_events: this.getTimelineEvents().filter((e) => matchesSearch(e, query)),
      international_responses: this.searchInternationalResponses(query),
      human_rights_orgs: this.searchHumanRightsOrgs(query),
      police_stations: this.searchPoliceStations(query),
      legal_cases: this.searchLegalCases(query),
    };
  },

  /**
   * Get all data related to Hong Kong.
   * @returns {{prisoners: PoliticalPrisoner[], sanctions: Sanction[], timeline: TimelineEvent[], alerts: EmergencyAlert[]}}
   */
  getHongKongData() {
    return {
      prisoners: this.searchPoliticalPrisoners('Hong Kong'),
      sanctions: this.searchSanctions('Hong Kong'),
      timeline: this.getTimelineEventsByCategory('hongkong'),
      alerts: this.getAlerts().filter((a) =>
        a.title?.toLowerCase().includes('hong kong') ||
        a.id?.includes('hk') ||
        a.id?.includes('wong') ||
        a.id?.includes('lai')
      ),
    };
  },

  /**
   * Get all data related to Uyghur/Xinjiang issues.
   * @returns {{prisoners: PoliticalPrisoner[], companies: ForcedLaborCompany[], facilities: DetentionFacility[], sanctions: Sanction[], timeline: TimelineEvent[]}}
   */
  getUyghurData() {
    return {
      prisoners: this.searchPoliticalPrisoners('Uyghur'),
      companies: this.getForcedLaborCompanies(),
      facilities: this.getDetentionFacilities(),
      sanctions: this.searchSanctions('Uyghur'),
      timeline: this.getTimelineEventsByCategory('uyghur'),
    };
  },

  /**
   * Get a snapshot of all datasets for cross-referencing.
   * @returns {{prisoners: PoliticalPrisoner[], officials: SanctionedOfficial[], sanctions: Sanction[], cases: LegalCase[], companies: ForcedLaborCompany[], facilities: DetentionFacility[], stations: PoliceStation[], responses: InternationalResponse[], orgs: HumanRightsOrg[], timeline: TimelineEvent[]}}
   */
  getAllDatasets() {
    return {
      prisoners: this.getPoliticalPrisoners(),
      officials: this.getSanctionedOfficials(),
      sanctions: this.getSanctions(),
      cases: this.getLegalCases(),
      companies: this.getForcedLaborCompanies(),
      facilities: this.getDetentionFacilities(),
      stations: this.getPoliceStations(),
      responses: this.getInternationalResponses(),
      orgs: this.getHumanRightsOrgs(),
      timeline: this.getTimelineEvents(),
    };
  },
};

export default dataApi;
