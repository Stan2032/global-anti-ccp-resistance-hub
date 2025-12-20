/**
 * Comprehensive CCP Tactics Database
 * Educational content about Chinese Communist Party methods of control,
 * influence, and repression - both domestically and internationally.
 */

export const CCP_TACTICS = {
  domesticRepression: {
    title: 'Domestic Repression',
    description: 'Methods used by the CCP to control and suppress dissent within China',
    tactics: [
      {
        name: 'Mass Surveillance',
        description: 'The CCP has built the world\'s most extensive surveillance state, using facial recognition, AI, and big data to monitor 1.4 billion citizens.',
        examples: [
          'Skynet and Sharp Eyes camera networks with 600+ million cameras',
          'Social credit system tracking citizen behavior',
          'WeChat and Weibo monitoring for "sensitive" content',
          'DNA collection from Uyghurs and Tibetans'
        ],
        sources: ['Human Rights Watch', 'ASPI', 'Freedom House']
      },
      {
        name: 'Arbitrary Detention',
        description: 'Political prisoners are held without trial, often in "residential surveillance at a designated location" (RSDL) or re-education camps.',
        examples: [
          '1+ million Uyghurs in Xinjiang detention camps',
          '709 Crackdown on human rights lawyers (2015)',
          'Hong Kong activists under National Security Law',
          'Tibetan monks detained for religious practice'
        ],
        sources: ['CECC', 'Dui Hua Foundation', 'Amnesty International']
      },
      {
        name: 'Forced Organ Harvesting',
        description: 'Credible evidence indicates the CCP extracts organs from prisoners of conscience, particularly Falun Gong practitioners.',
        examples: [
          'China Tribunal (2019) found forced organ harvesting proven beyond reasonable doubt',
          'Short wait times for organ transplants (days vs. years)',
          'Testimony from former prisoners and medical professionals'
        ],
        sources: ['China Tribunal', 'ETAC', 'Doctors Against Forced Organ Harvesting']
      },
      {
        name: 'Internet Censorship',
        description: 'The Great Firewall blocks foreign websites while domestic platforms are heavily censored.',
        examples: [
          'Blocking of Google, Facebook, Twitter, Wikipedia',
          'Real-time keyword filtering on social media',
          'VPN crackdowns and arrests',
          'Deletion of COVID-19 information in early 2020'
        ],
        sources: ['Citizen Lab', 'GreatFire.org', 'Freedom House']
      },
      {
        name: 'Religious Persecution',
        description: 'The CCP systematically suppresses religious practice outside state-controlled organizations.',
        examples: [
          'Destruction of Uyghur mosques and Islamic culture',
          'Sinicization of Christianity and cross removals',
          'Suppression of Tibetan Buddhism',
          'Persecution of Falun Gong since 1999'
        ],
        sources: ['USCIRF', 'Bitter Winter', 'International Religious Freedom Report']
      }
    ]
  },
  
  transnationalRepression: {
    title: 'Transnational Repression',
    description: 'CCP efforts to silence critics and control diaspora communities abroad',
    tactics: [
      {
        name: 'Overseas Police Stations',
        description: 'The CCP operates undisclosed "service stations" in foreign countries that pressure dissidents to return to China.',
        examples: [
          '100+ stations identified in 53 countries (Safeguard Defenders)',
          'Operations in US, Canada, UK, Netherlands, Ireland',
          'Harassment of Uyghur and Hong Kong activists abroad'
        ],
        sources: ['Safeguard Defenders', 'FBI', 'European Parliament']
      },
      {
        name: 'Hostage Diplomacy',
        description: 'The CCP detains foreign nationals as leverage in diplomatic disputes.',
        examples: [
          'Two Michaels detained in Canada after Huawei CFO arrest',
          'Australian journalists Cheng Lei detained',
          'Exit bans on foreign business executives'
        ],
        sources: ['Reuters', 'BBC', 'Australian Strategic Policy Institute']
      },
      {
        name: 'United Front Work',
        description: 'The CCP\'s United Front Work Department coordinates influence operations targeting overseas Chinese communities and foreign institutions.',
        examples: [
          'Control of Chinese student associations',
          'Infiltration of diaspora community organizations',
          'Pressure on Chinese-language media abroad',
          'Coordination with pro-Beijing business associations'
        ],
        sources: ['ASPI', 'Hoover Institution', 'Jamestown Foundation']
      },
      {
        name: 'Family Coercion',
        description: 'The CCP pressures activists abroad by threatening or detaining their family members in China.',
        examples: [
          'Families interrogated about relatives\' overseas activities',
          'Parents pressured to convince children to return',
          'Relatives detained as hostages'
        ],
        sources: ['Human Rights Watch', 'Freedom House', 'Safeguard Defenders']
      }
    ]
  },
  
  influenceOperations: {
    title: 'Influence Operations',
    description: 'CCP efforts to shape global narratives and undermine democratic institutions',
    tactics: [
      {
        name: 'Confucius Institutes',
        description: 'CCP-funded language and cultural centers at universities that promote censorship and surveillance.',
        examples: [
          '500+ institutes worldwide (many now closed)',
          'Self-censorship on Taiwan, Tibet, Tiananmen',
          'Surveillance of Chinese students',
          'Contracts giving CCP control over curriculum'
        ],
        sources: ['National Association of Scholars', 'ASPI', 'US Senate Report']
      },
      {
        name: 'Media Manipulation',
        description: 'The CCP uses state media, paid content, and social media manipulation to spread propaganda.',
        examples: [
          'CGTN, Xinhua, China Daily global expansion',
          'Paid inserts in Western newspapers',
          'Twitter/Facebook bot networks',
          'TikTok algorithm manipulation'
        ],
        sources: ['Stanford Internet Observatory', 'Oxford Internet Institute', 'ASPI']
      },
      {
        name: 'Elite Capture',
        description: 'The CCP cultivates relationships with foreign politicians, academics, and business leaders.',
        examples: [
          'Thousand Talents Program recruiting researchers',
          'Business deals with former politicians',
          'Academic partnerships with compromised institutions',
          'Political donations through proxies'
        ],
        sources: ['FBI', 'MI5', 'ASIO', 'Congressional reports']
      },
      {
        name: 'Economic Coercion',
        description: 'The CCP uses trade restrictions and market access to punish countries that criticize it.',
        examples: [
          'Australian wine, barley, coal bans after COVID inquiry call',
          'Lithuania trade restrictions over Taiwan office',
          'South Korea THAAD retaliation',
          'NBA China blackout over Hong Kong tweet'
        ],
        sources: ['CSIS', 'Brookings', 'European Parliament']
      }
    ]
  },
  
  militaryExpansion: {
    title: 'Military Expansion',
    description: 'PLA buildup and aggressive posturing threatening regional security',
    tactics: [
      {
        name: 'South China Sea Militarization',
        description: 'The CCP has built artificial islands with military bases in disputed waters, ignoring international law.',
        examples: [
          'Fiery Cross, Subi, Mischief Reef militarization',
          'Anti-ship missiles and fighter deployments',
          'Harassment of Philippine, Vietnamese vessels',
          '2016 Hague ruling rejected by China'
        ],
        sources: ['AMTI/CSIS', 'ISW', 'US Navy']
      },
      {
        name: 'Taiwan Invasion Preparation',
        description: 'The PLA is building capabilities for a potential invasion of Taiwan.',
        examples: [
          'Daily ADIZ incursions (10+ aircraft)',
          'Amphibious assault ship construction',
          'Joint Sword exercises simulating blockade',
          'Russian airborne equipment acquisition (Dec 2025)'
        ],
        sources: ['ISW', 'CSIS', 'US DoD China Military Power Report']
      },
      {
        name: 'Gray Zone Warfare',
        description: 'The CCP uses non-military forces to assert territorial claims while avoiding direct conflict.',
        examples: [
          'Coast Guard harassment of fishing vessels',
          'Maritime militia ("little blue men")',
          'Cyber attacks on critical infrastructure',
          'Disinformation campaigns'
        ],
        sources: ['RAND Corporation', 'CSIS', 'US Naval Institute']
      }
    ]
  }
};

export const COUNTER_TACTICS = {
  personalSecurity: {
    title: 'Personal Security',
    recommendations: [
      'Use VPN and encrypted communications (Signal, ProtonMail)',
      'Be aware of surveillance when traveling to China',
      'Document any harassment or coercion attempts',
      'Connect with human rights organizations for support'
    ]
  },
  advocacy: {
    title: 'Advocacy Actions',
    recommendations: [
      'Contact elected representatives about CCP human rights abuses',
      'Support legislation like the Uyghur Forced Labor Prevention Act',
      'Boycott companies complicit in forced labor',
      'Amplify voices of political prisoners and activists'
    ]
  },
  awareness: {
    title: 'Raising Awareness',
    recommendations: [
      'Share credible information about CCP tactics',
      'Support independent journalism covering China',
      'Attend events and vigils for political prisoners',
      'Counter CCP propaganda with facts and evidence'
    ]
  }
};

export default { CCP_TACTICS, COUNTER_TACTICS };
