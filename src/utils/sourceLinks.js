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
