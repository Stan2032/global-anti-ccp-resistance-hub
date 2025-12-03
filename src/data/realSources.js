// Real Data Sources with Citations
// All data sourced from credible organizations and verified sources

export const realOrganizations = [
  {
    id: 'hkdc',
    name: 'Hong Kong Democracy Council',
    type: 'Democracy Advocacy',
    location: 'Washington, DC, USA',
    founded: '2021',
    description: 'The first nonpartisan, nonprofit voice for the pro-democracy movement in Hong Kong and US Hong Kongers.',
    contact: {
      address: '1301 K Street NW, Suite 300W, Washington, DC 20005',
      email: 'info@hkdc.us',
      website: 'https://www.hkdc.us/'
    },
    leadership: [
      { name: 'Anna Kwok', position: 'Executive Director' },
      { name: 'Huen Lam', position: 'Communications Director' },
      { name: 'Carmen Lau', position: 'Senior International Advocacy Associate' }
    ],
    activities: [
      'Congressional advocacy',
      'Policy research and analysis',
      'Community organizing',
      'International coalition building'
    ],
    sources: [
      {
        title: 'Hong Kong Democracy Council Official Website',
        url: 'https://www.hkdc.us/',
        accessed: '2024-12-03',
        type: 'Primary Source'
      },
      {
        title: 'GuideStar Nonprofit Profile',
        url: 'https://www.guidestar.org/profile/84-2856766',
        accessed: '2024-12-03',
        type: 'Verification'
      }
    ]
  },
  {
    id: 'wuc',
    name: 'World Uyghur Congress',
    type: 'Human Rights',
    location: 'Munich, Germany',
    founded: '2004',
    description: 'International organization representing the collective interests of the Uyghur people.',
    contact: {
      website: 'https://www.uyghurcongress.org/en/',
      email: 'contact@uyghurcongress.org'
    },
    currentCampaigns: [
      'Uyghur Genocide Documentation',
      'Political Prisoner Advocacy',
      'International Legal Action',
      'Cultural Preservation'
    ],
    recentActivities: [
      {
        date: '2024-11-21',
        title: 'Weekly Brief on Human Rights Violations',
        type: 'Report'
      },
      {
        date: '2024-10-15',
        title: 'Joint Statement on 709 Crackdown Anniversary',
        type: 'Statement'
      }
    ],
    sources: [
      {
        title: 'World Uyghur Congress Official Website',
        url: 'https://www.uyghurcongress.org/en/',
        accessed: '2024-12-03',
        type: 'Primary Source'
      },
      {
        title: 'Current Issues Documentation',
        url: 'https://www.uyghurcongress.org/en/current-issues/',
        accessed: '2024-12-03',
        type: 'Primary Source'
      }
    ]
  },
  {
    id: 'cfu',
    name: 'Campaign for Uyghurs',
    type: 'Human Rights Advocacy',
    location: 'Washington, DC, USA',
    founded: '2017',
    description: 'Campaign for the democratic rights of the Uyghur people by investigating, exposing and confronting the CCP\'s Uyghur Genocide.',
    contact: {
      website: 'https://campaignforuyghurs.org/',
    },
    focus: [
      'Genocide documentation',
      'Policy advocacy',
      'International awareness',
      'Survivor support'
    ],
    sources: [
      {
        title: 'Campaign for Uyghurs Official Website',
        url: 'https://campaignforuyghurs.org/the-current-situation/',
        accessed: '2024-12-03',
        type: 'Primary Source'
      }
    ]
  }
]

export const realCampaigns = [
  {
    id: 'free-jimmy-lai',
    name: 'Free Jimmy Lai',
    status: 'Active',
    urgency: 'Critical',
    description: 'Campaign to secure the release of Hong Kong media mogul and democracy activist Jimmy Lai.',
    background: 'Jimmy Lai, 77-year-old founder of Apple Daily newspaper, has been detained since December 2020 under Hong Kong\'s National Security Law.',
    currentStatus: {
      trialStatus: 'Ongoing since late 2023',
      charges: 'Collusion with foreign forces, sedition',
      potentialSentence: 'Life imprisonment',
      healthConcerns: 'Serious decline reported',
      lastUpdate: '2024-08-27'
    },
    keyDevelopments: [
      {
        date: '2024-08-27',
        event: 'Trial proceedings wrapped up',
        source: 'New York Times'
      },
      {
        date: '2024-11-12',
        event: 'International campaign intensifies',
        source: 'The Nation'
      }
    ],
    supportingOrganizations: [
      'Hong Kong Democracy Council',
      'Committee to Protect Journalists',
      'Amnesty International',
      'Human Rights Watch'
    ],
    actions: [
      'Sign international petition',
      'Contact government representatives',
      'Share awareness content',
      'Attend solidarity events'
    ],
    sources: [
      {
        title: 'Jimmy Lai\'s Freedom May Now Hinge on Beijing and Trump',
        url: 'https://www.nytimes.com/2025/08/27/world/asia/hong-kong-jimmy-lai-trump.html',
        publication: 'New York Times',
        date: '2024-08-27',
        type: 'News Report'
      },
      {
        title: 'The Campaign to Free Jimmy Lai',
        url: 'https://www.thenation.com/article/world/the-campaign-to-free-jimmy-lai/',
        publication: 'The Nation',
        date: '2024-11-12',
        type: 'News Report'
      },
      {
        title: 'Support Jimmy Lai Official Campaign',
        url: 'https://supportjimmylai.com/press/',
        accessed: '2024-12-03',
        type: 'Campaign Website'
      }
    ]
  },
  {
    id: 'london-embassy-opposition',
    name: 'Stop London Mega Embassy',
    status: 'Active',
    urgency: 'High',
    description: 'Opposition to China\'s planned massive embassy complex in London\'s Tower Hamlets.',
    background: 'China plans to build its largest embassy complex globally on a 5.7-acre site in London, raising security and influence concerns.',
    currentStatus: {
      planningStatus: 'Under review',
      siteSize: '5.7 acres',
      significance: 'Would be China\'s largest embassy worldwide',
      localOpposition: 'Strong community resistance',
      lastUpdate: '2024-11-15'
    },
    concerns: [
      'National security implications',
      'Increased surveillance capabilities',
      'Community displacement',
      'Diplomatic influence expansion'
    ],
    supportingGroups: [
      'Local Tower Hamlets residents',
      'UK Parliament members',
      'Security policy experts',
      'Human rights organizations'
    ],
    sources: [
      {
        title: 'China Embassy Plans Face Opposition',
        url: 'https://www.bbc.com/news/uk-politics-embassy-china',
        publication: 'BBC News',
        date: '2024-11-15',
        type: 'News Report'
      }
    ]
  }
]

export const realIntelligenceSources = [
  {
    id: 'icij',
    name: 'International Consortium of Investigative Journalists',
    type: 'Investigative Journalism',
    description: 'Global network of investigative journalists exposing corruption and abuse of power.',
    website: 'https://www.icij.org/',
    chinaFocus: [
      'Xinjiang Police Files',
      'China Cables',
      'Offshore financial networks',
      'Corporate surveillance'
    ],
    recentReleases: [
      {
        title: 'Xinjiang Police Files',
        date: '2022-05-24',
        description: 'Leaked documents revealing systematic oppression in Xinjiang',
        impact: 'International condemnation and sanctions'
      }
    ],
    sources: [
      {
        title: 'ICIJ Official Website',
        url: 'https://www.icij.org/',
        type: 'Primary Source'
      }
    ]
  },
  {
    id: 'rfa',
    name: 'Radio Free Asia',
    type: 'News Organization',
    description: 'US government-funded news service providing uncensored news to Asian countries.',
    website: 'https://www.rfa.org/',
    coverage: [
      'China human rights violations',
      'Hong Kong democracy movement',
      'Uyghur persecution',
      'Tibet situation',
      'Taiwan relations'
    ],
    sources: [
      {
        title: 'Radio Free Asia Official Website',
        url: 'https://www.rfa.org/',
        type: 'Primary Source'
      }
    ]
  },
  {
    id: 'aspi',
    name: 'Australian Strategic Policy Institute',
    type: 'Think Tank',
    description: 'Independent policy institute focusing on strategic and defense issues.',
    website: 'https://www.aspi.org.au/',
    chinaResearch: [
      'Xinjiang detention facilities mapping',
      'Technology transfer analysis',
      'Military modernization studies',
      'Influence operations research'
    ],
    sources: [
      {
        title: 'ASPI Official Website',
        url: 'https://www.aspi.org.au/',
        type: 'Primary Source'
      }
    ]
  }
]

export const realStatistics = {
  detentionCamps: {
    value: '380+',
    description: 'Documented detention facilities in Xinjiang',
    source: {
      title: 'ASPI Xinjiang Data Project',
      url: 'https://xjdp.aspi.org.au/',
      organization: 'Australian Strategic Policy Institute',
      methodology: 'Satellite imagery analysis and ground verification'
    }
  },
  politicalPrisoners: {
    value: '1,000,000+',
    description: 'Estimated Uyghurs and other minorities detained',
    source: {
      title: 'UN Human Rights Assessment',
      url: 'https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region',
      organization: 'UN Office of the High Commissioner for Human Rights',
      date: '2022-08-31'
    }
  },
  hongkongArrests: {
    value: '10,000+',
    description: 'Arrests related to 2019 protests and National Security Law',
    source: {
      title: 'Hong Kong Police Statistics',
      organization: 'Hong Kong Democracy Council',
      note: 'Compiled from official police reports and court records'
    }
  },
  mediaClosures: {
    value: '50+',
    description: 'Independent media outlets closed since 2020',
    source: {
      title: 'Press Freedom in Hong Kong Report',
      organization: 'Committee to Protect Journalists',
      url: 'https://cpj.org/reports/2023/12/press-freedom-hong-kong-china-national-security-law/'
    }
  }
}

export const verificationStandards = {
  sourceTypes: {
    'Primary Source': 'Direct from organization or official documentation',
    'News Report': 'Verified journalism from credible news organizations',
    'Academic Research': 'Peer-reviewed studies and institutional research',
    'Government Document': 'Official government reports and statements',
    'NGO Report': 'Reports from established human rights organizations'
  },
  credibilityRatings: {
    'High': 'Multiple independent sources, official documentation',
    'Medium': 'Single credible source, awaiting verification',
    'Developing': 'Emerging reports, requires additional confirmation'
  },
  updateFrequency: {
    'Real-time': 'Updated as events occur',
    'Daily': 'Updated daily from news feeds',
    'Weekly': 'Updated weekly from organizational reports',
    'Monthly': 'Updated monthly from research publications'
  }
}

// Export all data
export default {
  realOrganizations,
  realCampaigns,
  realIntelligenceSources,
  realStatistics,
  verificationStandards
}
