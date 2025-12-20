// Live Data Sources Configuration
// Real-time intelligence feeds and monitoring systems

export const liveDataFeeds = {
  // News RSS Feeds
  newsFeeds: [
    {
      id: 'hongkongfp',
      name: 'Hong Kong Free Press',
      url: 'https://hongkongfp.com/feed/',
      description: 'Independent news from Hong Kong',
      category: 'news',
      region: 'Hong Kong',
      updateFrequency: 'hourly',
      credibility: 'high',
      sources: [
        {
          title: 'Hong Kong Free Press Official Website',
          url: 'https://hongkongfp.com/',
          type: 'Primary Source',
          description: 'Independent, non-profit news organization'
        }
      ]
    },
    {
      id: 'rfa_china',
      name: 'Radio Free Asia - China',
      url: 'https://www.rfa.org/english/news/china/rss.xml',
      description: 'US government-funded news service covering China',
      category: 'news',
      region: 'China',
      updateFrequency: 'daily',
      credibility: 'high',
      sources: [
        {
          title: 'Radio Free Asia Official Website',
          url: 'https://www.rfa.org/',
          type: 'Primary Source',
          description: 'US government-funded news service'
        }
      ]
    },
    {
      id: 'scmp_china',
      name: 'South China Morning Post',
      url: 'https://www.scmp.com/rss/91/china',
      description: 'Hong Kong-based English-language newspaper',
      category: 'news',
      region: 'China/Hong Kong',
      updateFrequency: 'hourly',
      credibility: 'medium',
      note: 'Pro-Beijing editorial stance but credible reporting',
      sources: [
        {
          title: 'SCMP RSS Feeds',
          url: 'https://www.scmp.com/rss',
          type: 'Primary Source'
        }
      ]
    }
  ],

  // Human Rights Organizations
  humanRightsFeeds: [
    {
      id: 'hrw_china',
      name: 'Human Rights Watch - China',
      url: 'https://www.hrw.org/news/china/rss',
      description: 'Human rights violations documentation',
      category: 'human_rights',
      region: 'China',
      updateFrequency: 'weekly',
      credibility: 'high',
      sources: [
        {
          title: 'HRW China Reports',
          url: 'https://www.hrw.org/news/china',
          type: 'NGO Report',
          organization: 'Human Rights Watch'
        }
      ]
    },
    {
      id: 'amnesty_china',
      name: 'Amnesty International - China',
      url: 'https://www.amnesty.org/en/location/asia-and-the-pacific/east-asia/china/rss/',
      description: 'Human rights monitoring and advocacy',
      category: 'human_rights',
      region: 'China',
      updateFrequency: 'weekly',
      credibility: 'high',
      sources: [
        {
          title: 'Amnesty International China',
          url: 'https://www.amnesty.org/en/location/asia-and-the-pacific/east-asia/china/',
          type: 'NGO Report',
          organization: 'Amnesty International'
        }
      ]
    }
  ],

  // Research Organizations
  researchFeeds: [
    {
      id: 'aspi_china',
      name: 'Australian Strategic Policy Institute',
      url: 'https://www.aspi.org.au/rss.xml',
      description: 'Strategic and defense analysis on China',
      category: 'research',
      region: 'China',
      updateFrequency: 'weekly',
      credibility: 'high',
      sources: [
        {
          title: 'ASPI Official Website',
          url: 'https://www.aspi.org.au/',
          type: 'Academic Research',
          organization: 'Australian Strategic Policy Institute'
        }
      ]
    }
  ],

  // Surveillance Monitoring
  surveillanceMonitoring: [
    {
      id: 'surveillance_alerts',
      name: 'Digital Rights Surveillance Alerts',
      description: 'Automated monitoring of surveillance technology deployment',
      category: 'surveillance',
      region: 'Global',
      updateFrequency: 'real-time',
      credibility: 'medium',
      methodology: 'Automated scanning of public procurement databases and tech company announcements',
      sources: [
        {
          title: 'China: Police Big Data Systems Violate Privacy',
          url: 'https://www.hrw.org/news/2017/11/19/china-police-big-data-systems-violate-privacy-target-dissent',
          organization: 'Human Rights Watch',
          type: 'NGO Report',
          date: '2017-11-19'
        }
      ]
    }
  ]
}

// Real-time data simulation for demonstration
export const simulatedLiveData = {
  recentLeaks: [
    {
      id: 'leak_001',
      timestamp: new Date().toISOString(),
      title: 'Internal CCP Documents on Hong Kong Surveillance',
      description: 'Leaked communications reveal expanded surveillance operations targeting overseas Hong Kong activists',
      severity: 'high',
      source: 'Anonymous whistleblower',
      verification: 'pending',
      region: 'Hong Kong',
      tags: ['surveillance', 'hong-kong', 'activists'],
      sources: [
        {
          title: 'China: Hikvision cameras help track Uyghurs',
          url: 'https://www.business-humanrights.org/en/latest-news/china-hikvision-cameras-help-track-uyghurs-and-other-ethnic-groups-in-xinjiang-report-finds/',
          type: 'News Report',
          organization: 'Business & Human Rights Resource Centre'
        }
      ]
    },
    {
      id: 'leak_002',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      title: 'Xinjiang Detention Facility Expansion Plans',
      description: 'Construction contracts reveal plans for new detention facilities in Xinjiang region',
      severity: 'critical',
      source: 'ICIJ Network',
      verification: 'verified',
      region: 'Xinjiang',
      tags: ['xinjiang', 'detention', 'construction'],
      sources: [
        {
          title: 'China\'s Algorithms of Repression',
          url: 'https://www.hrw.org/report/2019/05/01/chinas-algorithms-repression/reverse-engineering-xinjiang-police-mass',
          organization: 'Human Rights Watch',
          type: 'NGO Report',
          date: '2019-05-01'
        }
      ]
    }
  ],

  threatAlerts: [
    {
      id: 'threat_001',
      timestamp: new Date().toISOString(),
      title: 'Increased Digital Surveillance Activity',
      description: 'Unusual network scanning activity detected targeting resistance organizations',
      severity: 'medium',
      region: 'Global',
      affectedOrganizations: ['Hong Kong Democracy Council', 'World Uyghur Congress'],
      recommendations: [
        'Enable additional VPN protection',
        'Review communication security protocols',
        'Monitor for unusual account activity'
      ],
      sources: [
        {
          title: 'How China is using AI to extend censorship and surveillance',
          url: 'https://www.washingtonpost.com/world/2025/12/01/china-ai-censorship-surveillance/',
          publication: 'Washington Post',
          type: 'News Report',
          date: '2025-12-01'
        }
      ]
    }
  ],

  campaignUpdates: [
    {
      id: 'campaign_001',
      timestamp: new Date().toISOString(),
      campaignId: 'free-jimmy-lai',
      title: 'International Pressure Mounts for Jimmy Lai Release',
      description: 'UK Parliament members call for immediate action on Jimmy Lai case',
      type: 'political_support',
      impact: 'high',
      sources: [
        {
          title: 'Support Jimmy Lai Campaign',
          url: 'https://supportjimmylai.com/press/',
          type: 'Campaign Website'
        }
      ]
    }
  ]
}

// Data aggregation and processing functions
export const dataProcessor = {
  // Aggregate data from multiple sources
  aggregateFeeds: async () => {
    // In a real implementation, this would fetch from actual RSS feeds
    // For now, return simulated data
    return {
      news: simulatedLiveData.recentLeaks.slice(0, 5),
      threats: simulatedLiveData.threatAlerts,
      campaigns: simulatedLiveData.campaignUpdates,
      lastUpdated: new Date().toISOString()
    }
  },

  // Process and categorize incoming data
  categorizeData: (data) => {
    const categories = {
      critical: [],
      high: [],
      medium: [],
      low: []
    }

    data.forEach(item => {
      if (categories[item.severity]) {
        categories[item.severity].push(item)
      }
    })

    return categories
  },

  // Generate real-time statistics
  generateStats: () => {
    const now = new Date()
    const baseStats = {
      activeMonitoring: 247,
      documentsProcessed: 15683,
      threatsDetected: 156,
      organizationsTracked: 89
    }

    // Add small random variations to simulate real-time updates
    return {
      activeMonitoring: baseStats.activeMonitoring + Math.floor(Math.random() * 5),
      documentsProcessed: baseStats.documentsProcessed + Math.floor(Math.random() * 3),
      threatsDetected: baseStats.threatsDetected + (Math.random() > 0.9 ? 1 : 0),
      organizationsTracked: baseStats.organizationsTracked,
      lastUpdate: now.toISOString()
    }
  }
}

// Feed validation and credibility scoring
export const feedValidator = {
  validateSource: (source) => {
    const credibilityScores = {
      'Primary Source': 10,
      'Government Document': 9,
      'Academic Research': 8,
      'NGO Report': 7,
      'News Report': 6,
      'Social Media': 3,
      'Anonymous': 2
    }

    return {
      isValid: source.url && source.title,
      credibilityScore: credibilityScores[source.type] || 1,
      hasVerification: !!source.organization || !!source.publication,
      lastChecked: new Date().toISOString()
    }
  },

  checkFeedHealth: (feedId) => {
    // Simulate feed health checking
    return {
      feedId,
      status: 'operational',
      lastUpdate: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 1000) + 200,
      errorCount: 0
    }
  }
}

export default {
  liveDataFeeds,
  simulatedLiveData,
  dataProcessor,
  feedValidator
}
