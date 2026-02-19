import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UrgentCaseTimer from '../components/UrgentCaseTimer';
import CaseStudies from '../components/CaseStudies';
import MemorialWall from '../components/MemorialWall';
import SourceAttribution from '../components/ui/SourceAttribution';
import politicalPrisonersData from '../data/political_prisoners_research.json';

// Mapping function to convert JSON data to component format
const mapJsonToComponentFormat = (jsonResults) => {
  return jsonResults.map((item) => {
    const output = item.output;
    
    // Map status
    let status = output.status;
    if (status === 'DETAINED') status = 'IMPRISONED';
    
    // Determine urgency based on status and health
    let urgency = 'MEDIUM';
    if (status === 'IMPRISONED' || status === 'DISAPPEARED') {
      urgency = 'CRITICAL';
    }
    
    // Parse sentence to extract charges if available
    const charges = output.sentence ? [output.sentence] : [];
    
    // Create background from available information
    const background = item.input.split(' - ').slice(1).join(' - ') || output.latest_news || 'Political prisoner';
    
    // Determine health concerns
    const healthConcerns = output.health_status && 
      (output.health_status.toLowerCase().includes('deteriorating') ||
       output.health_status.toLowerCase().includes('poor') ||
       output.health_status.toLowerCase().includes('torture') ||
       output.health_status.toLowerCase().includes('malnutrition'));
    
    // Create source object for SourceAttribution component
    const source = {
      name: output.source_url ? new URL(output.source_url).hostname.replace('www.', '') : 'Unknown',
      url: output.source_url,
      type: output.source_url ? (() => {
        const hostname = new URL(output.source_url).hostname.toLowerCase();
        
        // Whitelist of known credible sources by type
        const ngoSources = new Set([
          'www.hrw.org', 'hrw.org',
          'www.amnesty.org', 'amnesty.org',
          'www.frontlinedefenders.org', 'frontlinedefenders.org',
          'pen.org', 'www.pen-international.org',
          'chinaaid.org', 'www.article19.org',
          'www.hongkongwatch.org', 'savetibet.org',
          'southmongolia.org', 'www.ibanet.org'
        ]);
        
        const newsSources = new Set([
          'www.bbc.com', 'bbc.com',
          'www.reuters.com', 'reuters.com',
          'www.theguardian.com', 'theguardian.com',
          'apnews.com', 'www.aljazeera.com',
          'hongkongfp.com', 'www.npr.org',
          'www.voanews.com', 'www.rfa.org',
          'thechinaproject.com', 'aninews.in',
          'news.artnet.com', 'www.pillarcatholic.com'
        ]);
        
        const govSources = new Set([
          'humanrightscommission.house.gov',
          'www.ohchr.org'
        ]);
        
        if (ngoSources.has(hostname)) return 'NGO Report';
        if (newsSources.has(hostname)) return 'News Report';
        if (govSources.has(hostname)) return 'Government';
        
        return 'News Report'; // Default fallback
      })() : 'Unknown',
      verified: output.confidence === 'HIGH',
      description: output.latest_news || '',
      date: new Date().toISOString().split('T')[0]
    };
    
    return {
      name: output.prisoner_name,
      chineseName: '', // Not provided in JSON
      status: status,
      location: output.location,
      charges: charges,
      sentence: output.sentence,
      background: background,
      arrestDate: '', // Not provided in JSON
      urgency: urgency,
      healthConcerns: healthConcerns,
      internationalAttention: output.international_response ? 'HIGH' : 'MEDIUM',
      internationalResponse: output.international_response,
      latestNews: output.latest_news,
      healthStatus: output.health_status,
      source: source, // Add source object
      confidence: output.confidence
    };
  });
};

// Convert JSON data to component format
const PRISONERS_FROM_JSON = mapJsonToComponentFormat(politicalPrisonersData.results);

// Original hardcoded prisoners data (preserved for reference and unique cases)
const PRISONERS_DATA_ORIGINAL = [
  {
    name: 'Jimmy Lai',
    chineseName: '黎智英',
    status: 'IMPRISONED',
    location: 'Stanley Prison, Hong Kong',
    charges: ['National Security Law - Collusion with Foreign Forces', 'Sedition', 'Conspiracy to Collude with Foreign Forces'],
    sentence: 'GUILTY on all 3 charges (Dec 15, 2025) - Sentencing pending, faces LIFE IMPRISONMENT',
    background: 'Founder of Apple Daily newspaper, pro-democracy media mogul. Convicted after landmark 2-year trial. British citizen.',
    arrestDate: '2020-08-10',
    verdictDate: '2025-12-15',
    urgency: 'CRITICAL',
    age: 78,
    healthConcerns: true,
    internationalAttention: 'HIGH',
    internationalResponse: 'UK, US, EU condemned verdict. UK Foreign Secretary called for immediate release.',
    image: '/images/prisoners/jimmy-lai.jpg',
    actions: ['Write to your representative', 'Sign petitions', 'Share on social media', 'Contact UK Foreign Office']
  },
  {
    name: 'Ilham Tohti',
    chineseName: '伊力哈木·土赫提',
    status: 'IMPRISONED',
    location: 'Urumqi Prison, Xinjiang',
    charges: ['Separatism'],
    sentence: 'Life imprisonment',
    background: 'Uyghur economist and professor, advocated for dialogue between Uyghurs and Han Chinese',
    arrestDate: '2014-01-15',
    urgency: 'CRITICAL',
    awards: ['Martin Ennals Award 2016', 'Sakharov Prize 2019'],
    healthConcerns: true,
    internationalAttention: 'HIGH',
    image: '/images/prisoners/ilham-tohti.jpg'
  },
  {
    name: 'Gao Zhisheng',
    chineseName: '高智晟',
    status: 'DISAPPEARED',
    location: 'Unknown since August 2017',
    charges: ['Subversion'],
    sentence: 'Multiple detentions',
    background: 'Human rights lawyer, defended Falun Gong practitioners, Christians, and dispossessed farmers',
    lastSeen: '2017-08-13',
    urgency: 'CRITICAL',
    healthConcerns: true,
    tortureDocumented: true,
    image: '/images/prisoners/gao-zhisheng.jpg'
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
    hungerStrike: true,
    image: '/images/prisoners/zhang-zhan.jpg'
  },
  {
    name: 'Gedhun Choekyi Nyima',
    chineseName: '根敦确吉尼玛',
    status: 'DISAPPEARED',
    location: 'Unknown since 1995',
    charges: ['None - abducted as child'],
    background: '11th Panchen Lama recognized by Dalai Lama, abducted at age 6 by Chinese authorities',
    abductionDate: '1995-05-17',
    currentAge: 35,
    urgency: 'CRITICAL',
    internationalAttention: 'HIGH',
    image: '/images/prisoners/panchen-lama.jpg'
  },
  {
    name: 'Liu Xiaobo',
    chineseName: '刘晓波',
    status: 'DECEASED',
    location: 'Died in custody',
    charges: ['Inciting Subversion'],
    sentence: '11 years',
    background: 'Nobel Peace Prize laureate, author of Charter 08 calling for political reform',
    deathDate: '2017-07-13',
    awards: ['Nobel Peace Prize 2010'],
    causeOfDeath: 'Liver cancer - denied medical parole until final days',
    legacy: 'Symbol of peaceful resistance to CCP authoritarianism',
    image: '/images/prisoners/liu-xiaobo.jpg'
  },
  {
    name: 'Tonyee Chow Hang-tung',
    chineseName: '邹幸彤',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion', 'Inciting Subversion'],
    sentence: '22 months + awaiting trial',
    background: 'Human rights lawyer, former vice-chairwoman of Hong Kong Alliance, organized Tiananmen vigils',
    arrestDate: '2021-09-08',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'HIGH',
    image: '/images/prisoners/chow-hang-tung.jpg'
  },
  {
    name: 'Xu Zhiyong',
    chineseName: '许志永',
    status: 'IMPRISONED',
    location: 'Shandong Province',
    charges: ['Subversion of State Power'],
    sentence: '14 years',
    background: 'Legal scholar, founder of New Citizens Movement advocating for civil rights and anti-corruption',
    arrestDate: '2020-02-15',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'HIGH',
    image: '/images/prisoners/xu-zhiyong.jpg'
  },
  {
    name: 'Ding Jiaxi',
    chineseName: '丁家喜',
    status: 'IMPRISONED',
    location: 'Shandong Province',
    charges: ['Subversion of State Power'],
    sentence: '12 years',
    background: 'Human rights lawyer, New Citizens Movement activist, defended land rights cases',
    arrestDate: '2019-12-26',
    urgency: 'CRITICAL',
    healthConcerns: true,
    tortureDocumented: true,
    image: '/images/prisoners/ding-jiaxi.jpg'
  },
  {
    name: 'Niu Tengyu',
    chineseName: '牛腾宇',
    status: 'IMPRISONED',
    location: 'Unknown',
    charges: ['Picking Quarrels', 'Inciting Subversion'],
    sentence: '14 years',
    background: 'Young programmer who created software to bypass Great Firewall, shared censored COVID information',
    arrestDate: '2020-06-01',
    urgency: 'CRITICAL',
    age: 29,
    healthConcerns: true,
    image: '/images/prisoners/niu-tengyu.jpg'
  },
  {
    name: 'Xu Na',
    chineseName: '许那',
    status: 'IMPRISONED',
    location: 'Beijing',
    charges: ['Using Cult to Undermine Law'],
    sentence: '8 years',
    background: 'Falun Gong practitioner, artist, previously imprisoned for 5 years',
    arrestDate: '2020-07-19',
    urgency: 'CRITICAL',
    healthConcerns: true,
    previousDetention: true,
    image: '/images/prisoners/xu-na.jpg'
  },
  {
    name: 'Meryem Emet',
    chineseName: '麦尔耶姆·艾麦提',
    status: 'IMPRISONED',
    location: 'Xinjiang',
    charges: ['Separatism'],
    sentence: '20 years',
    background: 'Uyghur woman detained for alleged association with relatives abroad',
    arrestDate: '2018-01-01',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'MEDIUM',
    image: '/images/prisoners/meryem-emet.jpg'
  },
  {
    name: 'Helchem Pazil',
    chineseName: '海力其木·帕孜力',
    status: 'IMPRISONED',
    location: 'Xinjiang',
    charges: ['Separatism', 'Religious Extremism'],
    sentence: '17 years',
    background: 'Uyghur religious figure detained during mass internment campaign',
    arrestDate: '2017-01-01',
    urgency: 'CRITICAL',
    healthConcerns: true,
    image: '/images/prisoners/helchem-pazil.jpg'
  },
  {
    name: 'Lobsang Trinle',
    chineseName: '洛桑赤列',
    status: 'IMPRISONED',
    location: 'Tibet',
    charges: ['Inciting Separatism'],
    sentence: '5 years',
    background: 'Tibetan monk detained for possessing photos of Dalai Lama',
    arrestDate: '2019-01-01',
    urgency: 'CRITICAL',
    healthConcerns: true,
    image: '/images/prisoners/lobsang-trinle.jpg'
  },
  {
    name: 'Chang Weiping',
    chineseName: '常玮平',
    status: 'IMPRISONED',
    location: 'Shaanxi Province',
    charges: ['Subversion of State Power'],
    sentence: 'Pretrial detention since 2020',
    background: 'Human rights lawyer who documented torture, part of 709 crackdown',
    arrestDate: '2020-10-22',
    urgency: 'CRITICAL',
    healthConcerns: true,
    tortureDocumented: true,
    image: '/images/prisoners/chang-weiping.jpg'
  },
  {
    name: 'Li Yuhan',
    chineseName: '李昱函',
    status: 'IMPRISONED',
    location: 'Shenyang, Liaoning',
    charges: ['Picking Quarrels and Provoking Trouble'],
    sentence: 'Awaiting sentencing',
    background: 'Human rights lawyer who defended Falun Gong practitioners and 709 lawyers',
    arrestDate: '2017-10-09',
    urgency: 'CRITICAL',
    healthConcerns: true,
    age: 76,
    image: '/images/prisoners/li-yuhan.jpg'
  },
  {
    name: 'Hao Zhiwei',
    chineseName: '郝志伟',
    status: 'IMPRISONED',
    location: 'Henan Province',
    charges: ['Organizing and Using Cult to Undermine Law'],
    sentence: '8 years',
    background: 'Christian house church leader detained for religious activities',
    arrestDate: '2019-01-01',
    urgency: 'CRITICAL',
    healthConcerns: true,
    image: '/images/prisoners/hao-zhiwei.jpg'
  },
  {
    name: 'Benny Tai',
    chineseName: '戴耀廷',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion'],
    sentence: '10 years (Hong Kong 47)',
    background: 'Legal scholar, organizer of 2020 pro-democracy primaries, Occupy Central co-founder',
    arrestDate: '2021-01-06',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'HIGH',
    image: '/images/prisoners/benny-tai.jpg'
  },
  {
    name: 'Joshua Wong',
    chineseName: '黄之锋',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion', 'Multiple protest charges'],
    sentence: '4 years 8 months (Hong Kong 47) + additional sentences',
    background: 'Student activist, Demosisto founder, face of 2014 Umbrella Movement',
    arrestDate: '2020-09-24',
    urgency: 'CRITICAL',
    age: 28,
    healthConcerns: false,
    internationalAttention: 'HIGH',
    image: '/images/prisoners/joshua-wong.jpg'
  },
  {
    name: 'Claudia Mo',
    chineseName: '毛孟静',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion'],
    sentence: '4 years 2 months (Hong Kong 47)',
    background: 'Former journalist and Legislative Council member, pro-democracy advocate',
    arrestDate: '2021-01-06',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'HIGH',
    image: '/images/prisoners/claudia-mo.jpg'
  },
  {
    name: 'Gwyneth Ho',
    chineseName: '何桂蓝',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion'],
    sentence: '7 years (Hong Kong 47)',
    background: 'Former journalist, elected in 2020 primaries, documented police brutality',
    arrestDate: '2021-01-06',
    urgency: 'CRITICAL',
    age: 33,
    healthConcerns: false,
    internationalAttention: 'HIGH',
    image: '/images/prisoners/gwyneth-ho.jpg'
  },
  {
    name: 'Lester Shum',
    chineseName: '岑耀信',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion'],
    sentence: '6 years 9 months (Hong Kong 47)',
    background: 'Former student leader, Umbrella Movement participant',
    arrestDate: '2021-01-06',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'MEDIUM',
    image: '/images/prisoners/lester-shum.jpg'
  },
  {
    name: 'Rinchen Tsultrim',
    chineseName: '仁青次仁',
    status: 'IMPRISONED',
    location: 'Sichuan Province',
    charges: ['Inciting Separatism'],
    sentence: '4 years 6 months',
    background: 'Tibetan monk detained for sharing Dalai Lama teachings online',
    arrestDate: '2019-08-01',
    urgency: 'CRITICAL',
    healthConcerns: true,
    tortureDocumented: true,
    image: '/images/prisoners/rinchen-tsultrim.jpg'
  },
  {
    name: 'Ekpar Asat',
    chineseName: '艾克帕尔·艾赛提',
    status: 'IMPRISONED',
    location: 'Xinjiang',
    charges: ['Inciting Ethnic Hatred'],
    sentence: '15 years',
    background: 'Uyghur tech entrepreneur, detained after attending US State Department program',
    arrestDate: '2016-04-01',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'HIGH',
    image: '/images/prisoners/ekpar-asat.jpg'
  }
,
  // ==================== HONG KONG 47 ADDITIONAL ====================
  {
    name: 'Au Nok-hin',
    chineseName: '区诺轩',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion'],
    sentence: '7 years 3 months (Hong Kong 47)',
    background: 'Former Legislative Council member, organized 2020 pro-democracy primaries',
    arrestDate: '2021-01-06',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Leung Kwok-hung',
    chineseName: '梁国雄',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion'],
    sentence: '6 years 9 months (Hong Kong 47)',
    background: 'Known as "Long Hair", veteran activist and former legislator, socialist politician',
    arrestDate: '2021-01-06',
    urgency: 'CRITICAL',
    age: 68,
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Jimmy Sham',
    chineseName: '岑子杰',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion'],
    sentence: '6 years 9 months (Hong Kong 47)',
    background: 'Former convenor of Civil Human Rights Front, organized million-person marches in 2019',
    arrestDate: '2021-01-06',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Gordon Ng',
    chineseName: '吴政亨',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion'],
    sentence: '7 years 3 months (Hong Kong 47)',
    background: 'Activist known as "Gau Gau", participated in 2020 primaries',
    arrestDate: '2021-01-06',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'MEDIUM'
  },
  {
    name: 'Tam Tak-chi',
    chineseName: '谭得志',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Subversion', 'Sedition'],
    sentence: '5 years 4 months (Hong Kong 47)',
    background: 'Vice chairman of People Power party, radio host, known as "Fast Beat"',
    arrestDate: '2020-09-06',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'MEDIUM'
  },
  // ==================== APPLE DAILY STAFF ====================
  {
    name: 'Cheung Kim-hung',
    chineseName: '张剑虹',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Collusion with Foreign Forces'],
    sentence: 'Awaiting sentencing',
    background: 'CEO of Apple Daily parent company Next Digital',
    arrestDate: '2021-06-17',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Ryan Law',
    chineseName: '罗伟光',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Collusion with Foreign Forces'],
    sentence: 'Awaiting sentencing',
    background: 'Editor-in-chief of Apple Daily newspaper',
    arrestDate: '2021-06-17',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Yeung Ching-kee',
    chineseName: '杨清奇',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Collusion with Foreign Forces'],
    sentence: 'Awaiting sentencing',
    background: 'Apple Daily editorial writer known as "Li Ping"',
    arrestDate: '2021-06-27',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'MEDIUM'
  },
  // ==================== TIANANMEN VIGIL ORGANIZERS ====================
  {
    name: 'Albert Ho',
    chineseName: '何俊仁',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Inciting Subversion'],
    sentence: '4 years 6 months',
    background: 'Former Democratic Party chairman, human rights lawyer, organized Tiananmen vigils',
    arrestDate: '2021-09-08',
    urgency: 'CRITICAL',
    age: 73,
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Lee Cheuk-yan',
    chineseName: '李卓人',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Inciting Subversion'],
    sentence: '4 years 6 months',
    background: 'Former legislator, labor rights activist, Hong Kong Alliance chairman',
    arrestDate: '2021-09-08',
    urgency: 'CRITICAL',
    age: 67,
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  // ==================== 612 HUMANITARIAN RELIEF FUND ====================
  {
    name: 'Cardinal Joseph Zen',
    chineseName: '陈日君',
    status: 'CONVICTED',
    location: 'Hong Kong',
    charges: ['Failure to register society'],
    sentence: 'HK$4,000 fine (convicted)',
    background: 'Cardinal of Catholic Church, 90+ years old, arrested for supporting protesters',
    arrestDate: '2022-05-11',
    urgency: 'HIGH',
    age: 92,
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Margaret Ng',
    chineseName: '吴霭仪',
    status: 'CONVICTED',
    location: 'Hong Kong',
    charges: ['Failure to register society'],
    sentence: 'HK$4,000 fine (convicted)',
    background: 'Veteran barrister and former legislator, defended rule of law',
    arrestDate: '2022-05-11',
    urgency: 'HIGH',
    age: 76,
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Denise Ho',
    chineseName: '何韵诗',
    status: 'CONVICTED',
    location: 'Hong Kong',
    charges: ['Failure to register society'],
    sentence: 'HK$4,000 fine (convicted)',
    background: 'Cantopop singer and LGBTQ activist, blacklisted in mainland China',
    arrestDate: '2022-05-11',
    urgency: 'HIGH',
    healthConcerns: false,
    internationalAttention: 'HIGH'
  },
  // ==================== UYGHUR PRISONERS ====================
  {
    name: 'Gulshan Abbas',
    chineseName: '古丽仙·阿巴斯',
    status: 'IMPRISONED',
    location: 'Xinjiang',
    charges: ['Terrorism'],
    sentence: '20 years',
    background: 'Retired medical doctor, sister of US-based Uyghur activist Rushan Abbas',
    arrestDate: '2018-09-11',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Rahile Dawut',
    chineseName: '热依拉·达吾提',
    status: 'DISAPPEARED',
    location: 'Unknown since 2017',
    charges: ['Unknown'],
    sentence: 'Unknown',
    background: 'Renowned Uyghur folklorist and professor at Xinjiang University',
    lastSeen: '2017-12-01',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Yalqun Rozi',
    chineseName: '亚力坤·肉孜',
    status: 'IMPRISONED',
    location: 'Xinjiang',
    charges: ['Inciting Separatism'],
    sentence: '15 years',
    background: 'Uyghur textbook editor, detained for including Uyghur cultural content',
    arrestDate: '2016-01-01',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'MEDIUM'
  },
  {
    name: 'Sanubar Tursun',
    chineseName: '萨努巴尔·吐尔逊',
    status: 'IMPRISONED',
    location: 'Xinjiang',
    charges: ['Separatism'],
    sentence: '15 years',
    background: 'Famous Uyghur singer, detained during cultural crackdown',
    arrestDate: '2018-01-01',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'MEDIUM'
  },
  // ==================== TIBETAN PRISONERS ====================
  {
    name: 'Go Sherab Gyatso',
    chineseName: '果·喜饶嘉措',
    status: 'IMPRISONED',
    location: 'Sichuan Province',
    charges: ['Inciting Separatism'],
    sentence: '10 years',
    background: 'Prominent Tibetan monk and scholar, wrote about Tibetan identity',
    arrestDate: '2020-10-26',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Kunchok Jinpa',
    chineseName: '贡觉金巴',
    status: 'DECEASED',
    location: 'Died in custody',
    charges: ['Leaking State Secrets'],
    sentence: '21 years',
    background: 'Tibetan tour guide who shared information with foreign contacts',
    deathDate: '2021-02-06',
    causeOfDeath: 'Died shortly after release from prison due to torture injuries',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'MEDIUM'
  },
  {
    name: 'Tashi Wangchuk',
    chineseName: '扎西旺楚',
    status: 'RELEASED',
    location: 'Tibet (under surveillance)',
    charges: ['Inciting Separatism'],
    sentence: '5 years (released 2021)',
    background: 'Tibetan language rights advocate, featured in NYT documentary',
    arrestDate: '2016-01-27',
    urgency: 'HIGH',
    healthConcerns: false,
    internationalAttention: 'HIGH'
  },
  // ==================== MAINLAND DISSIDENTS ====================
  {
    name: 'Wang Quanzhang',
    chineseName: '王全璋',
    status: 'RELEASED',
    location: 'Beijing (under surveillance)',
    charges: ['Subversion of State Power'],
    sentence: '4.5 years (released 2020)',
    background: '709 crackdown lawyer, defended Falun Gong and land rights cases',
    arrestDate: '2015-07-10',
    urgency: 'HIGH',
    healthConcerns: true,
    tortureDocumented: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Jiang Tianyong',
    chineseName: '江天勇',
    status: 'RELEASED',
    location: 'Henan (under surveillance)',
    charges: ['Inciting Subversion'],
    sentence: '2 years (released 2019)',
    background: '709 crackdown lawyer, defended Chen Guangcheng and Falun Gong',
    arrestDate: '2016-11-21',
    urgency: 'HIGH',
    healthConcerns: true,
    tortureDocumented: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Li Qiaochu',
    chineseName: '李翘楚',
    status: 'IMPRISONED',
    location: 'Shandong Province',
    charges: ['Inciting Subversion'],
    sentence: '3 years 8 months',
    background: 'Feminist activist, partner of Xu Zhiyong, documented his detention',
    arrestDate: '2021-02-06',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'MEDIUM'
  },
  {
    name: 'Huang Qi',
    chineseName: '黄琦',
    status: 'IMPRISONED',
    location: 'Sichuan Province',
    charges: ['Leaking State Secrets'],
    sentence: '12 years',
    background: 'Founder of 64 Tianwang human rights website, documented Sichuan earthquake',
    arrestDate: '2016-11-28',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Chen Guangcheng',
    chineseName: '陈光诚',
    status: 'EXILED',
    location: 'United States',
    charges: ['Intentional Destruction of Property'],
    sentence: '4 years 3 months (escaped 2012)',
    background: 'Blind self-taught lawyer, exposed forced abortions, escaped house arrest',
    escapeDate: '2012-04-22',
    urgency: 'MEDIUM',
    healthConcerns: false,
    internationalAttention: 'HIGH'
  },
  // ==================== STAND NEWS JOURNALISTS ====================
  {
    name: 'Chung Pui-kuen',
    chineseName: '钟沛权',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['Sedition'],
    sentence: '21 months',
    background: 'Former editor-in-chief of Stand News, independent news outlet',
    arrestDate: '2021-12-29',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Patrick Lam',
    chineseName: '林绍桐',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['Sedition'],
    sentence: '21 months',
    background: 'Acting editor-in-chief of Stand News at time of closure',
    arrestDate: '2021-12-29',
    urgency: 'CRITICAL',
    healthConcerns: false,
    internationalAttention: 'MEDIUM'
  },
  // ==================== ADDITIONAL CASES ====================
  {
    name: 'Gui Minhai',
    chineseName: '桂民海',
    status: 'IMPRISONED',
    location: 'China',
    charges: ['Illegally Providing Intelligence Overseas'],
    sentence: '10 years',
    background: 'Swedish citizen, Hong Kong bookseller, abducted from Thailand',
    arrestDate: '2015-10-15',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'HIGH'
  },
  {
    name: 'Cyd Ho',
    chineseName: '何秀兰',
    status: 'IMPRISONED',
    location: 'Hong Kong',
    charges: ['National Security Law - Inciting Subversion'],
    sentence: '4 years 6 months',
    background: 'Former legislator, social worker, democracy advocate',
    arrestDate: '2021-09-08',
    urgency: 'CRITICAL',
    age: 70,
    healthConcerns: true,
    internationalAttention: 'MEDIUM'
  },
  // ==================== DECEMBER 2025 UPDATES ====================
  {
    name: 'Xin Ruoyu',
    chineseName: '辛若雨',
    status: 'DISAPPEARED',
    location: 'Unknown - "Black Jail"',
    charges: ['Extrajudicial detention'],
    sentence: 'No formal charges',
    background: 'Young mother in her thirties, forcibly disappeared into a Chinese "black jail" around July 2024. Her detention is extrajudicial with no legal basis.',
    disappearanceDate: '2024-07-01',
    urgency: 'CRITICAL',
    healthConcerns: true,
    internationalAttention: 'MEDIUM',
    source: 'Forbes Human Rights Day 2025 Report'
  },
  {
    name: 'Guan Heng',
    chineseName: '关恒',
    status: 'AT RISK',
    location: 'US Immigration Detention - Facing Deportation',
    charges: ['None - Asylum seeker'],
    sentence: 'N/A',
    background: 'Citizen journalist from Henan, China. Secretly filmed Uyghur detention camps and released rare video evidence. Fled to US, detained by ICE in August 2025. Faces deportation to Uganda which could lead to return to China.',
    arrestDate: '2025-08-01',
    urgency: 'CRITICAL',
    age: 38,
    healthConcerns: true,
    internationalAttention: 'HIGH',
    source: 'NPR, NYT, CPJ December 2025'
  }

];

// Merge JSON data with original hardcoded data
// Primary source is JSON data, with original data as reference
const PRISONERS_DATA = PRISONERS_FROM_JSON;

const StatusBadge = ({ status }) => {
  const colors = {
    IMPRISONED: 'bg-red-600',
    DISAPPEARED: 'bg-yellow-600',
    DECEASED: 'bg-gray-600',
    RELEASED: 'bg-green-600',
    'AT RISK': 'bg-orange-600',
    EXILE: 'bg-blue-600'
  };
  
  return (
    <span className={`${colors[status] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
      {status}
    </span>
  );
};

const UrgencyBadge = ({ urgency }) => {
  if (urgency !== 'CRITICAL') return null;
  
  return (
    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse ml-2">
      URGENT
    </span>
  );
};

const PrisonerCard = ({ prisoner, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg cursor-pointer border border-slate-700 hover:border-red-500 transition-all"
      onClick={() => onClick(prisoner)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(prisoner) } }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${prisoner.name}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{prisoner.name}</h3>
            <p className="text-gray-400 text-sm">{prisoner.chineseName}</p>
          </div>
          <div className="flex items-center">
            <StatusBadge status={prisoner.status} />
            <UrgencyBadge urgency={prisoner.urgency} />
          </div>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{prisoner.background}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Location:</span>
            <span className="text-gray-300">{prisoner.location}</span>
          </div>
          {prisoner.sentence && (
            <div className="flex justify-between">
              <span className="text-gray-500">Sentence:</span>
              <span className="text-gray-300">{prisoner.sentence}</span>
            </div>
          )}
          {prisoner.healthConcerns && (
            <div className="flex items-center text-yellow-500">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Health concerns reported
            </div>
          )}
        </div>
        
        {prisoner.awards && prisoner.awards.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-gray-500">Awards:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {prisoner.awards.map((award, i) => (
                <span key={i} className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-0.5 rounded">
                  {award}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {prisoner.source && prisoner.source.url && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <SourceAttribution source={prisoner.source} compact={true} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PrisonerModal = ({ prisoner, onClose }) => {
  if (!prisoner) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${prisoner.name}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{prisoner.name}</h2>
              <p className="text-gray-400">{prisoner.chineseName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <StatusBadge status={prisoner.status} />
            <UrgencyBadge urgency={prisoner.urgency} />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Background</h3>
              <p className="text-gray-200">{prisoner.background}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Location</h3>
                <p className="text-gray-200">{prisoner.location}</p>
              </div>
              {prisoner.sentence && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Sentence</h3>
                  <p className="text-gray-200">{prisoner.sentence}</p>
                </div>
              )}
            </div>
            
            {prisoner.charges && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Charges</h3>
                <ul className="list-disc list-inside text-gray-200">
                  {prisoner.charges.map((charge, i) => (
                    <li key={i}>{charge}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {prisoner.awards && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">International Recognition</h3>
                <div className="flex flex-wrap gap-2">
                  {prisoner.awards.map((award, i) => (
                    <span key={i} className="bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded">
                      {award}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {prisoner.healthConcerns && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-400 uppercase mb-1">Health Alert</h3>
                <p className="text-gray-200">
                  Serious health concerns have been reported. 
                  {prisoner.hungerStrike && ' Has engaged in hunger strike protests.'}
                  {prisoner.tortureDocumented && ' Torture has been documented.'}
                </p>
              </div>
            )}
            
            {prisoner.legacy && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Legacy</h3>
                <p className="text-gray-200">{prisoner.legacy}</p>
              </div>
            )}
            
            {prisoner.latestNews && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Latest News</h3>
                <p className="text-gray-200">{prisoner.latestNews}</p>
              </div>
            )}
            
            {prisoner.internationalResponse && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">International Response</h3>
                <p className="text-gray-200">{prisoner.internationalResponse}</p>
              </div>
            )}
            
            {prisoner.healthStatus && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Health Status</h3>
                <p className="text-gray-200">{prisoner.healthStatus}</p>
              </div>
            )}
            
            {prisoner.source && prisoner.source.url && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Source Information</h3>
                <SourceAttribution source={prisoner.source} compact={false} />
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Take Action</h3>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=Free ${prisoner.name}! ${prisoner.background} #FreePoliticalPrisoners #HumanRights`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Share on Twitter
              </a>
              <a
                href="https://www.amnesty.org/en/get-involved/write-for-rights/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Write for Rights
              </a>
              <a
                href="https://www.cecc.gov/resources/political-prisoner-database"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                CECC Database
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PoliticalPrisoners = () => {
  const [selectedPrisoner, setSelectedPrisoner] = useState(null);
  const [filter, setFilter] = useState('ALL');
  
  const filteredPrisoners = PRISONERS_DATA.filter(p => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });
  
  const stats = {
    total: PRISONERS_DATA.length,
    imprisoned: PRISONERS_DATA.filter(p => p.status === 'IMPRISONED').length,
    disappeared: PRISONERS_DATA.filter(p => p.status === 'DISAPPEARED').length,
    critical: PRISONERS_DATA.filter(p => p.urgency === 'CRITICAL').length
  };
  
  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Political Prisoners</h1>
          <p className="text-gray-400">
            Documenting individuals detained by the CCP for their beliefs, speech, or peaceful activism.
            These cases represent only a fraction of the thousands held in China's prisons and detention facilities.
          </p>
        </div>
        
        {/* Detention Timers */}
        <div className="mb-8">
          <UrgentCaseTimer />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-gray-400 text-sm">Documented Cases</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-500">{stats.imprisoned}</p>
            <p className="text-gray-400 text-sm">Currently Imprisoned</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-yellow-500">{stats.disappeared}</p>
            <p className="text-gray-400 text-sm">Disappeared</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats.critical}</p>
            <p className="text-gray-400 text-sm">Critical Urgency</p>
          </div>
        </div>
        
        {/* Alert Banner */}
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-red-400 font-semibold">BREAKING: Jimmy Lai Found GUILTY (Dec 15, 2025)</h3>
              <p className="text-gray-300 text-sm mt-1">
                78-year-old media mogul Jimmy Lai has been convicted of sedition and collusion with foreign forces under Hong Kong's National Security Law. 
                He faces life imprisonment. His case marks the death of press freedom in Hong Kong.
              </p>
            </div>
          </div>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['ALL', 'IMPRISONED', 'DISAPPEARED', 'DECEASED', 'AT RISK', 'EXILE', 'RELEASED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {status === 'ALL' ? 'All Cases' : status}
            </button>
          ))}
        </div>
        
        {/* Prisoner Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrisoners.map((prisoner, index) => (
            <PrisonerCard
              key={index}
              prisoner={prisoner}
              onClick={setSelectedPrisoner}
            />
          ))}
        </div>
        
        {/* Case Study Deep Dives */}
        <div className="mt-12">
          <CaseStudies />
        </div>

        {/* Memorial Wall */}
        <div className="mb-8">
          <MemorialWall />
        </div>
        
        {/* Resources */}
        <div className="mt-12 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="https://www.cecc.gov/resources/political-prisoner-database"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors"
            >
              <h3 className="text-white font-semibold">CECC Database</h3>
              <p className="text-gray-400 text-sm">US Congressional database of 10,000+ political prisoners</p>
            </a>
            <a
              href="https://duihua.org/resources/political-prisoners-database/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors"
            >
              <h3 className="text-white font-semibold">Dui Hua Foundation</h3>
              <p className="text-gray-400 text-sm">50,000+ prisoner records since 1980</p>
            </a>
            <a
              href="https://shahit.biz/eng/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors"
            >
              <h3 className="text-white font-semibold">Xinjiang Victims Database</h3>
              <p className="text-gray-400 text-sm">35,000+ documented Uyghur detainees</p>
            </a>
          </div>
        </div>
        
        {/* Modal */}
        {selectedPrisoner && (
          <PrisonerModal
            prisoner={selectedPrisoner}
            onClose={() => setSelectedPrisoner(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PoliticalPrisoners;
