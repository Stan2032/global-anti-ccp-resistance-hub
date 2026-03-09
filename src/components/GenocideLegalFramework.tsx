// @ts-nocheck


/**
 * GenocideLegalFramework — Legal analysis of genocide determinations
 * and international law as applied to CCP atrocities. Cross-references
 * treaties, court rulings, and parliamentary resolutions.
 *
 * @module GenocideLegalFramework
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import { Scale, Search, ChevronDown, ChevronUp, ExternalLink, Copy, Check, AlertTriangle, Shield, Globe, FileText, Flag } from 'lucide-react';
// GenocideLegalFramework — Maps CCP actions to international legal instruments.
// Cross-references 7 datasets. All data from verified Tier 1-2 sources. CC BY 4.0.

const LEGAL_CATEGORIES = [
  { id: 'all', label: 'All Instruments' },
  { id: 'genocide', label: 'Genocide Convention', color: 'text-red-400', desc: 'UN Convention on the Prevention and Punishment of the Crime of Genocide (1948)' },
  { id: 'torture', label: 'Convention against Torture', color: 'text-orange-400', desc: 'UN Convention against Torture and Other Cruel, Inhuman or Degrading Treatment (1984)' },
  { id: 'iccpr', label: 'ICCPR', color: 'text-yellow-400', desc: 'International Covenant on Civil and Political Rights (1966)' },
  { id: 'forced_labor', label: 'Forced Labor Conventions', color: 'text-[#a78bfa]', desc: 'ILO Forced Labour Convention (No. 29, 1930) and Abolition of Forced Labour Convention (No. 105, 1957)' },
  { id: 'minority_rights', label: 'Minority Rights', color: 'text-[#22d3ee]', desc: 'UN Declaration on the Rights of Persons Belonging to National or Ethnic, Religious and Linguistic Minorities (1992)' },
];

const LEGAL_VIOLATIONS = [
  {
    id: 'genocide-art2a',
    category: 'genocide',
    article: 'Article II(a)',
    title: 'Killing members of the group',
    legalText: 'Killing members of the group with intent to destroy, in whole or in part, a national, ethnical, racial or religious group.',
    documentedActions: 'Deaths in detention across Xinjiang facilities. Reports of extrajudicial killings. China Tribunal (2019) found forced organ harvesting from prisoners of conscience proved beyond reasonable doubt, constituting killing on a mass scale.',
    evidenceType: ['detention_facilities', 'political_prisoners'],
    evidenceKeywords: { facilities: 'Xinjiang', prisoners: 'Uyghur' },
    severity: 'critical',
    recognitions: 10,
    keyFindings: [
      'China Tribunal (2019): forced organ harvesting proved beyond reasonable doubt',
      'Uyghur Tribunal (2021): acts of genocide established against Uyghurs',
      'Multiple unexplained deaths in Xinjiang detention facilities documented by ASPI',
    ],
    sources: [
      { name: 'China Tribunal Final Judgment', url: 'https://chinatribunal.com/final-judgment/' },
      { name: 'Uyghur Tribunal Judgment', url: 'https://uyghurtribunal.com/wp-content/uploads/2022/01/Uyghur-Tribunal-Judgment-9th-Dec-21.pdf' },
    ],
  },
  {
    id: 'genocide-art2b',
    category: 'genocide',
    article: 'Article II(b)',
    title: 'Causing serious bodily or mental harm',
    legalText: 'Causing serious bodily or mental harm to members of the group.',
    documentedActions: 'Systematic torture and abuse in Xinjiang detention centers including: electric shocks, sleep deprivation, forced stress positions, sexual violence, forced medication, solitary confinement. UN OHCHR Assessment (Aug 2022) documented "serious human rights violations" constituting "crimes against humanity."',
    evidenceType: ['detention_facilities', 'political_prisoners', 'international_responses'],
    evidenceKeywords: { facilities: 'Xinjiang', prisoners: 'torture', responses: 'Uyghur' },
    severity: 'critical',
    recognitions: 10,
    keyFindings: [
      'UN OHCHR Assessment (Aug 2022): "serious human rights violations" including torture',
      'Survivor testimonies document electric shocks, sexual violence, forced sterilization',
      'ASPI satellite imagery shows expansion of detention infrastructure',
    ],
    sources: [
      { name: 'UN OHCHR Xinjiang Assessment', url: 'https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region' },
      { name: 'Human Rights Watch Report', url: 'https://www.hrw.org/report/2021/04/19/break-their-lineage-break-their-roots/chinas-crimes-against-humanity-targeting' },
    ],
  },
  {
    id: 'genocide-art2c',
    category: 'genocide',
    article: 'Article II(c)',
    title: 'Deliberately inflicting conditions of life calculated to bring about physical destruction',
    legalText: 'Deliberately inflicting on the group conditions of life calculated to bring about its physical destruction in whole or in part.',
    documentedActions: 'Mass internment of 1-1.8 million Uyghurs in facilities described as "re-education camps." Forced sterilization campaigns reducing Uyghur birth rates by 84% in some prefectures (2015-2018). Forced labor transfer programs moving Uyghurs to factories across China. Destruction of mosques and cultural sites.',
    evidenceType: ['detention_facilities', 'forced_labor', 'international_responses'],
    evidenceKeywords: { facilities: 'Xinjiang', companies: 'Xinjiang', responses: 'genocide' },
    severity: 'critical',
    recognitions: 10,
    keyFindings: [
      'AP investigation: birth rates in Uyghur regions fell 84% (2015-2018)',
      'ASPI: 380+ detention facilities identified via satellite imagery',
      'Forced sterilization and IUD insertion campaigns documented by AP, Zenz research',
    ],
    sources: [
      { name: 'AP Investigation: Birth Rates', url: 'https://apnews.com/article/ap-top-news-international-news-weekend-reads-china-health-269b3de1af34e17c1941a514f78d764c' },
      { name: 'ASPI Xinjiang Data Project', url: 'https://xjdp.aspi.org.au/' },
    ],
  },
  {
    id: 'genocide-art2d',
    category: 'genocide',
    article: 'Article II(d)',
    title: 'Imposing measures intended to prevent births',
    legalText: 'Imposing measures intended to prevent births within the group.',
    documentedActions: 'Systematic forced sterilization, forced IUD insertion, and forced abortion targeting Uyghur women in Xinjiang. Birth rates in Uyghur-majority areas declined 84% between 2015-2018 while Han Chinese areas maintained stable rates. Women detained for having "too many children."',
    evidenceType: ['detention_facilities', 'political_prisoners'],
    evidenceKeywords: { facilities: 'Xinjiang', prisoners: 'Uyghur' },
    severity: 'critical',
    recognitions: 10,
    keyFindings: [
      'Forced sterilization and IUD insertion rates in Xinjiang far exceed national averages',
      'Women detained in camps for "too many children" as a policy violation',
      'Adrian Zenz research corroborated by AP and independent demographic analysis',
    ],
    sources: [
      { name: 'Zenz: Sterilizations, IUDs, and Coercive Birth Prevention', url: 'https://jamestown.org/program/sterilizations-iuds-and-mandatory-birth-control-the-ccps-campaign-to-suppress-uyghur-birthrates-in-xinjiang/' },
      { name: 'AP: China cuts Uyghur births', url: 'https://apnews.com/article/269b3de1af34e17c1941a514f78d764c' },
    ],
  },
  {
    id: 'genocide-art2e',
    category: 'genocide',
    article: 'Article II(e)',
    title: 'Forcibly transferring children of the group',
    legalText: 'Forcibly transferring children of the group to another group.',
    documentedActions: 'Uyghur children separated from detained parents and placed in state-run boarding schools where they are taught Mandarin and prevented from practicing their culture or religion. An estimated 880,000 Uyghur children in residential schools. Tibetan children similarly placed in colonial-style boarding schools.',
    evidenceType: ['detention_facilities', 'political_prisoners', 'international_responses'],
    evidenceKeywords: { facilities: 'Xinjiang', prisoners: 'child', responses: 'Uyghur' },
    severity: 'critical',
    recognitions: 8,
    keyFindings: [
      'Estimated 880,000+ Uyghur children in state boarding schools separated from families',
      'Tibet Action Institute: ~1 million Tibetan children in colonial-style boarding schools',
      'Children taught exclusively in Mandarin, cultural and religious practices prohibited',
    ],
    sources: [
      { name: 'BBC: Children separated from parents', url: 'https://www.bbc.co.uk/news/world-asia-china-48825090' },
      { name: 'Tibet Action Institute: Boarding Schools', url: 'https://tibetaction.net/campaigns/colonialboardingschools/' },
    ],
  },
  {
    id: 'cat-art1',
    category: 'torture',
    article: 'Article 1',
    title: 'Definition of torture — systematic use by state officials',
    legalText: 'Any act by which severe pain or suffering, whether physical or mental, is intentionally inflicted on a person for purposes such as obtaining information or a confession, or for intimidating or coercing that person, by a public official.',
    documentedActions: 'Widespread torture documented in Xinjiang detention facilities, Hong Kong prisons, and mainland China detention centers. Methods include: electric shocks, tiger bench, sleep deprivation, stress positions, sexual violence, forced medication, solitary confinement. Applied systematically against Uyghurs, Tibetans, Falun Gong practitioners, and political dissidents.',
    evidenceType: ['detention_facilities', 'political_prisoners'],
    evidenceKeywords: { facilities: '', prisoners: 'torture' },
    severity: 'critical',
    recognitions: 12,
    keyFindings: [
      'UN Committee against Torture: repeated concerns about "numerous, consistent" torture reports',
      'Multiple political prisoners report torture during interrogation and detention',
      'Gao Zhisheng, Zhang Zhan, and others subjected to documented abuse',
    ],
    sources: [
      { name: 'UN Committee against Torture — China review', url: 'https://www.ohchr.org/en/treaty-bodies/cat' },
      { name: 'Amnesty: Torture in China', url: 'https://www.amnesty.org/en/latest/news/2015/11/china-no-end-in-sight-torture-and-forced-confessions-in-china/' },
    ],
  },
  {
    id: 'cat-art3',
    category: 'torture',
    article: 'Article 3',
    title: 'Non-refoulement — prohibition of transfer to states where torture is likely',
    legalText: 'No State Party shall expel, return or extradite a person to another State where there are substantial grounds for believing that they would be in danger of being subjected to torture.',
    documentedActions: 'CCP overseas police stations in 50+ countries facilitate involuntary returns ("persuade to return" operations). Safeguard Defenders documented 100+ CCP "110 Overseas" police service stations. Interpol Red Notices misused to target political dissidents abroad. Family members in China threatened to coerce overseas dissidents into returning.',
    evidenceType: ['police_stations', 'legal_cases', 'international_responses'],
    evidenceKeywords: { cases: 'extradition', responses: 'police' },
    severity: 'high',
    recognitions: 15,
    keyFindings: [
      'Safeguard Defenders: 100+ CCP overseas police stations in 50+ countries',
      'Multiple countries (Netherlands, UK, Ireland, Canada) have investigated/closed stations',
      'Interpol Red Notice abuse documented by multiple human rights organizations',
    ],
    sources: [
      { name: 'Safeguard Defenders: 110 Overseas', url: 'https://safeguarddefenders.com/en/blog/230000-policing-expands' },
      { name: 'FBI Director testimony', url: 'https://www.fbi.gov/news/testimony/threats-posed-by-the-chinese-government-and-the-chinese-communist-party-to-the-economic-and-national-security-of-the-united-states' },
    ],
  },
  {
    id: 'iccpr-art9',
    category: 'iccpr',
    article: 'Article 9',
    title: 'Right to liberty — prohibition of arbitrary detention',
    legalText: 'Everyone has the right to liberty and security of person. No one shall be subjected to arbitrary arrest or detention.',
    documentedActions: 'Mass arbitrary detention of 1-1.8 million Uyghurs without charge or trial. Political prisoners held in "residential surveillance at a designated location" (RSDL) — effectively enforced disappearance. Hong Kong NSL used to detain journalists, legislators, and activists. Over 260 people arrested under the NSL.',
    evidenceType: ['detention_facilities', 'political_prisoners', 'legal_cases'],
    evidenceKeywords: { facilities: '', prisoners: '', cases: 'NSL' },
    severity: 'critical',
    recognitions: 20,
    keyFindings: [
      'Estimated 1-1.8 million Uyghurs detained without charge in "re-education" camps',
      'RSDL system used to disappear human rights lawyers and activists for up to 6 months',
      '386 people arrested under Hong Kong NSL, 176 convicted',
    ],
    sources: [
      { name: 'UN Working Group on Arbitrary Detention', url: 'https://www.ohchr.org/en/special-procedures/wg-arbitrary-detention' },
      { name: 'Safeguard Defenders: RSDL', url: 'https://safeguarddefenders.com/en/blog/rsdl-chinas-unique-system-disappearance' },
    ],
  },
  {
    id: 'iccpr-art18',
    category: 'iccpr',
    article: 'Article 18',
    title: 'Freedom of thought, conscience, and religion',
    legalText: 'Everyone shall have the right to freedom of thought, conscience and religion, including freedom to have or adopt a religion of their choice.',
    documentedActions: 'Systematic persecution of religious groups: Uyghur Muslims (mosque demolitions, Quran confiscation, fasting bans), Tibetan Buddhists (monastery closures, political education requirements, ban on Dalai Lama imagery), Christians (cross removals, church demolitions), Falun Gong (imprisonment, torture, organ harvesting). Cardinal Zen arrested in Hong Kong for supporting pro-democracy protesters.',
    evidenceType: ['political_prisoners', 'detention_facilities', 'international_responses'],
    evidenceKeywords: { prisoners: 'religion', facilities: '', responses: '' },
    severity: 'critical',
    recognitions: 18,
    keyFindings: [
      'USCIRF: China designated "Country of Particular Concern" for religious freedom annually',
      '16,000+ mosques damaged or destroyed in Xinjiang (ASPI)',
      'Panchen Lama forcibly disappeared since age 6 (1995) — longest political prisoner',
    ],
    sources: [
      { name: 'USCIRF Annual Report — China', url: 'https://www.uscirf.gov/countries/china' },
      { name: 'ASPI: Cultural Erasure', url: 'https://www.aspi.org.au/report/cultural-erasure' },
    ],
  },
  {
    id: 'iccpr-art19',
    category: 'iccpr',
    article: 'Article 19',
    title: 'Freedom of expression and press freedom',
    legalText: 'Everyone shall have the right to hold opinions without interference and the right to freedom of expression.',
    documentedActions: 'Great Firewall blocking access to global internet. Prosecution of journalists (Jimmy Lai — 20 years, Zhang Zhan — 8+ years total). Closure of Apple Daily. Stand News editors convicted. CPJ ranks China as the world\'s worst jailer of journalists. Hong Kong\'s press freedom ranking collapsed under NSL.',
    evidenceType: ['political_prisoners', 'legal_cases'],
    evidenceKeywords: { prisoners: 'journalist', cases: 'media' },
    severity: 'critical',
    recognitions: 25,
    keyFindings: [
      'CPJ: China is the world\'s worst jailer of journalists (2023, 2024, 2025)',
      'Jimmy Lai sentenced to 20 years — harshest NSL sentence for press freedom',
      'RSF Press Freedom Index: China ranked 172nd of 180 countries',
    ],
    sources: [
      { name: 'CPJ: Imprisoned Journalists — China', url: 'https://cpj.org/data/imprisoned/?cc_fips%5B%5D=CH' },
      { name: 'RSF: China', url: 'https://rsf.org/en/country/china' },
    ],
  },
  {
    id: 'forced-labor-ilo29',
    category: 'forced_labor',
    article: 'ILO Convention No. 29, Article 1',
    title: 'Suppression of forced or compulsory labor',
    legalText: 'Each Member of the International Labour Organisation which ratifies this Convention undertakes to suppress the use of forced or compulsory labour in all its forms.',
    documentedActions: 'State-imposed forced labor programs in Xinjiang transferring Uyghur workers to factories across China. Cotton-picking by detained populations. UFLPA entity list identifies 144 companies linked to Xinjiang forced labor. 30+ global brands identified in ASPI "Uyghurs for Sale" investigation.',
    evidenceType: ['forced_labor', 'sanctions', 'international_responses'],
    evidenceKeywords: { companies: '', responses: 'forced labor' },
    severity: 'critical',
    recognitions: 20,
    keyFindings: [
      'ASPI "Uyghurs for Sale": 80,000+ Uyghurs transferred to factories across China',
      'US UFLPA Entity List: 144 companies banned from importing to US',
      'EU Corporate Sustainability Due Diligence Directive addresses supply chain forced labor',
    ],
    sources: [
      { name: 'ASPI: Uyghurs for Sale', url: 'https://www.aspi.org.au/report/uyghurs-sale' },
      { name: 'US Customs: UFLPA Entity List', url: 'https://www.cbp.gov/trade/forced-labor/UFLPA/entity-list' },
    ],
  },
  {
    id: 'minority-art1',
    category: 'minority_rights',
    article: 'Article 1',
    title: 'Protection of ethnic, religious, and linguistic identity',
    legalText: 'States shall protect the existence and the national or ethnic, cultural, religious and linguistic identity of minorities within their respective territories.',
    documentedActions: 'Systematic cultural erasure targeting Uyghurs (language restrictions, mosque demolitions, cemetery destruction, forced assimilation), Tibetans (monastery closures, language suppression, colonial boarding schools), and Mongols (Mandarin-only education policy). Forced "sinicization" of religion. Destruction of cultural heritage sites.',
    evidenceType: ['detention_facilities', 'political_prisoners', 'international_responses'],
    evidenceKeywords: { facilities: '', prisoners: '', responses: 'cultural' },
    severity: 'critical',
    recognitions: 15,
    keyFindings: [
      '16,000+ mosques damaged or destroyed in Xinjiang (ASPI Cultural Erasure report)',
      'Uyghur cemeteries systematically demolished (Buzzfeed News/AFP satellite analysis)',
      '~1 million Tibetan children in state boarding schools separated from families',
    ],
    sources: [
      { name: 'ASPI: Cultural Erasure in Xinjiang', url: 'https://www.aspi.org.au/report/cultural-erasure' },
      { name: 'Tibet Action Institute', url: 'https://tibetaction.net/campaigns/colonialboardingschools/' },
    ],
  },
];

const RECOGNITION_COUNTRIES = [
  { country: 'United States', year: 2021, body: 'US State Department', type: 'Genocide declaration', details: 'Secretary Pompeo declared genocide (Jan 2021), reaffirmed by Biden admin' },
  { country: 'Canada', year: 2021, body: 'House of Commons', type: 'Parliamentary motion', details: 'Passed non-binding motion recognizing genocide (Feb 2021, 266-0)' },
  { country: 'Netherlands', year: 2021, body: 'House of Representatives', type: 'Parliamentary motion', details: 'First European parliament to recognize genocide (Feb 2021)' },
  { country: 'United Kingdom', year: 2021, body: 'House of Commons', type: 'Parliamentary motion', details: 'Declared genocide in Xinjiang (Apr 2021), rejected by government' },
  { country: 'Lithuania', year: 2021, body: 'Seimas (Parliament)', type: 'Parliamentary resolution', details: 'Recognized genocide in Xinjiang (May 2021)' },
  { country: 'Czech Republic', year: 2021, body: 'Senate', type: 'Senate resolution', details: 'Adopted resolution recognizing genocide (Jun 2021)' },
  { country: 'Belgium', year: 2021, body: 'Parliament', type: 'Parliamentary resolution', details: 'Recognized "serious risk of genocide" (Jun 2021)' },
  { country: 'France', year: 2022, body: 'National Assembly', type: 'Parliamentary resolution', details: 'Recognized genocide and crimes against humanity (Jan 2022)' },
  { country: 'Uyghur Tribunal', year: 2021, body: 'Independent people\'s tribunal', type: 'Tribunal judgment', details: 'Sir Geoffrey Nice QC: genocide established beyond reasonable doubt (Dec 2021)' },
  { country: 'China Tribunal', year: 2019, body: 'Independent people\'s tribunal', type: 'Tribunal judgment', details: 'Sir Geoffrey Nice QC: forced organ harvesting proven beyond reasonable doubt' },
];

function getEvidenceCounts(violation, allData) {
  const counts = {};
  if (violation.evidenceType.includes('political_prisoners')) {
    const kw = violation.evidenceKeywords.prisoners || '';
    counts.prisoners = kw ? allData.prisoners.filter(p => {
      const text = [p.name, p.nationality, p.charges, p.details, p.location, p.ethnicity].filter(Boolean).join(' ');
      return text.toLowerCase().includes(kw.toLowerCase());
    }).length : allData.prisoners.length;
  }
  if (violation.evidenceType.includes('detention_facilities')) {
    const kw = violation.evidenceKeywords.facilities || '';
    counts.facilities = kw ? allData.facilities.filter(f => {
      const text = [f.name, f.region, f.province, f.type].filter(Boolean).join(' ');
      return text.toLowerCase().includes(kw.toLowerCase());
    }).length : allData.facilities.length;
  }
  if (violation.evidenceType.includes('forced_labor')) {
    const kw = violation.evidenceKeywords.companies || '';
    counts.companies = kw ? allData.companies.filter(c => {
      const text = [c.company, c.industry, c.evidence_summary, c.supply_chain_detail].filter(Boolean).join(' ');
      return text.toLowerCase().includes(kw.toLowerCase());
    }).length : allData.companies.length;
  }
  if (violation.evidenceType.includes('international_responses')) {
    const kw = violation.evidenceKeywords.responses || '';
    counts.responses = kw ? allData.responses.filter(r => {
      const text = [r.country, r.genocide_recognition, r.sanctions_imposed, r.legislative_actions, r.overall_stance].filter(Boolean).join(' ');
      return text.toLowerCase().includes(kw.toLowerCase());
    }).length : allData.responses.length;
  }
  if (violation.evidenceType.includes('police_stations')) {
    counts.stations = allData.stations.length;
  }
  if (violation.evidenceType.includes('legal_cases')) {
    const kw = violation.evidenceKeywords.cases || '';
    counts.cases = kw ? allData.cases.filter(c => {
      const text = [c.case_name, c.jurisdiction, c.defendant, c.charges, c.significance].filter(Boolean).join(' ');
      return text.toLowerCase().includes(kw.toLowerCase());
    }).length : allData.cases.length;
  }
  if (violation.evidenceType.includes('sanctions')) {
    counts.sanctions = allData.sanctions.length;
  }
  return counts;
}

const GenocideLegalFramework = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedViolation, setExpandedViolation] = useState(null);
  const [activeView, setActiveView] = useState('violations');
  const [copied, setCopied] = useState(false);

  const prisoners = dataApi.getPoliticalPrisoners();
  const facilities = dataApi.getDetentionFacilities();
  const companies = dataApi.getForcedLaborCompanies();
  const responses = dataApi.getInternationalResponses();
  const stations = dataApi.getPoliceStations();
  const cases = dataApi.getLegalCases();
  const sanctions = dataApi.getSanctions();

  const allData = useMemo(() => ({
    prisoners, facilities, companies, responses, stations, cases, sanctions,
  }), [prisoners, facilities, companies, responses, stations, cases, sanctions]);

  const violationsWithEvidence = useMemo(() => {
    return LEGAL_VIOLATIONS.map(v => ({
      ...v,
      evidenceCounts: getEvidenceCounts(v, allData),
    }));
  }, [allData]);

  const filtered = useMemo(() => {
    return violationsWithEvidence.filter(v => {
      const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
      const matchesSearch = !searchQuery || [v.article, v.title, v.documentedActions, v.legalText, v.category].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [violationsWithEvidence, selectedCategory, searchQuery]);

  const stats = useMemo(() => ({
    total: LEGAL_VIOLATIONS.length,
    critical: LEGAL_VIOLATIONS.filter(v => v.severity === 'critical').length,
    instruments: LEGAL_CATEGORIES.filter(c => c.id !== 'all').length,
    totalEvidence: Object.values(allData).reduce((sum, arr) => sum + arr.length, 0),
    recognitions: RECOGNITION_COUNTRIES.length,
  }), [allData]);

  const getCategoryStyle = (catId) => LEGAL_CATEGORIES.find(c => c.id === catId) || LEGAL_CATEGORIES[0];

  const handleCopyReport = async () => {
    const lines = [
      '═══ CCP VIOLATIONS OF INTERNATIONAL LAW — LEGAL FRAMEWORK ANALYSIS ═══',
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      `Violations documented: ${stats.total}`,
      `Critical violations: ${stats.critical}`,
      `Legal instruments analyzed: ${stats.instruments}`,
      `Genocide recognitions: ${stats.recognitions}`,
      `Evidence data points: ${stats.totalEvidence}`,
      '',
      ...filtered.map(v => {
        const cat = getCategoryStyle(v.category);
        const evidenceStr = Object.entries(v.evidenceCounts).map(([k, val]) => `${k}: ${val}`).join(', ');
        return [
          `[${cat.label?.toUpperCase() || v.category.toUpperCase()}] ${v.article}: ${v.title}`,
          `  Documented: ${v.documentedActions.substring(0, 150)}...`,
          `  Evidence: ${evidenceStr}`,
          `  Severity: ${v.severity.toUpperCase()}`,
          '',
        ].join('\n');
      }),
      'Source: Global Anti-CCP Resistance Hub — Tier 1-2 verified data',
      'License: CC BY 4.0',
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section aria-label="Genocide Legal Framework" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Scale className="w-5 h-5 text-red-400" aria-hidden="true" />
            Genocide Legal Framework
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Mapping {stats.total} documented CCP violations to international legal instruments — cross-referenced with {stats.totalEvidence} verified data points across {prisoners.length} prisoners, {facilities.length} facilities, {companies.length} companies
          </p>
        </div>
        <button onClick={handleCopyReport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#1c2a35] hover:border-[#22d3ee] text-slate-400 hover:text-[#22d3ee] transition-colors whitespace-nowrap flex-shrink-0" aria-label="Copy legal framework report">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Report'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Violations Documented', value: stats.total, color: 'text-white' },
          { label: 'Critical', value: stats.critical, color: 'text-red-400' },
          { label: 'Legal Instruments', value: stats.instruments, color: 'text-[#22d3ee]' },
          { label: 'Genocide Recognitions', value: stats.recognitions, color: 'text-[#a78bfa]' },
          { label: 'Evidence Points', value: stats.totalEvidence, color: 'text-[#4afa82]' },
        ].map(s => (
          <div key={s.label} className="bg-[#111820] border border-[#1c2a35] p-3 text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        {[
          { id: 'violations', label: 'Legal Violations' },
          { id: 'recognitions', label: 'Genocide Recognitions' },
        ].map(view => (
          <button key={view.id} onClick={() => setActiveView(view.id)} className={`px-4 py-2 text-xs font-mono border transition-colors ${activeView === view.id ? 'text-[#4afa82] border-[#4afa82] bg-[#4afa82]/10' : 'text-slate-400 border-[#1c2a35] hover:border-slate-400'}`} aria-label={`View ${view.label}`} aria-pressed={activeView === view.id}>
            {view.label}
          </button>
        ))}
      </div>

      {activeView === 'violations' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search legal violations..." className="w-full bg-[#111820] border border-[#1c2a35] text-slate-300 text-sm pl-9 pr-3 py-2 font-mono placeholder:text-slate-400 focus:border-[#22d3ee] focus:outline-none" aria-label="Search legal violations" />
            </div>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-[#111820] border border-[#1c2a35] text-slate-300 text-sm px-3 py-2 font-mono focus:border-[#22d3ee] focus:outline-none" aria-label="Filter by legal instrument">
              {LEGAL_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Category buttons */}
          <div className="flex flex-wrap gap-2">
            {LEGAL_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
              const count = LEGAL_VIOLATIONS.filter(v => v.category === cat.id).length;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)} className={`px-3 py-1.5 text-xs font-mono border transition-colors ${selectedCategory === cat.id ? `${cat.color} border-current bg-current/10` : 'text-slate-400 border-[#1c2a35] hover:border-slate-400'}`} aria-label={`Filter ${cat.label}`}>
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Violation Cards */}
          <div className="space-y-3">
            <p className="text-xs text-slate-400 font-mono">{filtered.length} of {stats.total} violations shown</p>
            {filtered.map(v => {
              const cat = getCategoryStyle(v.category);
              const isExpanded = expandedViolation === v.id;
              const totalEvidence = Object.values(v.evidenceCounts).reduce((s, val) => s + val, 0);
              return (
                <div key={v.id} className="border border-[#1c2a35] bg-[#111820]/50">
                  <button onClick={() => setExpandedViolation(isExpanded ? null : v.id)} className="w-full text-left p-4 flex items-start justify-between gap-3" aria-expanded={isExpanded} aria-label={`${v.article}: ${v.title} — ${cat.label}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-xs font-mono px-2 py-0.5 whitespace-nowrap ${cat.color} bg-current/10`}>{cat.label?.toUpperCase()}</span>
                        <span className={`text-xs font-mono px-2 py-0.5 whitespace-nowrap ${v.severity === 'critical' ? 'text-red-400 bg-red-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>{v.severity}</span>
                      </div>
                      <p className="text-sm text-[#22d3ee] font-mono">{v.article}</p>
                      <p className="text-sm text-white font-mono leading-relaxed mt-0.5">{v.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{totalEvidence} evidence points • {v.recognitions} recognitions</p>
                    </div>
                    <span className="text-slate-500 flex-shrink-0 mt-1">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 border-t border-[#1c2a35]">
                      {/* Legal Text */}
                      <div className="mt-3 space-y-2">
                        <h4 className="text-xs font-mono text-[#a78bfa] uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" aria-hidden="true" /> Legal Text
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-[#a78bfa]/30 pl-3">{v.legalText}</p>
                      </div>

                      {/* Documented Actions */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> Documented CCP Actions
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{v.documentedActions}</p>
                      </div>

                      {/* Key Findings */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono text-[#4afa82] uppercase tracking-wider flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" aria-hidden="true" /> Key Findings
                        </h4>
                        <ul className="space-y-1">
                          {v.keyFindings.map((finding, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-[#4afa82] mt-1 flex-shrink-0">•</span>
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Evidence Counts */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Cross-Referenced Evidence</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(v.evidenceCounts).map(([type, count]) => (
                            <span key={type} className="text-xs font-mono px-2 py-1 bg-[#0a0e14] border border-[#1c2a35] text-slate-300">
                              {type}: <span className="text-[#22d3ee]">{count}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Sources */}
                      {v.sources.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Legal and Evidentiary Sources</h4>
                          <div className="space-y-1">
                            {v.sources.map((src, i) => (
                              <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#22d3ee] hover:underline">
                                <ExternalLink className="w-3 h-3" aria-hidden="true" /> {src.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeView === 'recognitions' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400 font-mono">{RECOGNITION_COUNTRIES.length} formal genocide recognitions and tribunal findings</p>
          <div className="space-y-2">
            {RECOGNITION_COUNTRIES.map((rec, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-3 flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Flag className="w-4 h-4 text-[#a78bfa]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-white font-mono">{rec.country}</span>
                    <span className="text-xs font-mono text-[#22d3ee]">{rec.year}</span>
                    <span className="text-xs font-mono px-2 py-0.5 text-[#a78bfa] bg-[#a78bfa]/10">{rec.type}</span>
                  </div>
                  <p className="text-xs text-slate-400">{rec.body}</p>
                  <p className="text-sm text-slate-300 mt-1">{rec.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-slate-400 border-t border-[#1c2a35] pt-4 space-y-1">
        <p>Data: {prisoners.length} political prisoners • {facilities.length} detention facilities • {companies.length} forced labor companies • {responses.length} country responses • {stations.length} police stations • {cases.length} legal cases • {sanctions.length} sanctions</p>
        <p>Sources: Tier 1-2 verified — UN OHCHR, Uyghur Tribunal, China Tribunal, ASPI, ICJ, Amnesty International, HRW, CPJ, USCIRF, Safeguard Defenders</p>
        <p>License: CC BY 4.0 • Legal texts from official UN treaty instruments</p>
      </div>
    </section>
  );
};

export default GenocideLegalFramework;
