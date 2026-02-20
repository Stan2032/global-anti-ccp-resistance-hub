import React, { useState } from 'react';
import { Mountain, Wheat, Building2, Building, Church, Circle, Map, Handshake } from 'lucide-react';

const RegionalIssues = () => {
  const [activeRegion, setActiveRegion] = useState('inner-mongolia');

  const regions = [
    {
      id: 'inner-mongolia',
      name: 'Inner Mongolia',
      Icon: Mountain,
      nativeName: 'Өвөр Монгол',
      population: '24 million',
      ethnicGroup: 'Mongols (4.2 million)',
      status: 'Autonomous Region of PRC',
      overview: 'Inner Mongolia faces systematic cultural erasure, with Mongolian language banned from schools in 2020. Herders are forcibly relocated, and traditional nomadic lifestyles are being destroyed.',
      keyIssues: [
        {
          title: 'Language Erasure (2020)',
          description: 'In September 2020, the CCP mandated that all schools teach in Mandarin, effectively banning Mongolian-language education. Mass protests erupted, with thousands of students and parents resisting.',
          severity: 'critical',
        },
        {
          title: 'Forced Relocation of Herders',
          description: 'Traditional Mongolian herders are being forcibly relocated to urban areas under "ecological migration" policies, destroying their nomadic way of life.',
          severity: 'high',
        },
        {
          title: 'Cultural Suppression',
          description: 'Mongolian cultural practices, traditional music, and religious ceremonies are increasingly restricted. Activists face detention for promoting Mongolian identity.',
          severity: 'high',
        },
        {
          title: 'Resource Extraction',
          description: 'Massive mining operations destroy grasslands sacred to Mongols. Profits flow to Han Chinese companies while locals face environmental devastation.',
          severity: 'medium',
        },
      ],
      keyFigures: [
        { name: 'Hada', description: 'Activist imprisoned for 19 years (1995-2014), still under house arrest', status: 'Under surveillance' },
        { name: 'Mergen Mongol', description: 'Student activist who led 2020 language protests', status: 'Detained' },
      ],
      organizations: [
        { name: 'Southern Mongolian Human Rights Information Center', url: 'https://www.smhric.org/' },
        { name: 'Inner Mongolian People\'s Party', url: 'https://www.innermongolia.org/' },
      ],
      timeline: [
        { year: '1947', event: 'Inner Mongolia Autonomous Region established under CCP control' },
        { year: '1966-1976', event: 'Cultural Revolution: 16,000+ Mongols killed, 346,000 persecuted' },
        { year: '2011', event: 'Protests after herder Mergen killed by coal truck' },
        { year: '2020', event: 'Mass protests against Mongolian language ban in schools' },
      ],
    },
    {
      id: 'manchuria',
      name: 'Manchuria',
      Icon: Wheat,
      nativeName: '满洲',
      population: '109 million (Northeast China)',
      ethnicGroup: 'Manchu (10 million)',
      status: 'Provinces of PRC',
      overview: 'The Manchu people, who once ruled China as the Qing Dynasty, have been almost completely assimilated. Their language is nearly extinct with fewer than 20 native speakers remaining.',
      keyIssues: [
        {
          title: 'Language Extinction',
          description: 'Manchu language has fewer than 20 native speakers remaining. UNESCO classifies it as critically endangered. No schools teach Manchu.',
          severity: 'critical',
        },
        {
          title: 'Cultural Assimilation',
          description: 'Manchu identity has been systematically erased. Most Manchus are indistinguishable from Han Chinese and have lost their cultural practices.',
          severity: 'high',
        },
        {
          title: 'Historical Revisionism',
          description: 'CCP narratives minimize Manchu contributions to Chinese history and portray the Qing Dynasty negatively.',
          severity: 'medium',
        },
      ],
      keyFigures: [
        { name: 'Zhao Jinchun', description: 'One of the last fluent Manchu speakers, linguist working to preserve the language', status: 'Active' },
      ],
      organizations: [
        { name: 'Manchu Studies Group', url: 'https://www.manchustudiesgroup.org/' },
      ],
      timeline: [
        { year: '1644', event: 'Manchu Qing Dynasty conquers China' },
        { year: '1912', event: 'Qing Dynasty falls, Republic established' },
        { year: '1949', event: 'PRC established, Manchu identity suppressed' },
        { year: '2000s', event: 'UNESCO declares Manchu language critically endangered' },
      ],
    },
    {
      id: 'guangdong',
      name: 'Cantonese Regions',
      Icon: Building2,
      nativeName: '廣東話地區',
      population: '80+ million speakers',
      ethnicGroup: 'Cantonese speakers',
      status: 'Guangdong Province, Hong Kong, Macau',
      overview: 'Cantonese language and culture face increasing pressure from Mandarin-only policies. In Guangdong, Cantonese is being pushed out of schools and media.',
      keyIssues: [
        {
          title: 'Mandarin-Only Education',
          description: 'Schools in Guangdong increasingly teach only in Mandarin. Cantonese is discouraged and sometimes punished in classrooms.',
          severity: 'high',
        },
        {
          title: 'Media Restrictions',
          description: 'Cantonese TV and radio programs are being replaced with Mandarin content. Local stations face pressure to switch languages.',
          severity: 'high',
        },
        {
          title: 'Cultural Identity',
          description: 'Younger generations in Guangdong are losing Cantonese fluency. The language may become endangered within decades.',
          severity: 'medium',
        },
      ],
      keyFigures: [],
      organizations: [
        { name: 'Cantonese Preservation Society', url: '#' },
      ],
      timeline: [
        { year: '2010', event: 'Protests in Guangzhou against Mandarin-only TV proposal' },
        { year: '2014', event: 'Hong Kong Umbrella Movement highlights Cantonese identity' },
        { year: '2020', event: 'National Security Law threatens Cantonese media in HK' },
      ],
    },
    {
      id: 'shanghai',
      name: 'Shanghainese',
      Icon: Building,
      nativeName: '上海话',
      population: '14 million speakers',
      ethnicGroup: 'Wu Chinese speakers',
      status: 'Shanghai Municipality',
      overview: 'Shanghainese (Wu Chinese) is declining rapidly due to Mandarin-only education policies. Young Shanghainese increasingly cannot speak their ancestral language.',
      keyIssues: [
        {
          title: 'Generational Language Loss',
          description: 'Children in Shanghai are educated entirely in Mandarin. Many cannot communicate with grandparents in Shanghainese.',
          severity: 'high',
        },
        {
          title: 'Media Absence',
          description: 'Shanghainese is virtually absent from TV, radio, and official communications.',
          severity: 'medium',
        },
      ],
      keyFigures: [],
      organizations: [],
      timeline: [
        { year: '1990s', event: 'Mandarin becomes dominant in Shanghai schools' },
        { year: '2010s', event: 'Studies show rapid decline in youth Shanghainese fluency' },
      ],
    },
    {
      id: 'christian',
      name: 'Christians',
      Icon: Church,
      nativeName: 'Chinese Christians',
      population: '68-100 million',
      ethnicGroup: 'Various ethnic groups',
      status: 'Persecuted religious minority',
      overview: 'Christianity faces severe persecution under Xi Jinping\'s "Sinicization" policy. Churches are demolished, crosses removed, and underground congregations raided.',
      keyIssues: [
        {
          title: 'Church Demolitions',
          description: 'Thousands of churches have been demolished or had crosses forcibly removed. Even state-approved churches face restrictions.',
          severity: 'critical',
        },
        {
          title: 'Underground Church Raids',
          description: 'House churches are regularly raided. Pastors are detained, and congregants face harassment and surveillance.',
          severity: 'critical',
        },
        {
          title: 'Sinicization Policy',
          description: 'Churches must display CCP flags, sing patriotic songs, and preach CCP-approved sermons. Bibles are censored.',
          severity: 'high',
        },
        {
          title: 'Children Banned',
          description: 'Minors are prohibited from attending church services or receiving religious education.',
          severity: 'high',
        },
      ],
      keyFigures: [
        { name: 'Wang Yi', description: 'Pastor of Early Rain Covenant Church, sentenced to 9 years in 2019', status: 'Imprisoned' },
        { name: 'Zhang Chunlei', description: 'Pastor detained for "fraud" after church activities', status: 'Imprisoned' },
      ],
      organizations: [
        { name: 'China Aid', url: 'https://www.chinaaid.org/' },
        { name: 'International Christian Concern', url: 'https://www.persecution.org/' },
        { name: 'Open Doors', url: 'https://www.opendoorsusa.org/' },
      ],
      timeline: [
        { year: '2014', event: 'Zhejiang cross removal campaign begins' },
        { year: '2018', event: 'New religious regulations restrict Christianity' },
        { year: '2018', event: 'Early Rain Covenant Church raided, Pastor Wang Yi arrested' },
        { year: '2020', event: 'Online religious services banned during COVID' },
      ],
    },
    {
      id: 'falungong',
      name: 'Falun Gong',
      Icon: Circle,
      nativeName: '法轮功',
      population: '70+ million (pre-persecution)',
      ethnicGroup: 'Various ethnic groups',
      status: 'Banned spiritual practice',
      overview: 'Falun Gong has faced brutal persecution since 1999. Practitioners are detained, tortured, and credible evidence suggests they are victims of forced organ harvesting.',
      keyIssues: [
        {
          title: 'Forced Organ Harvesting',
          description: 'Multiple independent investigations have found credible evidence that Falun Gong prisoners are killed for their organs. The China Tribunal concluded this constitutes crimes against humanity.',
          severity: 'critical',
        },
        {
          title: 'Mass Detention',
          description: 'Hundreds of thousands of practitioners have been detained in prisons, labor camps, and psychiatric facilities since 1999.',
          severity: 'critical',
        },
        {
          title: 'Torture',
          description: 'Documented torture methods include electric shocks, force-feeding, sleep deprivation, and sexual violence.',
          severity: 'critical',
        },
        {
          title: 'Surveillance',
          description: 'Practitioners face constant surveillance. Even those released from detention are monitored and harassed.',
          severity: 'high',
        },
      ],
      keyFigures: [
        { name: 'Li Hongzhi', description: 'Founder of Falun Gong, lives in exile in the US', status: 'Exile' },
      ],
      organizations: [
        { name: 'Falun Dafa Information Center', url: 'https://faluninfo.net/' },
        { name: 'Doctors Against Forced Organ Harvesting', url: 'https://dafoh.org/' },
        { name: 'China Tribunal', url: 'https://chinatribunal.com/' },
      ],
      timeline: [
        { year: '1992', event: 'Falun Gong introduced to public in China' },
        { year: '1999', event: 'CCP bans Falun Gong, begins persecution' },
        { year: '2006', event: 'First reports of forced organ harvesting emerge' },
        { year: '2019', event: 'China Tribunal concludes forced organ harvesting is proven' },
      ],
    },
  ];

  const activeRegionData = regions.find(r => r.id === activeRegion);

  const severityColors = {
    critical: 'bg-red-900/30 border-red-700/50 text-red-300',
    high: 'bg-orange-900/30 border-orange-700/50 text-orange-300',
    medium: 'bg-yellow-900/30 border-yellow-700/50 text-yellow-300',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-amber-500">
        <div className="flex items-center mb-4">
          <Map className="w-8 h-8 text-amber-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Other Persecuted Groups</h2>
            <p className="text-slate-400">Beyond Uyghurs, Tibetans, and Hong Kongers</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          CCP repression extends to many groups often overlooked in Western media. Inner Mongolians, 
          Manchus, Christians, Falun Gong practitioners, and linguistic minorities all face persecution.
        </p>
      </div>

      {/* Region Tabs */}
      <div className="flex flex-wrap gap-2">
        {regions.map(region => (
          <button
            key={region.id}
            onClick={() => setActiveRegion(region.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeRegion === region.id
                ? 'bg-amber-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            <region.Icon className="w-4 h-4" />
            <span>{region.name}</span>
          </button>
        ))}
      </div>

      {/* Region Content */}
      {activeRegionData && (
        <div className="space-y-4">
          {/* Overview Card */}
          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <activeRegionData.Icon className="w-6 h-6" />
                  {activeRegionData.name}
                  {activeRegionData.nativeName && (
                    <span className="text-sm font-normal text-slate-400">({activeRegionData.nativeName})</span>
                  )}
                </h3>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-xs text-slate-500">Population</span>
                <p className="text-white">{activeRegionData.population}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Ethnic Group</span>
                <p className="text-white">{activeRegionData.ethnicGroup}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Status</span>
                <p className="text-white">{activeRegionData.status}</p>
              </div>
            </div>
            
            <p className="text-slate-300">{activeRegionData.overview}</p>
          </div>

          {/* Key Issues */}
          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <h4 className="font-semibold text-white mb-4">Key Issues</h4>
            <div className="space-y-3">
              {activeRegionData.keyIssues.map((issue, idx) => (
                <div key={idx} className={`border p-4 ${severityColors[issue.severity]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">{issue.title}</h5>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#111820]/50">
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          {activeRegionData.timeline.length > 0 && (
            <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
              <h4 className="font-semibold text-white mb-4">Timeline</h4>
              <div className="space-y-3">
                {activeRegionData.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <span className="text-amber-400 font-mono text-sm w-16 flex-shrink-0">{event.year}</span>
                    <span className="text-slate-300 text-sm">{event.event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Figures */}
          {activeRegionData.keyFigures.length > 0 && (
            <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
              <h4 className="font-semibold text-white mb-4">Key Figures</h4>
              <div className="space-y-3">
                {activeRegionData.keyFigures.map((figure, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 bg-[#0a0e14]/50">
                    <div>
                      <h5 className="font-medium text-white">{figure.name}</h5>
                      <p className="text-sm text-slate-400">{figure.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      figure.status === 'Imprisoned' ? 'bg-red-900/50 text-red-400' :
                      figure.status === 'Detained' ? 'bg-orange-900/50 text-orange-400' :
                      figure.status === 'Exile' ? 'bg-blue-900/50 text-blue-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {figure.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizations */}
          {activeRegionData.organizations.length > 0 && (
            <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
              <h4 className="font-semibold text-white mb-4">Support Organizations</h4>
              <div className="space-y-2">
                {activeRegionData.organizations.map((org, idx) => (
                  <a
                    key={idx}
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-[#0a0e14]/50 hover:bg-[#0a0e14] transition-colors"
                  >
                    <span className="text-white">{org.name}</span>
                    <span className="text-blue-400">→</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-amber-900/20 border border-amber-700/50 p-4">
        <h3 className="font-medium text-amber-300 mb-2 flex items-center gap-2"><Handshake className="w-5 h-5" /> How You Can Help</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Share information about these lesser-known persecuted groups</li>
          <li>• Support organizations working on these issues</li>
          <li>• Include these groups when advocating to your representatives</li>
          <li>• Learn phrases in endangered languages as a sign of solidarity</li>
        </ul>
      </div>
    </div>
  );
};

export default RegionalIssues;
