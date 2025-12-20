/**
 * Regional Security Threats and CCP Expansionism Data Module
 * 
 * This module contains data about CCP military expansion, territorial claims,
 * and threats to regional security in the Indo-Pacific.
 * 
 * Last Updated: December 2025
 * 
 * Sources:
 * - US Department of Defense Annual Report on China
 * - Institute for the Study of War (ISW)
 * - Center for Strategic and International Studies (CSIS)
 * - Heritage Foundation
 * - Australian Strategic Policy Institute (ASPI)
 */

// Taiwan Threat Assessment
export const TAIWAN_THREAT = {
  overview: {
    status: 'CRITICAL',
    threatLevel: 'SEVERE',
    lastUpdated: '2025-12',
    summary: 'Taiwan faces intensifying military, economic, and diplomatic pressure from the PRC. The PLA continues to build capabilities for a potential invasion while conducting regular military exercises and incursions into Taiwan\'s ADIZ.'
  },
  
  militaryCapabilities: {
    plaForces: {
      groundForces: '2 million active personnel',
      navy: '370+ ships (world\'s largest by number)',
      airForce: '2,800+ aircraft',
      rockets: '2,500+ ballistic and cruise missiles',
      amphibiousCapacity: 'Rapidly expanding'
    },
    keyDevelopments2025: [
      'Largest naval buildup in East Asian waters in history (December 2025)',
      'Over 100 naval vessels spotted in South China Sea',
      'Electromagnetic warfare zone established in South China Sea',
      'Continued ADIZ incursions averaging 10+ aircraft daily',
      'Regular "Joint Sword" military exercises simulating blockade'
    ],
    pla2027Milestone: 'Pentagon assesses PLA aims to achieve capabilities to counter US military in Indo-Pacific by 2027'
  },
  
  taiwanDefense: {
    defenseBudget2025: '$19 billion (base) + $40 billion special allocation',
    strategy: 'Asymmetric defense, porcupine strategy',
    keyCapabilities: [
      'Anti-ship missiles (Harpoon, indigenous)',
      'Air defense systems (Patriot, Sky Bow)',
      'F-16V fighter fleet',
      'Indigenous submarine program',
      'Drone warfare capabilities'
    ],
    civilDefense: 'Whole-of-society resilience approach per 2025 National Defense Report'
  },
  
  scenarios: [
    {
      name: 'Quarantine/Blockade',
      probability: 'MEDIUM-HIGH',
      description: 'Naval and air blockade to strangle Taiwan economically without full invasion',
      indicators: ['Coast Guard surge', 'Customs inspection demands', 'Cable cutting']
    },
    {
      name: 'Gray Zone Escalation',
      probability: 'HIGH',
      description: 'Continued escalation of ADIZ incursions, cyber attacks, and economic coercion',
      indicators: ['Daily military flights', 'Cyber attacks on infrastructure', 'Trade restrictions']
    },
    {
      name: 'Full Amphibious Invasion',
      probability: 'LOW-MEDIUM',
      description: 'Full-scale military invasion to achieve "reunification"',
      indicators: ['Mass mobilization', 'Civilian shipping requisition', 'Information blackout'],
      challenges: 'Logistically most ambitious amphibious operation in history'
    },
    {
      name: 'Decapitation Strike',
      probability: 'LOW',
      description: 'Precision strikes on leadership and command infrastructure',
      indicators: ['Special forces positioning', 'Cyber warfare preparation']
    }
  ],
  
  internationalResponse: {
    usCommitment: 'Strategic ambiguity with increasing clarity on defense support',
    japanPosition: 'PM stated Taiwan conflict threatens Japanese security (Nov 2025)',
    australiaPosition: 'AUKUS partnership, increased defense cooperation',
    europeanUnion: 'Growing concern, limited military commitment'
  }
};

// South China Sea Assessment
export const SOUTH_CHINA_SEA = {
  overview: {
    status: 'CONTESTED',
    threatLevel: 'HIGH',
    lastUpdated: '2025-12',
    summary: 'China continues to militarize artificial islands and assert expansive territorial claims rejected by international law. December 2025 saw unprecedented naval buildup across the region.'
  },
  
  chineseClaims: {
    nineLineClaim: 'Claims approximately 90% of South China Sea',
    legalStatus: 'Rejected by 2016 Permanent Court of Arbitration ruling',
    artificialIslands: [
      { name: 'Fiery Cross Reef', status: 'Militarized', features: 'Airstrip, radar, missiles' },
      { name: 'Subi Reef', status: 'Militarized', features: 'Airstrip, hangars' },
      { name: 'Mischief Reef', status: 'Militarized', features: 'Airstrip, radar' },
      { name: 'Scarborough Shoal', status: 'Controlled', features: 'Coast Guard presence' }
    ]
  },
  
  militarization2025: {
    navalPresence: '100+ vessels spotted December 2025',
    electronicWarfare: 'Electromagnetic kill zone established',
    capabilities: [
      'Anti-ship ballistic missiles (DF-21D, DF-26)',
      'Surface-to-air missile systems',
      'Fighter aircraft deployments',
      'Electronic warfare systems',
      'Underwater sensor networks'
    ]
  },
  
  affectedCountries: [
    { country: 'Philippines', disputes: 'Scarborough Shoal, Spratly Islands', incidents: 'Regular harassment of fishing vessels' },
    { country: 'Vietnam', disputes: 'Paracel Islands, Spratly Islands', incidents: 'Oil exploration interference' },
    { country: 'Malaysia', disputes: 'Spratly Islands', incidents: 'Coast Guard incursions' },
    { country: 'Brunei', disputes: 'Spratly Islands', incidents: 'Limited' },
    { country: 'Indonesia', disputes: 'Natuna Islands EEZ', incidents: 'Fishing vessel incidents' }
  ],
  
  freedomOfNavigation: {
    usOperations: 'Regular FONOPs challenging excessive claims',
    alliedParticipation: ['UK', 'France', 'Germany', 'Australia', 'Japan', 'Canada'],
    chinaResponse: 'Aggressive shadowing, unsafe intercepts'
  }
};

// East China Sea Assessment
export const EAST_CHINA_SEA = {
  overview: {
    status: 'CONTESTED',
    threatLevel: 'HIGH',
    lastUpdated: '2025-12',
    summary: 'Ongoing dispute over Senkaku/Diaoyu Islands with regular Chinese Coast Guard incursions into Japanese territorial waters.'
  },
  
  senkakuDispute: {
    japaneseControl: 'Administered by Japan since 1972',
    chineseClaim: 'Claims historical sovereignty',
    incursions2025: 'Near-daily Coast Guard presence in contiguous zone',
    adizOverlap: 'China declared ADIZ in 2013 overlapping Japanese-controlled airspace'
  },
  
  japanResponse: {
    coastGuardEnhancement: 'Largest Coast Guard in the region',
    selfDefenseForces: 'Increased patrols and exercises',
    usAlliance: 'Senkakus covered under US-Japan Security Treaty Article 5'
  }
};

// Belt and Road Initiative Assessment
export const BELT_AND_ROAD = {
  overview: {
    launchYear: 2013,
    participatingCountries: 150,
    estimatedInvestment: '$1 trillion+',
    status: 'Ongoing but facing increased scrutiny'
  },
  
  debtTrapDiplomacy: {
    description: 'Pattern of unsustainable lending leading to strategic asset seizures or political leverage',
    notableCases: [
      {
        country: 'Sri Lanka',
        project: 'Hambantota Port',
        outcome: '99-year lease to China after debt default',
        strategicValue: 'Indian Ocean naval access'
      },
      {
        country: 'Pakistan',
        project: 'CPEC (China-Pakistan Economic Corridor)',
        outcome: 'Massive debt burden, security concerns',
        strategicValue: 'Gwadar Port access to Arabian Sea'
      },
      {
        country: 'Djibouti',
        project: 'Various infrastructure',
        outcome: 'First overseas PLA military base',
        strategicValue: 'Horn of Africa strategic position'
      },
      {
        country: 'Montenegro',
        project: 'Highway construction',
        outcome: 'Debt reaching 80% of GDP',
        strategicValue: 'European foothold'
      }
    ]
  },
  
  strategicInfrastructure: {
    ports: ['Gwadar (Pakistan)', 'Hambantota (Sri Lanka)', 'Piraeus (Greece)', 'Djibouti'],
    railways: ['China-Laos Railway', 'China-Pakistan Railway', 'Budapest-Belgrade Railway'],
    digitalSilkRoad: ['5G networks', 'Submarine cables', 'Satellite systems', 'Smart cities']
  },
  
  countermeasures: {
    usResponse: 'Build Back Better World (B3W), Partnership for Global Infrastructure',
    euResponse: 'Global Gateway initiative',
    quadResponse: 'Infrastructure coordination',
    concerns: ['Environmental standards', 'Labor practices', 'Transparency', 'Debt sustainability']
  }
};

// United Front Work Department Operations
export const UNITED_FRONT = {
  overview: {
    name: 'United Front Work Department (UFWD)',
    chineseName: '中央统一战线工作部',
    purpose: 'Coordinate influence operations abroad and manage ethnic/religious minorities domestically',
    budget: 'Estimated billions annually',
    personnel: '40,000+ cadres'
  },
  
  overseasOperations: {
    targets: [
      'Chinese diaspora communities',
      'Foreign politicians and officials',
      'Academic institutions',
      'Business leaders',
      'Media organizations'
    ],
    methods: [
      'Chinese Students and Scholars Associations (CSSAs)',
      'Confucius Institutes',
      'Hometown associations',
      'Professional associations',
      'Political donations',
      'Elite capture'
    ],
    overseasPoliceStations: {
      documented: 100,
      countries: 53,
      purpose: 'Pressure diaspora, monitor dissidents, facilitate "voluntary" returns',
      source: 'Safeguard Defenders investigation'
    }
  },
  
  confuciusInstitutes: {
    peak: 550,
    current: 'Declining due to closures',
    concerns: [
      'Self-censorship on sensitive topics',
      'Surveillance of Chinese students',
      'Influence on curriculum',
      'Hosting CCP propaganda events'
    ],
    closures: ['US universities', 'European institutions', 'Australian universities']
  },
  
  politicalInfluence: {
    documentedCases: [
      'Australian Senator Sam Dastyari (resigned)',
      'New Zealand MP Jian Yang (CCP military intelligence background)',
      'Canadian politicians (CSIS warnings)',
      'UK Parliament (MI5 warnings)'
    ],
    methods: ['Campaign donations', 'Business opportunities', 'Honeypot operations', 'Blackmail']
  }
};

// Cyber and Information Warfare
export const CYBER_WARFARE = {
  overview: {
    threatLevel: 'SEVERE',
    primaryActors: ['PLA Unit 61398', 'APT groups', 'Ministry of State Security'],
    targets: ['Government', 'Defense', 'Technology', 'Healthcare', 'Critical infrastructure']
  },
  
  majorOperations: [
    {
      name: 'APT41 (Winnti)',
      attribution: 'MSS-linked',
      targets: 'Healthcare, telecom, technology',
      notable: 'COVID-19 vaccine research theft'
    },
    {
      name: 'APT10 (Stone Panda)',
      attribution: 'MSS',
      targets: 'Managed service providers',
      notable: 'Cloud Hopper campaign'
    },
    {
      name: 'Volt Typhoon',
      attribution: 'PLA',
      targets: 'US critical infrastructure',
      notable: 'Pre-positioning for potential conflict'
    },
    {
      name: 'Salt Typhoon',
      attribution: 'PLA/MSS',
      targets: 'US telecommunications',
      notable: '2024 telecom breaches'
    }
  ],
  
  disinformation: {
    platforms: ['Twitter/X', 'Facebook', 'YouTube', 'TikTok', 'WeChat'],
    tactics: [
      'Coordinated inauthentic behavior',
      'Bot networks',
      'State media amplification',
      'Conspiracy theory promotion',
      'Election interference attempts'
    ],
    themes: [
      'COVID-19 origin deflection',
      'Xinjiang narrative control',
      'Taiwan delegitimization',
      'US decline narratives',
      'Democracy criticism'
    ]
  }
};

// Export all regional threat data
export default {
  TAIWAN_THREAT,
  SOUTH_CHINA_SEA,
  EAST_CHINA_SEA,
  BELT_AND_ROAD,
  UNITED_FRONT,
  CYBER_WARFARE
};
