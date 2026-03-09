/**
 * Data API — Structured access to all research datasets
 *
 * Provides a unified interface for accessing the platform's verified
 * human rights data. All data is sourced from Tier 1–2 outlets
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

export interface PoliticalPrisoner {
  /** Unique identifier (from input field) */
  id: string;
  prisoner_name: string;
  status: string;
  location?: string;
  sentence?: string;
  latest_news?: string;
  health_status?: string;
  international_response?: string;
  source_url: string;
  last_verified?: string;
  [key: string]: unknown;
}

export interface Sanction {
  country: string;
  type: string;
  target: string;
  role?: string;
  reason: string;
  date: string;
  law?: string;
  status?: string;
  source_url: string;
  [key: string]: unknown;
}

export interface SanctionedOfficial {
  id: string;
  name: string;
  position: string;
  responsibility_area?: string;
  key_abuses?: string[];
  current_status?: string;
  source_url: string;
  [key: string]: unknown;
}

export interface TimelineEvent {
  date: string;
  title: string;
  category?: string;
  significance?: string;
  description?: string;
  sources?: string[];
  [key: string]: unknown;
}

export interface ForcedLabourCompany {
  id: string;
  company: string;
  industry?: string;
  connection_type?: string;
  evidence?: string;
  uflpa_actions?: string;
  company_response?: string;
  status?: string;
  source_url: string;
  [key: string]: unknown;
}

export interface DetentionFacility {
  name: string;
  type: string;
  region: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
  estimated_capacity?: number;
  status?: string;
  sources?: string[];
  [key: string]: unknown;
}

export interface EmergencyAlert {
  id: string;
  type: string;
  title: string;
  summary?: string;
  date?: string;
  eventDate?: string;
  expires?: string;
  active: boolean;
  [key: string]: unknown;
}

export interface Statistic {
  id: string;
  label: string;
  value: string | number;
  suffix?: string;
  description: string;
  source?: string;
  sourceUrl?: string;
  lastVerified?: string;
  [key: string]: unknown;
}

export interface InternationalResponse {
  id: string;
  country: string;
  genocide_recognition?: string;
  sanctions_imposed?: string;
  legislative_actions?: string;
  diplomatic_actions?: string;
  pending_proposals?: string;
  overall_stance?: string;
  source_url: string;
  [key: string]: unknown;
}

export interface HumanRightsOrg {
  id: string;
  organization: string;
  focus_area?: string;
  org_type?: string;
  founded_year?: number;
  headquarters?: string;
  website?: string;
  donation_url?: string;
  key_work?: string;
  credibility?: string;
  latest_news?: string;
  source_url: string;
  [key: string]: unknown;
}

export interface PoliceStation {
  id: string;
  country: string;
  city: string;
  status?: string;
  closure_date?: string;
  arrests_made?: boolean;
  government_response?: string;
  linked_to?: string;
  source_url: string;
  [key: string]: unknown;
}

export interface LegalCase {
  id: string;
  case_name: string;
  jurisdiction: string;
  court?: string;
  defendant?: string;
  charges?: string;
  status?: string;
  key_dates?: Record<string, unknown>;
  outcome?: string;
  significance?: string;
  source_url: string;
  [key: string]: unknown;
}

/** Summary of a single dataset. */
export interface DatasetInfo {
  count: number;
  description: string;
  fields: string[];
}

/** Summary of all available datasets. */
export interface DatasetSummary {
  datasets: Record<string, DatasetInfo>;
  lastUpdated: string;
  license: string;
  sourcePolicy: string;
}

/** Results grouped by dataset from a global search. */
export interface GlobalSearchResults {
  political_prisoners: PoliticalPrisoner[];
  sanctions: Sanction[];
  sanctioned_officials: SanctionedOfficial[];
  forced_labor_companies: ForcedLabourCompany[];
  timeline_events: TimelineEvent[];
  international_responses: InternationalResponse[];
  human_rights_orgs: HumanRightsOrg[];
  police_stations: PoliceStation[];
  legal_cases: LegalCase[];
}

/** Convenience type for a recent-update record. */
export interface RecentUpdate {
  category?: string;
  [key: string]: unknown;
}

/** Shape of a Hong Kong cross-dataset result. */
export interface HongKongData {
  prisoners: PoliticalPrisoner[];
  sanctions: Sanction[];
  timeline: TimelineEvent[];
  alerts: EmergencyAlert[];
}

/** Shape of a Uyghur/Xinjiang cross-dataset result. */
export interface UyghurData {
  prisoners: PoliticalPrisoner[];
  companies: ForcedLabourCompany[];
  facilities: DetentionFacility[];
  sanctions: Sanction[];
  timeline: TimelineEvent[];
}

/** Snapshot of every dataset for cross-referencing. */
export interface AllDatasets {
  prisoners: PoliticalPrisoner[];
  officials: SanctionedOfficial[];
  sanctions: Sanction[];
  cases: LegalCase[];
  companies: ForcedLabourCompany[];
  facilities: DetentionFacility[];
  stations: PoliceStation[];
  responses: InternationalResponse[];
  orgs: HumanRightsOrg[];
  timeline: TimelineEvent[];
}

/** Wrapper format used by many research JSON files. */
interface ResearchJsonWrapper {
  results?: Array<{ input: string; output?: Record<string, unknown>; error?: unknown }>;
}

/** Sanctions tracker JSON shape. */
interface SanctionsJsonWrapper {
  sanctions?: Sanction[];
}

/** Detention facilities JSON shape. */
interface DetentionJsonWrapper {
  facilities?: DetentionFacility[];
}

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
 */
function extractResults(data: unknown): Array<Record<string, unknown>> {
  const results = (data as ResearchJsonWrapper)?.results || [];
  return results
    .filter((r) => !r.error)
    .map((r) => ({
      id: r.input,
      ...r.output,
    }));
}

/** Case-insensitive search across all string fields of an object. */
function matchesSearch(obj: Record<string, unknown>, query: string): boolean {
  if (!query) return true;
  const lower = query.toLowerCase();
  return Object.values(obj).some(
    (val) => typeof val === 'string' && val.toLowerCase().includes(lower)
  );
}

// ── Public API ──────────────────────────────────────────

export const dataApi = {
  // ── Metadata ────────────────────────────────────────
  getDatasetSummary(): DatasetSummary {
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
          description: 'Companies linked to Uyghur forced labour supply chains',
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
          description: 'Verified human rights organisations working on China issues',
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
  getPoliticalPrisoners(): PoliticalPrisoner[] {
    return extractResults(politicalPrisonersData) as unknown as PoliticalPrisoner[];
  },

  /** Find a political prisoner by exact name match (case-insensitive). */
  getPoliticalPrisonerByName(name: string): PoliticalPrisoner | null {
    return this.getPoliticalPrisoners().find(
      (p) => p.prisoner_name?.toLowerCase() === name.toLowerCase()
    ) || null;
  },

  /** Search political prisoners across all text fields. */
  searchPoliticalPrisoners(query: string): PoliticalPrisoner[] {
    return this.getPoliticalPrisoners().filter((p) => matchesSearch(p as unknown as Record<string, unknown>, query));
  },

  /** Filter prisoners by status (e.g. "imprisoned", "released"). */
  getPoliticalPrisonersByStatus(status: string): PoliticalPrisoner[] {
    return this.getPoliticalPrisoners().filter(
      (p) => p.status?.toLowerCase() === status.toLowerCase()
    );
  },

  // ── Sanctions ───────────────────────────────────────
  getSanctions(): Sanction[] {
    return (sanctionsData as unknown as SanctionsJsonWrapper)?.sanctions || [];
  },

  /** Filter sanctions by issuing country. */
  getSanctionsByCountry(country: string): Sanction[] {
    return this.getSanctions().filter(
      (s) => s.country?.toLowerCase() === country.toLowerCase()
    );
  },

  /** Search sanctions across all text fields. */
  searchSanctions(query: string): Sanction[] {
    return this.getSanctions().filter((s) => matchesSearch(s as unknown as Record<string, unknown>, query));
  },

  // ── Sanctioned Officials ────────────────────────────
  getSanctionedOfficials(): SanctionedOfficial[] {
    return extractResults(officialsData) as unknown as SanctionedOfficial[];
  },

  /** Find a sanctioned official by exact name (case-insensitive). */
  getSanctionedOfficialByName(name: string): SanctionedOfficial | null {
    return this.getSanctionedOfficials().find(
      (o) => o.name?.toLowerCase() === name.toLowerCase()
    ) || null;
  },

  /** Search sanctioned officials across all text fields. */
  searchSanctionedOfficials(query: string): SanctionedOfficial[] {
    return this.getSanctionedOfficials().filter((o) => matchesSearch(o as unknown as Record<string, unknown>, query));
  },

  // ── Timeline Events ─────────────────────────────────
  getTimelineEvents(): TimelineEvent[] {
    return (timelineData || []) as unknown as TimelineEvent[];
  },

  /** Filter timeline events by category. */
  getTimelineEventsByCategory(category: string): TimelineEvent[] {
    return this.getTimelineEvents().filter(
      (e) => e.category?.toLowerCase() === category.toLowerCase()
    );
  },

  /** Filter timeline events by significance level. */
  getTimelineEventsBySignificance(significance: string): TimelineEvent[] {
    return this.getTimelineEvents().filter(
      (e) => e.significance?.toLowerCase() === significance.toLowerCase()
    );
  },

  /** Get timeline events within a date range. */
  getTimelineEventsInRange(startDate: string, endDate: string): TimelineEvent[] {
    return this.getTimelineEvents().filter(
      (e) => e.date >= startDate && e.date <= endDate
    );
  },

  // ── Forced Labour Companies ──────────────────────────
  getForcedLaborCompanies(): ForcedLabourCompany[] {
    return extractResults(forcedLaborData) as unknown as ForcedLabourCompany[];
  },

  /** Filter forced labour companies by industry. */
  getForcedLaborCompaniesByIndustry(industry: string): ForcedLabourCompany[] {
    return this.getForcedLaborCompanies().filter(
      (c) => c.industry?.toLowerCase() === industry.toLowerCase()
    );
  },

  /** Search forced labour companies across all text fields. */
  searchForcedLaborCompanies(query: string): ForcedLabourCompany[] {
    return this.getForcedLaborCompanies().filter((c) => matchesSearch(c as unknown as Record<string, unknown>, query));
  },

  // ── Detention Facilities ────────────────────────────
  getDetentionFacilities(): DetentionFacility[] {
    return (detentionData as unknown as DetentionJsonWrapper)?.facilities || [];
  },

  /** Filter detention facilities by region. */
  getDetentionFacilitiesByRegion(region: string): DetentionFacility[] {
    return this.getDetentionFacilities().filter(
      (f) => f.region?.toLowerCase() === region.toLowerCase()
    );
  },

  /** Filter detention facilities by type. */
  getDetentionFacilitiesByType(type: string): DetentionFacility[] {
    return this.getDetentionFacilities().filter(
      (f) => f.type?.toLowerCase() === type.toLowerCase()
    );
  },

  // ── Emergency Alerts ────────────────────────────────
  getAlerts(): EmergencyAlert[] {
    return (emergencyAlertsData || []) as unknown as EmergencyAlert[];
  },

  /** Currently active, non-expired alerts. */
  getActiveAlerts(): EmergencyAlert[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getAlerts().filter(
      (a) => a.active && (!a.expires || a.expires >= today)
    );
  },

  /** Find an alert by ID. */
  getAlertById(id: string): EmergencyAlert | null {
    return this.getAlerts().find((a) => a.id === id) || null;
  },

  // ── Statistics ──────────────────────────────────────
  getStatistics(): Statistic[] {
    return (liveStatisticsData || []) as unknown as Statistic[];
  },

  /** Find a statistic by ID. */
  getStatisticById(id: string): Statistic | null {
    return this.getStatistics().find((s) => s.id === id) || null;
  },

  // ── Recent Updates ──────────────────────────────────
  /** Get recent platform updates, optionally limited. */
  getRecentUpdates(limit?: number): RecentUpdate[] {
    const updates = (recentUpdatesData || []) as unknown as RecentUpdate[];
    return limit ? updates.slice(0, limit) : updates;
  },

  /** Filter recent updates by category. */
  getRecentUpdatesByCategory(category: string): RecentUpdate[] {
    return ((recentUpdatesData || []) as unknown as RecentUpdate[]).filter(
      (u) => u.category?.toLowerCase() === category.toLowerCase()
    );
  },

  // ── International Responses ──────────────────────────
  getInternationalResponses(): InternationalResponse[] {
    return extractResults(internationalResponsesData) as unknown as InternationalResponse[];
  },

  /** Find a country's international response by exact name (case-insensitive). */
  getInternationalResponseByCountry(country: string): InternationalResponse | null {
    return this.getInternationalResponses().find(
      (r) => r.country?.toLowerCase() === country.toLowerCase()
    ) || null;
  },

  /** Search international responses across all text fields. */
  searchInternationalResponses(query: string): InternationalResponse[] {
    return this.getInternationalResponses().filter((r) => matchesSearch(r as unknown as Record<string, unknown>, query));
  },

  // ── Human Rights Organisations ──────────────────────
  getHumanRightsOrgs(): HumanRightsOrg[] {
    return extractResults(humanRightsOrgsData) as unknown as HumanRightsOrg[];
  },

  /** Filter organisations by focus area. */
  getHumanRightsOrgsByFocus(focusArea: string): HumanRightsOrg[] {
    return this.getHumanRightsOrgs().filter(
      (o) => o.focus_area?.toLowerCase() === focusArea.toLowerCase()
    );
  },

  /** Filter organisations by type. */
  getHumanRightsOrgsByType(orgType: string): HumanRightsOrg[] {
    return this.getHumanRightsOrgs().filter(
      (o) => o.org_type?.toLowerCase().includes(orgType.toLowerCase())
    );
  },

  /** Search organisations across all text fields. */
  searchHumanRightsOrgs(query: string): HumanRightsOrg[] {
    return this.getHumanRightsOrgs().filter((o) => matchesSearch(o as unknown as Record<string, unknown>, query));
  },

  // ── Overseas Police Stations ───────────────────────────
  getPoliceStations(): PoliceStation[] {
    return extractResults(policeStationsData) as unknown as PoliceStation[];
  },

  /** Filter police stations by host country. */
  getPoliceStationsByCountry(country: string): PoliceStation[] {
    return this.getPoliceStations().filter(
      (s) => s.country?.toLowerCase() === country.toLowerCase()
    );
  },

  /** Filter police stations by status. */
  getPoliceStationsByStatus(status: string): PoliceStation[] {
    return this.getPoliceStations().filter(
      (s) => s.status?.toLowerCase() === status.toLowerCase()
    );
  },

  /** Search police stations across all text fields. */
  searchPoliceStations(query: string): PoliceStation[] {
    return this.getPoliceStations().filter((s) => matchesSearch(s as unknown as Record<string, unknown>, query));
  },

  // ── Legal Cases ─────────────────────────────────────
  getLegalCases(): LegalCase[] {
    return extractResults(legalCasesData) as unknown as LegalCase[];
  },

  /** Filter legal cases by jurisdiction. */
  getLegalCasesByJurisdiction(jurisdiction: string): LegalCase[] {
    return this.getLegalCases().filter(
      (c) => c.jurisdiction?.toLowerCase().includes(jurisdiction.toLowerCase())
    );
  },

  /** Filter legal cases by status. */
  getLegalCasesByStatus(status: string): LegalCase[] {
    return this.getLegalCases().filter(
      (c) => c.status?.toLowerCase() === status.toLowerCase()
    );
  },

  /** Search legal cases across all text fields. */
  searchLegalCases(query: string): LegalCase[] {
    return this.getLegalCases().filter((c) => matchesSearch(c as unknown as Record<string, unknown>, query));
  },

  // ── Cross-dataset queries ───────────────────────────
  /**
   * Global search across all datasets. Returns results grouped by dataset.
   * Query must be at least 2 characters.
   */
  globalSearch(query: string): GlobalSearchResults | Record<string, never> {
    if (!query || query.trim().length < 2) return {};

    return {
      political_prisoners: this.searchPoliticalPrisoners(query),
      sanctions: this.searchSanctions(query),
      sanctioned_officials: this.searchSanctionedOfficials(query),
      forced_labor_companies: this.searchForcedLaborCompanies(query),
      timeline_events: this.getTimelineEvents().filter((e) => matchesSearch(e as unknown as Record<string, unknown>, query)),
      international_responses: this.searchInternationalResponses(query),
      human_rights_orgs: this.searchHumanRightsOrgs(query),
      police_stations: this.searchPoliceStations(query),
      legal_cases: this.searchLegalCases(query),
    };
  },

  /** Get all data related to Hong Kong. */
  getHongKongData(): HongKongData {
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

  /** Get all data related to Uyghur/Xinjiang issues. */
  getUyghurData(): UyghurData {
    return {
      prisoners: this.searchPoliticalPrisoners('Uyghur'),
      companies: this.getForcedLaborCompanies(),
      facilities: this.getDetentionFacilities(),
      sanctions: this.searchSanctions('Uyghur'),
      timeline: this.getTimelineEventsByCategory('uyghur'),
    };
  },

  /** Get a snapshot of all datasets for cross-referencing. */
  getAllDatasets(): AllDatasets {
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
