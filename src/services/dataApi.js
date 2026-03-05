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

// ── Helpers ─────────────────────────────────────────────

/**
 * Extract records from the { results: [{ input, output, error }] } wrapper
 * format used by many research JSON files.
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
      },
      lastUpdated: '2026-03-05',
      license: 'CC BY 4.0',
      sourcePolicy: 'Tier 1-2 sources only (BBC, Reuters, HRW, Amnesty, government records). CCP state media never cited.',
    };
  },

  // ── Political Prisoners ─────────────────────────────
  getPoliticalPrisoners() {
    return extractResults(politicalPrisonersData);
  },

  getPoliticalPrisonerByName(name) {
    return this.getPoliticalPrisoners().find(
      (p) => p.prisoner_name?.toLowerCase() === name.toLowerCase()
    ) || null;
  },

  searchPoliticalPrisoners(query) {
    return this.getPoliticalPrisoners().filter((p) => matchesSearch(p, query));
  },

  getPoliticalPrisonersByStatus(status) {
    return this.getPoliticalPrisoners().filter(
      (p) => p.status?.toLowerCase() === status.toLowerCase()
    );
  },

  // ── Sanctions ───────────────────────────────────────
  getSanctions() {
    return sanctionsData?.sanctions || [];
  },

  getSanctionsByCountry(country) {
    return this.getSanctions().filter(
      (s) => s.country?.toLowerCase() === country.toLowerCase()
    );
  },

  searchSanctions(query) {
    return this.getSanctions().filter((s) => matchesSearch(s, query));
  },

  // ── Sanctioned Officials ────────────────────────────
  getSanctionedOfficials() {
    return extractResults(officialsData);
  },

  getSanctionedOfficialByName(name) {
    return this.getSanctionedOfficials().find(
      (o) => o.name?.toLowerCase() === name.toLowerCase()
    ) || null;
  },

  searchSanctionedOfficials(query) {
    return this.getSanctionedOfficials().filter((o) => matchesSearch(o, query));
  },

  // ── Timeline Events ─────────────────────────────────
  getTimelineEvents() {
    return timelineData || [];
  },

  getTimelineEventsByCategory(category) {
    return this.getTimelineEvents().filter(
      (e) => e.category?.toLowerCase() === category.toLowerCase()
    );
  },

  getTimelineEventsBySignificance(significance) {
    return this.getTimelineEvents().filter(
      (e) => e.significance?.toLowerCase() === significance.toLowerCase()
    );
  },

  getTimelineEventsInRange(startDate, endDate) {
    return this.getTimelineEvents().filter(
      (e) => e.date >= startDate && e.date <= endDate
    );
  },

  // ── Forced Labor Companies ──────────────────────────
  getForcedLaborCompanies() {
    return extractResults(forcedLaborData);
  },

  getForcedLaborCompaniesByIndustry(industry) {
    return this.getForcedLaborCompanies().filter(
      (c) => c.industry?.toLowerCase() === industry.toLowerCase()
    );
  },

  searchForcedLaborCompanies(query) {
    return this.getForcedLaborCompanies().filter((c) => matchesSearch(c, query));
  },

  // ── Detention Facilities ────────────────────────────
  getDetentionFacilities() {
    return detentionData?.facilities || [];
  },

  getDetentionFacilitiesByRegion(region) {
    return this.getDetentionFacilities().filter(
      (f) => f.region?.toLowerCase() === region.toLowerCase()
    );
  },

  getDetentionFacilitiesByType(type) {
    return this.getDetentionFacilities().filter(
      (f) => f.type?.toLowerCase() === type.toLowerCase()
    );
  },

  // ── Emergency Alerts ────────────────────────────────
  getAlerts() {
    return emergencyAlertsData || [];
  },

  getActiveAlerts() {
    const today = new Date().toISOString().split('T')[0];
    return this.getAlerts().filter(
      (a) => a.active && (!a.expires || a.expires >= today)
    );
  },

  getAlertById(id) {
    return this.getAlerts().find((a) => a.id === id) || null;
  },

  // ── Statistics ──────────────────────────────────────
  getStatistics() {
    return liveStatisticsData || [];
  },

  getStatisticById(id) {
    return this.getStatistics().find((s) => s.id === id) || null;
  },

  // ── Recent Updates ──────────────────────────────────
  getRecentUpdates(limit) {
    const updates = recentUpdatesData || [];
    return limit ? updates.slice(0, limit) : updates;
  },

  getRecentUpdatesByCategory(category) {
    return (recentUpdatesData || []).filter(
      (u) => u.category?.toLowerCase() === category.toLowerCase()
    );
  },

  // ── International Responses ──────────────────────────
  getInternationalResponses() {
    return extractResults(internationalResponsesData);
  },

  getInternationalResponseByCountry(country) {
    return this.getInternationalResponses().find(
      (r) => r.country?.toLowerCase() === country.toLowerCase()
    ) || null;
  },

  searchInternationalResponses(query) {
    return this.getInternationalResponses().filter((r) => matchesSearch(r, query));
  },

  // ── Cross-dataset queries ───────────────────────────
  /**
   * Global search across all datasets. Returns results grouped by dataset.
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
    };
  },

  /**
   * Get all data related to Hong Kong.
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
};

export default dataApi;
