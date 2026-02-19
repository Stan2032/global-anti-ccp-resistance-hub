/**
 * Comprehensive CCP Human Rights Violations Data Module
 * 
 * This module contains curated data about CCP human rights violations,
 * detention facilities, political prisoners, and resistance resources.
 * 
 * Sources:
 * - ASPI Xinjiang Data Project (xjdp.aspi.org.au)
 * - Xinjiang Victims Database (shahit.biz)
 * - CECC Political Prisoner Database (cecc.gov)
 * - Dui Hua Political Prisoner Database (duihua.org)
 * - Human Rights Watch (hrw.org)
 * - ICIJ China Cables Investigation
 * - Uyghur Human Rights Project (uhrp.org)
 */

// Verified Intelligence Sources for RSS/API Integration
export const INTELLIGENCE_SOURCES = [
  {
    id: 'icij',
    name: 'International Consortium of Investigative Journalists',
    shortName: 'ICIJ',
    url: 'https://www.icij.org',
    feedUrl: 'https://www.icij.org/feed/',
    focus: ['China Cables', 'Xinjiang Police Files', 'Global Investigations'],
    reliability: 'HIGH',
    description: 'Award-winning investigative journalism organization that broke the China Cables and Xinjiang Police Files stories.'
  },
  {
    id: 'rfa',
    name: 'Radio Free Asia',
    shortName: 'RFA',
    url: 'https://www.rfa.org',
    feedUrl: 'https://www.rfa.org/english/rss2.xml',
    focus: ['Uyghur News', 'Tibet', 'Hong Kong', 'China Human Rights'],
    reliability: 'HIGH',
    description: 'US-funded broadcaster providing news to Asian countries where free press is limited.'
  },
  {
    id: 'hkfp',
    name: 'Hong Kong Free Press',
    shortName: 'HKFP',
    url: 'https://hongkongfp.com',
    feedUrl: 'https://hongkongfp.com/feed/',
    focus: ['Hong Kong Democracy', 'National Security Law', 'Press Freedom'],
    reliability: 'HIGH',
    description: 'Independent, non-profit news outlet covering Hong Kong and China.'
  },
  {
    id: 'aspi',
    name: 'Australian Strategic Policy Institute',
    shortName: 'ASPI',
    url: 'https://www.aspi.org.au',
    feedUrl: 'https://www.aspistrategist.org.au/feed/',
    focus: ['Xinjiang Data Project', 'CCP Influence Operations', 'Indo-Pacific Security'],
    reliability: 'HIGH',
    description: 'Think tank providing research on defense, security, and strategic policy.'
  },
  {
    id: 'hrw',
    name: 'Human Rights Watch',
    shortName: 'HRW',
    url: 'https://www.hrw.org',
    feedUrl: 'https://www.hrw.org/rss/news_and_commentary/china',
    focus: ['Human Rights Violations', 'Political Prisoners', 'Forced Labor'],
    reliability: 'HIGH',
    description: 'International NGO conducting research and advocacy on human rights.'
  },
  {
    id: 'cecc',
    name: 'Congressional-Executive Commission on China',
    shortName: 'CECC',
    url: 'https://www.cecc.gov',
    feedUrl: null, // No RSS, requires scraping
    focus: ['Political Prisoners Database', 'Annual Reports', 'US Policy'],
    reliability: 'HIGH',
    description: 'US government commission monitoring human rights and rule of law in China.'
  },
  {
    id: 'uhrp',
    name: 'Uyghur Human Rights Project',
    shortName: 'UHRP',
    url: 'https://uhrp.org',
    feedUrl: 'https://uhrp.org/feed/',
    focus: ['Uyghur Rights', 'Sanctions Tracker', 'Forced Labor'],
    reliability: 'HIGH',
    description: 'Research-based advocacy organization promoting rights of Uyghurs.'
  },
  {
    id: 'tibetwatch',
    name: 'Tibet Watch',
    shortName: 'TW',
    url: 'https://www.tibetwatch.org',
    feedUrl: null,
    focus: ['Tibet Human Rights', 'Self-Immolations', 'Cultural Destruction'],
    reliability: 'HIGH',
    description: 'Research and monitoring organization focused on Tibet.'
  }
];

// Key Databases and Research Resources
export const RESEARCH_DATABASES = [
  {
    id: 'xjdp',
    name: 'ASPI Xinjiang Data Project',
    url: 'https://xjdp.aspi.org.au',
    type: 'interactive_map',
    description: 'Comprehensive mapping of detention facilities in Xinjiang using satellite imagery.',
    dataPoints: {
      detentionFacilities: 380,
      lastUpdated: '2024',
      coverage: 'Xinjiang Uyghur Autonomous Region'
    }
  },
  {
    id: 'shahit',
    name: 'Xinjiang Victims Database',
    url: 'https://shahit.biz',
    type: 'victim_database',
    description: 'Database of individuals detained in Xinjiang internment camps with testimonies.',
    dataPoints: {
      documentedVictims: 35000,
      lastUpdated: '2024',
      coverage: 'Individual victim records'
    }
  },
  {
    id: 'cecc_ppd',
    name: 'CECC Political Prisoner Database',
    url: 'https://www.cecc.gov/resources/political-prisoner-database',
    type: 'political_prisoners',
    description: 'US government database of known political and religious prisoners in China.',
    dataPoints: {
      documentedPrisoners: 10000,
      lastUpdated: '2024',
      coverage: 'All of China'
    }
  },
  {
    id: 'duihua',
    name: 'Dui Hua Political Prisoner Database',
    url: 'https://duihua.org/resources/political-prisoners-database/',
    type: 'political_prisoners',
    description: 'NGO database tracking political and religious prisoners since 1980.',
    dataPoints: {
      documentedPrisoners: 50000,
      lastUpdated: '2024',
      coverage: 'Historical and current'
    }
  },
  {
    id: 'uhrp_sanctions',
    name: 'UHRP US Sanctions Tracker',
    url: 'https://uhrp.org/sanctions-tracker/',
    type: 'sanctions',
    description: 'Tracking US government sanctions related to Uyghur human rights violations.',
    dataPoints: {
      sanctionedEntities: 100,
      lastUpdated: '2024',
      coverage: 'US sanctions actions'
    }
  }
];

// CCP Tactics and Methods Documentation
export const CCP_TACTICS = {
  surveillance: {
    name: 'Mass Surveillance',
    description: 'Comprehensive monitoring of citizens using AI, facial recognition, and social credit systems.',
    technologies: [
      'Facial Recognition Networks',
      'Social Credit System',
      'WeChat/Weibo Monitoring',
      'DNA Collection Programs',
      'Voice Recognition Systems',
      'Gait Recognition',
      'Predictive Policing Algorithms'
    ],
    affectedRegions: ['Xinjiang', 'Tibet', 'Hong Kong', 'Nationwide'],
    keyCompanies: ['Hikvision', 'Dahua', 'SenseTime', 'Megvii', 'Huawei']
  },
  detention: {
    name: 'Mass Detention',
    description: 'Extrajudicial detention in "re-education" camps and formal prisons.',
    facilityTypes: [
      'Re-education Camps (Xinjiang)',
      'Vocational Training Centers',
      'Black Jails',
      'Residential Surveillance at Designated Location (RSDL)',
      'Formal Prisons',
      'Psychiatric Facilities'
    ],
    estimatedDetainees: {
      xinjiang: '1-3 million',
      tibet: 'Unknown',
      hongKong: '10,000+',
      nationwide: 'Unknown'
    }
  },
  forcedLabor: {
    name: 'Forced Labor',
    description: 'Systematic use of forced labor in detention facilities and factories.',
    sectors: [
      'Cotton Production',
      'Electronics Manufacturing',
      'Solar Panel Production',
      'Textile/Apparel',
      'Automotive Parts',
      'Food Processing'
    ],
    affectedBrands: 'See ASPI Uyghurs for Sale report',
    legislation: ['US Uyghur Forced Labor Prevention Act (UFLPA)']
  },
  culturalGenocide: {
    name: 'Cultural Genocide',
    description: 'Systematic destruction of ethnic and religious identity.',
    methods: [
      'Destruction of Mosques and Religious Sites',
      'Banning of Religious Practices',
      'Forced Sterilization',
      'Family Separation',
      'Language Suppression',
      'Forced Intermarriage',
      'Children Sent to State Boarding Schools'
    ],
    affectedGroups: ['Uyghurs', 'Tibetans', 'Mongolians', 'Hui Muslims', 'Christians']
  },
  transnationalRepression: {
    name: 'Transnational Repression',
    description: 'Targeting dissidents and diaspora communities abroad.',
    methods: [
      'Overseas Police Stations',
      'Threatening Family Members in China',
      'Interpol Red Notice Abuse',
      'Cyber Harassment',
      'Physical Surveillance Abroad',
      'Forced Repatriation',
      'United Front Work Department Operations'
    ],
    documentedCountries: 53
  },
  informationControl: {
    name: 'Information Control',
    description: 'Comprehensive censorship and propaganda operations.',
    methods: [
      'Great Firewall',
      'Social Media Censorship',
      'Journalist Imprisonment',
      'VPN Criminalization',
      'State Media Propaganda',
      'Wolf Warrior Diplomacy',
      'Disinformation Campaigns'
    ],
    blockedPlatforms: ['Google', 'Facebook', 'Twitter', 'YouTube', 'Wikipedia', 'WhatsApp']
  }
};

// High-Profile Political Prisoners
export const NOTABLE_PRISONERS = [
  {
    name: 'Jimmy Lai',
    chineseName: '黎智英',
    status: 'IMPRISONED',
    location: 'Stanley Prison, Hong Kong',
    charges: ['National Security Law - Collusion with Foreign Forces', 'Sedition'],
    sentence: 'Convicted — faces life imprisonment, sentencing pending',
    background: 'Founder of Apple Daily newspaper, pro-democracy media mogul',
    arrestDate: '2020-08-10',
    urgency: 'CRITICAL',
    age: 78,
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Ilham Tohti',
    chineseName: '伊力哈木·土赫提',
    status: 'IMPRISONED',
    location: 'Urumqi Prison, Xinjiang',
    charges: ['Separatism'],
    sentence: 'Life imprisonment',
    background: 'Uyghur economist and professor, advocated for dialogue',
    arrestDate: '2014-01-15',
    urgency: 'CRITICAL',
    awards: ['Martin Ennals Award', 'Sakharov Prize'],
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Gao Zhisheng',
    chineseName: '高智晟',
    status: 'DISAPPEARED',
    location: 'Unknown',
    charges: ['Subversion'],
    sentence: 'Multiple detentions',
    background: 'Human rights lawyer, defended Falun Gong practitioners and Christians',
    lastSeen: '2017-08-13',
    urgency: 'CRITICAL',
    healthConcerns: true,
    tortureDocumented: true
  },
  {
    name: 'Liu Xiaobo',
    chineseName: '刘晓波',
    status: 'DECEASED',
    location: 'Died in custody',
    charges: ['Inciting Subversion'],
    sentence: '11 years',
    background: 'Nobel Peace Prize laureate, Charter 08 author',
    deathDate: '2017-07-13',
    awards: ['Nobel Peace Prize 2010'],
    causeOfDeath: 'Liver cancer (denied medical parole)'
  },
  {
    name: 'Gedhun Choekyi Nyima',
    chineseName: '根敦确吉尼玛',
    status: 'DISAPPEARED',
    location: 'Unknown',
    charges: ['None - abducted as child'],
    background: '11th Panchen Lama recognized by Dalai Lama, abducted at age 6',
    abductionDate: '1995-05-17',
    currentAge: 35,
    urgency: 'CRITICAL',
    internationalAttention: 'HIGH'
  },
  {
    name: 'Zhang Zhan',
    chineseName: '张展',
    status: 'IMPRISONED',
    location: 'Shanghai',
    charges: ['Picking Quarrels and Provoking Trouble'],
    sentence: '4 years',
    background: 'Citizen journalist who reported from Wuhan during COVID-19 outbreak',
    arrestDate: '2020-05-14',
    urgency: 'CRITICAL',
    healthConcerns: true,
    hungerStrike: true
  },
  {
    name: 'Rinchen Tsultrim',
    tibetanName: 'རིན་ཆེན་ཚུལ་ཁྲིམས།',
    status: 'IMPRISONED',
    location: 'Tibet',
    charges: ['Inciting Separatism'],
    sentence: '4.5 years',
    background: 'Tibetan monk and writer',
    arrestDate: '2019-08-01',
    urgency: 'HIGH'
  }
];

// Key CCP Officials Responsible for Human Rights Violations
export const SANCTIONED_OFFICIALS = [
  {
    name: 'Chen Quanguo',
    chineseName: '陈全国',
    position: 'Former Party Secretary of Xinjiang',
    tenure: '2016-2021',
    sanctions: ['US Magnitsky Sanctions', 'UK Sanctions', 'EU Sanctions', 'Canada Sanctions'],
    responsibility: 'Architect of Xinjiang detention camp system',
    previousRole: 'Party Secretary of Tibet (implemented similar policies)'
  },
  {
    name: 'Wang Junzheng',
    chineseName: '王君正',
    position: 'Party Secretary of Xinjiang Production and Construction Corps',
    sanctions: ['US Magnitsky Sanctions'],
    responsibility: 'Oversaw forced labor programs'
  },
  {
    name: 'Zhu Hailun',
    chineseName: '朱海仑',
    position: 'Former Deputy Secretary of Xinjiang',
    sanctions: ['US Magnitsky Sanctions'],
    responsibility: 'Security apparatus in Xinjiang'
  },
  {
    name: 'Carrie Lam',
    chineseName: '林鄭月娥',
    position: 'Former Chief Executive of Hong Kong',
    tenure: '2017-2022',
    sanctions: ['US Sanctions'],
    responsibility: 'Implementation of National Security Law'
  },
  {
    name: 'John Lee',
    chineseName: '李家超',
    position: 'Chief Executive of Hong Kong',
    tenure: '2022-present',
    sanctions: ['US Sanctions'],
    responsibility: 'Former Security Secretary, crackdown on protests'
  }
];

// Relevance Keywords for Feed Scoring
export const RELEVANCE_KEYWORDS = {
  critical: [
    'uyghur', 'xinjiang', 'genocide', 'concentration camp', 'detention camp',
    're-education', 'forced labor', 'organ harvesting', 'political prisoner',
    'tiananmen', 'hong kong', 'national security law', 'tibet', 'dalai lama',
    'falun gong', 'human rights violation', 'ccp', 'chinese communist party'
  ],
  high: [
    'censorship', 'surveillance', 'social credit', 'great firewall',
    'press freedom', 'journalist detained', 'activist arrested',
    'democracy movement', 'pro-democracy', 'dissident', 'exile',
    'sanctions china', 'magnitsky', 'forced sterilization', 'cultural genocide'
  ],
  medium: [
    'taiwan', 'south china sea', 'belt and road', 'debt trap',
    'united front', 'confucius institute', 'influence operation',
    'wolf warrior', 'disinformation', 'propaganda', 'state media'
  ],
  low: [
    'china policy', 'us china relations', 'trade war', 'tariffs',
    'xi jinping', 'communist party', 'beijing', 'shanghai'
  ]
};

// Calculate relevance score for content
export function calculateRelevanceScore(text) {
  if (!text) return 0;
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Critical keywords: +10 points each
  RELEVANCE_KEYWORDS.critical.forEach(keyword => {
    if (lowerText.includes(keyword)) score += 10;
  });
  
  // High keywords: +5 points each
  RELEVANCE_KEYWORDS.high.forEach(keyword => {
    if (lowerText.includes(keyword)) score += 5;
  });
  
  // Medium keywords: +2 points each
  RELEVANCE_KEYWORDS.medium.forEach(keyword => {
    if (lowerText.includes(keyword)) score += 2;
  });
  
  // Low keywords: +1 point each
  RELEVANCE_KEYWORDS.low.forEach(keyword => {
    if (lowerText.includes(keyword)) score += 1;
  });
  
  // Cap at 100
  return Math.min(score, 100);
}

// Export all data
export default {
  INTELLIGENCE_SOURCES,
  RESEARCH_DATABASES,
  CCP_TACTICS,
  NOTABLE_PRISONERS,
  SANCTIONED_OFFICIALS,
  RELEVANCE_KEYWORDS,
  calculateRelevanceScore
};
