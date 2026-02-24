/**
 * Source Links Utility
 * 
 * Maps well-known source organization names to their URLs, types,
 * verification status, and bias risk level.
 *
 * biasRisk values:
 *   'none'    - Independent, credible, no known CCP influence
 *   'low'     - Minor concerns (state funding disclosed, single-community advocacy); use with awareness
 *   'medium'  - Known CCP ownership/influence or editorial slant; cross-reference required
 *   'ccp'     - CCP state media or direct CCP propaganda organ; NEVER cite as evidence
 *
 * See SOURCE_BIAS_AUDIT.md for full assessment methodology.
 */

const SOURCE_REGISTRY = {
  'Amnesty International': {
    url: 'https://www.amnesty.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'Human Rights Watch': {
    url: 'https://www.hrw.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'Radio Free Asia': {
    url: 'https://www.rfa.org/',
    type: 'News Report',
    verified: true,
    biasRisk: 'low',
    notes: 'US government-funded; funding is transparent and disclosed. Created to provide uncensored news to authoritarian-controlled populations. Editorially independent from US government.'
  },
  'Uyghur Human Rights Project': {
    url: 'https://uhrp.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'International Campaign for Tibet': {
    url: 'https://savetibet.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'UN Committee on the Rights of the Child': {
    url: 'https://www.ohchr.org/en/treaty-bodies/crc',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'Falun Dafa Information Center': {
    url: 'https://faluninfo.net/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'low',
    notes: 'Affiliated with Falun Gong practitioners. Cross-reference claims with independent sources where possible.'
  },
  'China Tribunal': {
    url: 'https://chinatribunal.com/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none',
    notes: 'Independent tribunal chaired by Sir Geoffrey Nice QC (former ICTY prosecutor); evidence-based findings.'
  },
  'Hong Kong Free Press': {
    url: 'https://hongkongfp.com/',
    type: 'News Report',
    verified: true,
    biasRisk: 'none',
    notes: 'Independent non-profit news organization; editorially independent.'
  },
  'ASPI - Australian Strategic Policy Institute': {
    url: 'https://www.aspi.org.au/',
    type: 'Research Paper',
    verified: true,
    biasRisk: 'none',
    notes: 'Credible; targeted by CCP disinformation campaigns. Xinjiang Data Project based on verifiable satellite imagery.'
  },
  'Tibet Action Institute': {
    url: 'https://tibetaction.net/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'Tiananmen Papers': {
    url: 'https://nsarchive.gwu.edu/project/tiananmen-square-project',
    type: 'Government',
    verified: true,
    biasRisk: 'none',
    notes: 'Leaked CCP internal documents; reviewed and authenticated by multiple international scholars.'
  },
  'UN Human Rights Council': {
    url: 'https://www.ohchr.org/en/hr-bodies/hrc/home',
    type: 'Government',
    verified: true,
    biasRisk: 'low',
    notes: 'UN body; CCP and allied states have at times blocked or watered down resolutions. Cite specific resolutions with vote records where possible.'
  },
  'Congressional-Executive Commission on China': {
    url: 'https://www.cecc.gov/',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'Reporters Without Borders': {
    url: 'https://rsf.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'Freedom House': {
    url: 'https://freedomhouse.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'PEN International': {
    url: 'https://www.pen-international.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'Committee to Protect Journalists': {
    url: 'https://cpj.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'BBC': {
    url: 'https://www.bbc.com/',
    type: 'News Report',
    verified: true,
    biasRisk: 'none'
  },
  'Reuters': {
    url: 'https://www.reuters.com/',
    type: 'News Report',
    verified: true,
    biasRisk: 'none'
  },
  'The Guardian': {
    url: 'https://www.theguardian.com/',
    type: 'News Report',
    verified: true,
    biasRisk: 'none'
  },
  'South China Morning Post': {
    url: 'https://www.scmp.com/',
    type: 'News Report',
    verified: true,
    biasRisk: 'medium',
    notes: 'Owned by Alibaba Group since 2015. Editorial stance has shifted toward pro-Beijing coverage. Use only for factual news reporting on events (court proceedings, government statements). Do NOT cite for analysis of CCP policies, Xinjiang, Tibet, or Hong Kong protest legitimacy. Always cross-reference with independent sources.'
  },
  'New York Times': {
    url: 'https://www.nytimes.com/',
    type: 'News Report',
    verified: true,
    biasRisk: 'none'
  },
  'Associated Press': {
    url: 'https://apnews.com/',
    type: 'News Report',
    verified: true,
    biasRisk: 'none'
  },
  'ICIJ': {
    url: 'https://www.icij.org/',
    type: 'News Report',
    verified: true,
    biasRisk: 'none',
    notes: 'International Consortium of Investigative Journalists; independent, non-profit.'
  },
  'Global Magnitsky Act': {
    url: 'https://www.congress.gov/bill/114th-congress/senate-bill/284',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'UK Sanctions Act 2018': {
    url: 'https://www.legislation.gov.uk/ukpga/2018/13/contents',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'EU Common Foreign and Security Policy': {
    url: 'https://www.consilium.europa.eu/en/policies/sanctions/',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'Xinhua': {
    url: 'https://www.news.cn/',
    type: 'News Report',
    verified: false,
    biasRisk: 'ccp',
    notes: 'Official CCP state news agency; directly subordinate to the CCP Propaganda Department. Publishes official CCP positions, not independent journalism. NEVER cite as evidence for claims about human rights, Xinjiang, Tibet, or Hong Kong.'
  },
  'European Parliament': {
    url: 'https://www.europarl.europa.eu/',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'Chinese Human Rights Defenders': {
    url: 'https://www.nchrd.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'ASPI': {
    url: 'https://www.aspi.org.au/',
    type: 'Research Paper',
    verified: true,
    biasRisk: 'none',
    notes: 'Credible; targeted by CCP disinformation campaigns. Xinjiang Data Project based on verifiable satellite imagery.'
  },
  'Xinjiang Police Files': {
    url: 'https://www.xinjiangpolicefiles.org/',
    type: 'Government',
    verified: true,
    biasRisk: 'none',
    notes: 'Leaked Chinese government documents; authenticity verified by forensic experts and multiple independent international news organizations (BBC, Der Spiegel, Le Monde, etc.).'
  },
  'Dr. Adrian Zenz': {
    url: 'https://adrianzenz.medium.com/',
    type: 'Academic Research',
    verified: true,
    biasRisk: 'none',
    notes: 'Senior Fellow, Victims of Communism Memorial Foundation. Credible researcher; subject of coordinated CCP disinformation campaigns (100+ Global Times attack articles). His Xinjiang estimates are corroborated by ASPI satellite data, Xinjiang Police Files, BuzzFeed News investigation, and US State Department reports. CCP attacks on his work are themselves documented Spamouflage operations.'
  },
  'Hong Kong Watch': {
    url: 'https://www.hongkongwatch.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'CNN': {
    url: 'https://www.cnn.com/',
    type: 'News Report',
    verified: true,
    biasRisk: 'none'
  },
  'UK Foreign Office': {
    url: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'Safeguard Defenders': {
    url: 'https://safeguarddefenders.com/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none',
    notes: 'Credible NGO; targeted by CCP as "anti-China". Their overseas police station research was validated when multiple governments (UK, Netherlands, Ireland, Canada) confirmed and closed stations following their reports.'
  },
  'FBI': {
    url: 'https://www.fbi.gov/',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'Uyghur Tribunal': {
    url: 'https://uyghurtribunal.com/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none',
    notes: 'Independent tribunal chaired by Sir Geoffrey Nice QC; conducted extensive evidence hearings 2021.'
  },
  'Nobel Committee': {
    url: 'https://www.nobelprize.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'US Treasury OFAC': {
    url: 'https://ofac.treasury.gov/',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'UK Sanctions List': {
    url: 'https://www.gov.uk/government/collections/uk-sanctions-list',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'EU Sanctions Map': {
    url: 'https://www.sanctionsmap.eu/',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'Canada Sanctions - China': {
    url: 'https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/china-chine.aspx',
    type: 'Government',
    verified: true,
    biasRisk: 'none'
  },
  'Tiananmen Mothers': {
    url: 'https://www.tiananmenmother.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'Human Rights in China': {
    url: 'https://www.hrichina.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'Wall Street Journal': {
    url: 'https://www.wsj.com/',
    type: 'News Report',
    verified: true,
    biasRisk: 'none'
  },
  'Free Tibet': {
    url: 'https://freetibet.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  },
  'Stand News': {
    // Stand News was shut down December 29, 2021 following NSL police raids.
    // The original domain is defunct. Archived content available via Wayback Machine.
    url: 'https://web.archive.org/web/2021*/https://www.thestandnews.com/',
    type: 'News Report',
    verified: true,
    biasRisk: 'none',
    notes: 'Pro-democracy Hong Kong news outlet; shut down December 2021 under Hong Kong National Security Law raids. Original site defunct. References point to archived content.'
  },
  'Nobel Prize Committee': {
    url: 'https://www.nobelprize.org/',
    type: 'NGO Report',
    verified: true,
    biasRisk: 'none'
  }
};

/**
 * CCP State Media Registry — NEVER CITE
 * 
 * These are direct CCP propaganda organs. They operate under CCP editorial
 * control and produce content that serves CCP messaging objectives.
 * Any source matching these names or domains must be rejected.
 * 
 * This is the single source of truth — all test files should import from here
 * rather than maintaining their own blocklists.
 */
export const CCP_NEVER_CITE = {
  names: [
    'xinhua',
    'cgtn',
    'global times',
    "people's daily",
    'china daily',
    'ta kung pao',
    'wen wei po',
    'cctv',
    'china central television',
    'china news service',
    'china radio international',
    'beijing daily',
    'liberation daily',
    'economic daily',
    'guangming daily',
    'workers daily',
    'china youth daily',
    'pla daily',
    'legal daily',
    'science and technology daily',
    'peasants daily',
  ],
  domains: [
    'xinhua.net',
    'news.cn',
    'cgtn.com',
    'globaltimes.cn',
    'people.com.cn',
    'chinadaily.com.cn',
    'takungpao.com',
    'wenweipo.com',
    'cctv.com',
    'ecns.cn',
    'cri.cn',
    'bjd.com.cn',
    'gmw.cn',
  ],
  reason: 'Direct CCP state media organs under Propaganda Department editorial control'
};

/**
 * CCP Elevated Risk Sources — CROSS-REFERENCE REQUIRED
 * 
 * These are entities with documented CCP funding, ownership, or influence that
 * may produce content aligned with CCP messaging. They are NOT necessarily
 * always wrong — but claims from these sources must be independently verified.
 * 
 * Categories:
 *   'ccp_proxy_media'    - Media outlets owned/controlled by CCP-linked entities
 *   'united_front'       - United Front Work Department affiliates  
 *   'confucius_institute' - CI-affiliated academic publications
 *   'ccp_think_tank'     - Think tanks with documented CCP funding/ties
 *   'elite_capture'      - Organizations with documented CCP co-optation
 */
export const CCP_ELEVATED_RISK = [
  // CCP Proxy Media — ownership/editorial control by CCP-linked entities
  {
    name: 'South China Morning Post',
    domain: 'scmp.com',
    category: 'ccp_proxy_media',
    risk: 'medium',
    reason: 'Owned by Alibaba Group since 2015. Editorial stance shifted pro-Beijing. Use only for factual event reporting, never for CCP policy analysis.',
    source: 'Reuters, 2015-12-11'
  },
  {
    name: 'Phoenix TV / ifeng',
    domain: 'ifeng.com',
    category: 'ccp_proxy_media',
    risk: 'high',
    reason: 'Founded by Liu Changle (CCP member, former PLA propagandist). Described by US State Dept as CCP propaganda outlet. Broadcasts in Mandarin globally.',
    source: 'US-China Economic and Security Review Commission, 2009'
  },
  {
    name: 'Sing Tao Daily',
    domain: 'singtao.com',
    category: 'ccp_proxy_media',
    risk: 'high',
    reason: 'Owner Charles Ho has documented CCP ties. US DOJ required Sing Tao registration as foreign agent (2022). Editorial line consistently pro-Beijing.',
    source: 'US Department of Justice, FARA filings, 2022'
  },
  {
    name: 'The Standard (HK)',
    domain: 'thestandard.com.hk',
    category: 'ccp_proxy_media',
    risk: 'medium',
    reason: 'English-language subsidiary of Sing Tao Media Group. Same ownership concerns.',
    source: 'US Department of Justice, FARA filings, 2022'
  },
  {
    name: 'Bauhinia Magazine',
    domain: 'bauhinia.org',
    category: 'ccp_proxy_media',
    risk: 'high',
    reason: 'Published by CCP Central Committee-linked Bauhinia Culture Holdings. Pro-Beijing editorial line.',
    source: 'HKFP, 2022-04-15'
  },

  // United Front affiliates
  {
    name: 'China Council for International Cooperation',
    domain: null,
    category: 'united_front',
    risk: 'high',
    reason: 'Identified by ASPI as United Front-linked organization used for political influence operations abroad.',
    source: 'ASPI, "The Party Speaks for You", 2020'
  },
  {
    name: 'China Association for International Friendly Contact',
    domain: null,
    category: 'united_front',
    risk: 'high',
    reason: 'Front organization for PLA General Political Department. Used for intelligence gathering and influence operations.',
    source: 'US-China Economic and Security Review Commission, 2011'
  },
  {
    name: 'Chinese Students and Scholars Association',
    domain: null,
    category: 'united_front',
    risk: 'high',
    reason: 'University chapters globally funded by Chinese consulates. Used to monitor and mobilize Chinese students against critics.',
    source: 'Foreign Policy, 2018-03-07; ASPI, 2020'
  },

  // Confucius Institute-affiliated publications
  {
    name: 'Confucius Institute publications',
    domain: 'ci.cn',
    category: 'confucius_institute',
    risk: 'high',
    reason: 'CIs are funded and controlled by CCP through Hanban/CIEF. 104+ closed in US, 34+ in UK, multiple in Canada/Australia due to espionage and propaganda concerns.',
    source: 'NAS Report, 2017; US Senate PSI Report, 2019'
  },

  // CCP-aligned think tanks and research entities
  {
    name: 'China Institutes of Contemporary International Relations',
    domain: 'cicir.ac.cn',
    category: 'ccp_think_tank',
    risk: 'high',
    reason: 'Directly affiliated with Ministry of State Security (MSS). Research output serves CCP strategic interests.',
    source: 'Mattis, Peter, "Assessing the Foreign Policy Apparatus Under Xi Jinping", 2016'
  },
  {
    name: 'Shanghai Institutes for International Studies',
    domain: 'siis.org.cn',
    category: 'ccp_think_tank',
    risk: 'high',
    reason: 'CCP State Council-affiliated think tank. Policy research aligned with CCP foreign policy objectives.',
    source: 'Brookings Institution assessment, 2014'
  },
  {
    name: 'China Institute of International Studies',
    domain: 'ciis.org.cn',
    category: 'ccp_think_tank',
    risk: 'high',
    reason: 'Affiliated with CCP Ministry of Foreign Affairs. Think tank output reflects MFA positions.',
    source: 'European Council on Foreign Relations, 2021'
  },
  {
    name: 'Chinese Academy of Social Sciences',
    domain: 'cass.cn',
    category: 'ccp_think_tank',
    risk: 'high',
    reason: 'CCP State Council research institution. CASS researchers are expected to uphold CCP positions. Subject to political loyalty requirements.',
    source: 'Shambaugh, David, "China Goes Global", 2013'
  },

  // Spamouflage / coordinated inauthentic behavior indicators
  {
    name: 'Spamouflage network content',
    domain: null,
    category: 'elite_capture',
    risk: 'high',
    reason: 'CCP-linked coordinated inauthentic behavior network identified by Graphika, Stanford Internet Observatory, and Meta. Creates fake personas to amplify CCP messaging and attack critics.',
    source: 'Graphika, "Spamouflage Goes to America", 2023; Stanford Internet Observatory, 2023'
  },
];

/**
 * Check if a source name matches a CCP state media outlet (NEVER CITE).
 * Uses case-insensitive partial matching against CCP_NEVER_CITE.names.
 * 
 * @param {string} sourceName - Source name or URL to check
 * @returns {boolean} true if source is CCP state media
 */
export function isCCPStateMedia(sourceName) {
  if (!sourceName) return false;
  const lower = sourceName.toLowerCase();
  return CCP_NEVER_CITE.names.some(name => lower.includes(name)) ||
         CCP_NEVER_CITE.domains.some(domain => lower.includes(domain));
}

/**
 * Check if a source URL matches a CCP state media domain.
 * 
 * @param {string} url - URL to check
 * @returns {boolean} true if URL points to CCP state media
 */
export function isCCPDomain(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return CCP_NEVER_CITE.domains.some(domain => lower.includes(domain));
}

/**
 * Check if a source is a known CCP-influenced entity that requires cross-referencing.
 * Returns the risk entry if found, null otherwise.
 * 
 * @param {string} sourceName - Source name or URL to check
 * @returns {Object|null} Risk entry if CCP-influenced, null if clean
 */
export function getCCPInfluenceRisk(sourceName) {
  if (!sourceName) return null;
  const lower = sourceName.toLowerCase();
  
  // First check NEVER CITE list
  if (isCCPStateMedia(sourceName)) {
    return {
      name: sourceName,
      category: 'ccp_state_media',
      risk: 'ccp',
      reason: CCP_NEVER_CITE.reason,
      action: 'REJECT — never cite as evidence'
    };
  }
  
  // Then check elevated risk list
  const match = CCP_ELEVATED_RISK.find(entry => {
    if (entry.name && lower.includes(entry.name.toLowerCase())) return true;
    if (entry.domain && lower.includes(entry.domain.toLowerCase())) return true;
    return false;
  });
  
  if (match) {
    return {
      name: match.name,
      category: match.category,
      risk: match.risk,
      reason: match.reason,
      source: match.source,
      action: match.risk === 'high' 
        ? 'REJECT — or require independent verification from Tier 1 source'
        : 'CAUTION — cross-reference with independent sources before citing'
    };
  }
  
  return null;
}

/**
 * Assess the overall risk level of a source.
 * Returns a structured assessment.
 * 
 * @param {string} sourceName - Source name to assess
 * @returns {Object} Assessment with level ('clean', 'low', 'medium', 'high', 'ccp'), details
 */
export function assessSourceRisk(sourceName) {
  if (!sourceName) return { level: 'unknown', details: 'No source provided' };
  
  // Check CCP influence
  const ccpRisk = getCCPInfluenceRisk(sourceName);
  if (ccpRisk) {
    return {
      level: ccpRisk.risk,
      details: ccpRisk.reason,
      action: ccpRisk.action,
      category: ccpRisk.category
    };
  }
  
  // Check SOURCE_REGISTRY
  const entry = SOURCE_REGISTRY[sourceName];
  if (entry) {
    return {
      level: entry.biasRisk || 'none',
      details: entry.notes || 'Verified source in registry',
      action: entry.biasRisk === 'none' ? 'SAFE — cite freely' : 'CAUTION — see notes',
      verified: entry.verified
    };
  }
  
  // Unknown source
  return {
    level: 'unknown',
    details: 'Source not in registry — verify independently before citing',
    action: 'VERIFY — not in source registry'
  };
}

/**
 * Convert a plain-text source name into a SourceAttribution-compatible object.
 * 
 * @param {string} sourceName - The name of the source organization
 * @returns {Object} Source attribution object with name, url, type, verified, biasRisk, notes
 */
export function resolveSource(sourceName) {
  const entry = SOURCE_REGISTRY[sourceName];
  if (entry) {
    return {
      name: sourceName,
      url: entry.url,
      type: entry.type,
      verified: entry.verified,
      biasRisk: entry.biasRisk || 'none',
      notes: entry.notes || null
    };
  }

  // Return a basic object for unrecognized sources
  return {
    name: sourceName,
    url: null,
    type: 'Other',
    verified: false,
    biasRisk: 'none',
    notes: null
  };
}

/**
 * Convert an array of source name strings into SourceAttribution objects.
 * 
 * @param {string[]} sourceNames - Array of source name strings
 * @returns {Object[]} Array of source attribution objects
 */
export function resolveSources(sourceNames) {
  if (!sourceNames || !Array.isArray(sourceNames)) return [];
  return sourceNames.map(resolveSource);
}

export default SOURCE_REGISTRY;
