/**
 * Source Links Utility
 * 
 * Maps well-known source organization names to their URLs, types,
 * and verification status. Used to convert plain-text source names
 * into proper SourceAttribution objects with clickable links.
 */

const SOURCE_REGISTRY = {
  'Amnesty International': {
    url: 'https://www.amnesty.org/',
    type: 'NGO Report',
    verified: true
  },
  'Human Rights Watch': {
    url: 'https://www.hrw.org/',
    type: 'NGO Report',
    verified: true
  },
  'Radio Free Asia': {
    url: 'https://www.rfa.org/',
    type: 'News Report',
    verified: true
  },
  'Uyghur Human Rights Project': {
    url: 'https://uhrp.org/',
    type: 'NGO Report',
    verified: true
  },
  'International Campaign for Tibet': {
    url: 'https://savetibet.org/',
    type: 'NGO Report',
    verified: true
  },
  'UN Committee on the Rights of the Child': {
    url: 'https://www.ohchr.org/en/treaty-bodies/crc',
    type: 'Government',
    verified: true
  },
  'Falun Dafa Information Center': {
    url: 'https://faluninfo.net/',
    type: 'NGO Report',
    verified: true
  },
  'China Tribunal': {
    url: 'https://chinatribunal.com/',
    type: 'NGO Report',
    verified: true
  },
  'Hong Kong Free Press': {
    url: 'https://hongkongfp.com/',
    type: 'News Report',
    verified: true
  },
  'ASPI - Australian Strategic Policy Institute': {
    url: 'https://www.aspi.org.au/',
    type: 'Research Paper',
    verified: true
  },
  'Tibet Action Institute': {
    url: 'https://tibetaction.net/',
    type: 'NGO Report',
    verified: true
  },
  'Tiananmen Papers': {
    url: 'https://nsarchive.gwu.edu/project/tiananmen-square-project',
    type: 'Government',
    verified: true
  },
  'UN Human Rights Council': {
    url: 'https://www.ohchr.org/en/hr-bodies/hrc/home',
    type: 'Government',
    verified: true
  },
  'Congressional-Executive Commission on China': {
    url: 'https://www.cecc.gov/',
    type: 'Government',
    verified: true
  },
  'Reporters Without Borders': {
    url: 'https://rsf.org/',
    type: 'NGO Report',
    verified: true
  },
  'Freedom House': {
    url: 'https://freedomhouse.org/',
    type: 'NGO Report',
    verified: true
  },
  'PEN International': {
    url: 'https://www.pen-international.org/',
    type: 'NGO Report',
    verified: true
  },
  'Committee to Protect Journalists': {
    url: 'https://cpj.org/',
    type: 'NGO Report',
    verified: true
  },
  'BBC': {
    url: 'https://www.bbc.com/',
    type: 'News Report',
    verified: true
  },
  'Reuters': {
    url: 'https://www.reuters.com/',
    type: 'News Report',
    verified: true
  },
  'The Guardian': {
    url: 'https://www.theguardian.com/',
    type: 'News Report',
    verified: true
  },
  'South China Morning Post': {
    url: 'https://www.scmp.com/',
    type: 'News Report',
    verified: true
  },
  'New York Times': {
    url: 'https://www.nytimes.com/',
    type: 'News Report',
    verified: true
  },
  'Associated Press': {
    url: 'https://apnews.com/',
    type: 'News Report',
    verified: true
  },
  'ICIJ': {
    url: 'https://www.icij.org/',
    type: 'News Report',
    verified: true
  },
  'Global Magnitsky Act': {
    url: 'https://www.congress.gov/bill/114th-congress/senate-bill/284',
    type: 'Government',
    verified: true
  },
  'UK Sanctions Act 2018': {
    url: 'https://www.legislation.gov.uk/ukpga/2018/13/contents',
    type: 'Government',
    verified: true
  },
  'EU Common Foreign and Security Policy': {
    url: 'https://www.consilium.europa.eu/en/policies/sanctions/',
    type: 'Government',
    verified: true
  },
  'Xinhua': {
    url: 'https://www.news.cn/',
    type: 'News Report',
    verified: false
  }
};

/**
 * Convert a plain-text source name into a SourceAttribution-compatible object.
 * 
 * @param {string} sourceName - The name of the source organization
 * @returns {Object} Source attribution object with name, url, type, verified
 */
export function resolveSource(sourceName) {
  const entry = SOURCE_REGISTRY[sourceName];
  if (entry) {
    return {
      name: sourceName,
      url: entry.url,
      type: entry.type,
      verified: entry.verified
    };
  }

  // Return a basic object for unrecognized sources
  return {
    name: sourceName,
    url: null,
    type: 'Other',
    verified: false
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
