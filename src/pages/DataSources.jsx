import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  ExternalLink, 
  CheckCircle, 
  FileText, 
  Shield,
  AlertCircle,
  RefreshCw,
  Building,
  Newspaper,
  GraduationCap
} from 'lucide-react';

const DataSources = () => {
  const rssSources = [
    {
      name: 'Hong Kong Free Press',
      url: 'https://hongkongfp.com/',
      type: 'Independent News',
      region: 'Hong Kong',
      frequency: 'Hourly',
      credibility: 'High',
      description: 'Independent, non-profit news organization covering Hong Kong'
    },
    {
      name: 'Radio Free Asia - China',
      url: 'https://www.rfa.org/english/news/china',
      type: 'Government-Funded News',
      region: 'China',
      frequency: 'Daily',
      credibility: 'High',
      description: 'US government-funded news service covering China and Asia'
    },
    {
      name: 'Radio Free Asia - Uyghur',
      url: 'https://www.rfa.org/english/news/uyghur',
      type: 'Government-Funded News',
      region: 'Xinjiang',
      frequency: 'Daily',
      credibility: 'High',
      description: 'Dedicated coverage of Uyghur human rights issues'
    },
    {
      name: 'Radio Free Asia - Tibet',
      url: 'https://www.rfa.org/english/news/tibet',
      type: 'Government-Funded News',
      region: 'Tibet',
      frequency: 'Daily',
      credibility: 'High',
      description: 'Dedicated coverage of Tibet and Tibetan issues'
    },
    {
      name: 'Taiwan News',
      url: 'https://www.taiwannews.com.tw/',
      type: 'Independent News',
      region: 'Taiwan',
      frequency: 'Hourly',
      credibility: 'High',
      description: 'English-language news from Taiwan perspective'
    },
    {
      name: 'South China Morning Post',
      url: 'https://www.scmp.com/',
      type: 'Newspaper',
      region: 'Hong Kong',
      frequency: 'Hourly',
      credibility: 'Medium',
      description: 'Hong Kong-based newspaper (Pro-Beijing editorial stance but credible reporting)'
    },
    {
      name: 'Human Rights Watch - China',
      url: 'https://www.hrw.org/asia/china-and-tibet',
      type: 'NGO Reports',
      region: 'China',
      frequency: 'Weekly',
      credibility: 'High',
      description: 'International human rights organization reports'
    },
    {
      name: 'Amnesty International - China',
      url: 'https://www.amnesty.org/en/location/asia-and-the-pacific/east-asia/china/',
      type: 'NGO Reports',
      region: 'China',
      frequency: 'Weekly',
      credibility: 'High',
      description: 'Global human rights movement reports and campaigns'
    },
    {
      name: 'BBC News - China',
      url: 'https://www.bbc.com/news/topics/c1vel0q9gynt',
      type: 'Mainstream News',
      region: 'China',
      frequency: 'Daily',
      credibility: 'High',
      description: 'British public service broadcaster with extensive China coverage'
    },
    {
      name: 'The Guardian - China',
      url: 'https://www.theguardian.com/world/china',
      type: 'Newspaper',
      region: 'China',
      frequency: 'Daily',
      credibility: 'High',
      description: 'UK-based independent newspaper with investigative reporting on China'
    },
    {
      name: 'Committee to Protect Journalists',
      url: 'https://cpj.org/asia/china/',
      type: 'Press Freedom',
      region: 'China',
      frequency: 'Weekly',
      credibility: 'High',
      description: 'Press freedom advocacy and journalist safety reporting'
    }
  ];

  const majorSources = [
    {
      category: 'Political Prisoners',
      icon: <Shield className="w-6 h-6" />,
      sources: [
        { name: 'Dui Hua Foundation', url: 'https://duihua.org/' },
        { name: 'CECC Political Prisoner Database', url: 'https://www.cecc.gov/political-prisoner-database' },
        { name: 'Human Rights Watch', url: 'https://www.hrw.org/tag/political-prisoners' },
        { name: 'Amnesty International', url: 'https://www.amnesty.org/' },
        { name: 'Committee to Protect Journalists', url: 'https://cpj.org/' }
      ],
      dataFile: 'political_prisoners_research.json',
      count: '60 prisoners documented'
    },
    {
      category: 'Detention Facilities',
      icon: <Building className="w-6 h-6" />,
      sources: [
        { name: 'ASPI Xinjiang Data Project', url: 'https://xjdp.aspi.org.au/' },
        { name: 'Xinjiang Police Files', url: 'https://www.xinjiangpolicefiles.org/' },
        { name: 'China Cables (ICIJ)', url: 'https://www.icij.org/investigations/china-cables/' },
        { name: 'Uyghur Human Rights Project', url: 'https://uhrp.org/' },
        { name: 'Human Rights Watch', url: 'https://www.hrw.org/tag/xinjiang' }
      ],
      dataFile: 'detention_facilities_research.json',
      count: 'Satellite imagery analysis'
    },
    {
      category: 'Sanctioned Officials',
      icon: <FileText className="w-6 h-6" />,
      sources: [
        { name: 'US Treasury OFAC', url: 'https://sanctionssearch.ofac.treas.gov/' },
        { name: 'UK Foreign Office Sanctions', url: 'https://www.gov.uk/government/collections/financial-sanctions-regime-specific-consolidated-lists-and-releases' },
        { name: 'EU Sanctions Map', url: 'https://www.sanctionsmap.eu/' },
        { name: 'Canada Sanctions', url: 'https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/index.aspx' }
      ],
      dataFile: 'sanctioned_officials_research.json',
      count: 'Official government lists'
    },
    {
      category: 'Forced Labor Companies',
      icon: <Building className="w-6 h-6" />,
      sources: [
        { name: 'ASPI Uyghurs for Sale', url: 'https://www.aspi.org.au/report/uyghurs-sale' },
        { name: 'US Customs and Border Protection', url: 'https://www.cbp.gov/trade/programs-administration/forced-labor' },
        { name: 'Sheffield Hallam University', url: 'https://www.shu.ac.uk/helena-kennedy-centre-international-justice/research-and-projects/all-projects/in-broad-daylight' },
        { name: 'Business & Human Rights Resource Centre', url: 'https://www.business-humanrights.org/' }
      ],
      dataFile: 'forced_labor_companies_research.json',
      count: 'Supply chain research'
    }
  ];

  const getCredibilityColor = (credibility) => {
    switch (credibility) {
      case 'High': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Low': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      default: return 'text-slate-400 bg-[#111820] border-[#1c2a35]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Database className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold">Data Sources & Methodology</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Every piece of information on this platform comes from verified, credible sources. 
            We never display simulated, fake, or placeholder data.
          </p>
        </motion.div>

        {/* Our Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-600/20 border border-blue-500/30 p-6 mb-12"
        >
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">Our Commitment to Transparency</h2>
              <p className="text-slate-300 mb-4">
                We believe transparency builds trust. Every data point on this platform is traceable to its original source. 
                If data is unavailable, we clearly state that rather than showing false information.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>All sources verified and linked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No simulated or fake data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Regular updates and verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Clear methodology documentation</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live RSS Feeds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <RefreshCw className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold">Live Intelligence Feeds (RSS)</h2>
          </div>
          <p className="text-slate-300 mb-6">
            Our live intelligence feed aggregates real-time news from verified sources. Updates every 30 seconds.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rssSources.map((source, index) => (
              <motion.a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-[#111820] border border-[#1c2a35] p-5 hover:bg-[#1c2a35] transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Newspaper className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">
                      {source.name}
                    </h3>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-slate-300 text-sm mb-3">{source.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getCredibilityColor(source.credibility)}`}>
                    {source.credibility} Credibility
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-[#1c2a35] text-slate-300">
                    {source.region}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-[#1c2a35] text-slate-300">
                    {source.frequency}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Major Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold">Major Data Sources by Category</h2>
          </div>
          <div className="space-y-6">
            {majorSources.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-[#111820] border border-[#1c2a35] p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-blue-400">{category.icon}</div>
                  <h3 className="text-2xl font-bold">{category.category}</h3>
                  <span className="text-slate-400 text-sm">({category.count})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {category.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      <span className="group-hover:underline">{source.name}</span>
                    </a>
                  ))}
                </div>
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Data File: <code className="bg-[#0a0e14] px-2 py-1 rounded">/src/data/{category.dataFile}</code></span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Full Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[#111820] border border-[#1c2a35] p-8 text-center"
        >
          <GraduationCap className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Complete Documentation</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            For detailed information about our data collection methodology, verification process, 
            quality standards, and limitations, please see our complete documentation.
          </p>
          <a
            href="https://github.com/Stan2032/global-anti-ccp-resistance-hub/blob/master/DATA_SOURCES.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>View Full DATA_SOURCES.md</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Report Issues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 bg-[#111820] border border-[#1c2a35] p-6"
        >
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Found an Issue?</h3>
              <p className="text-slate-300 mb-4">
                If you find incorrect information or have additional sources to contribute, 
                please report it on our GitHub repository.
              </p>
              <a
                href="https://github.com/Stan2032/global-anti-ccp-resistance-hub/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1c2a35] hover:bg-[#111820] text-white font-medium rounded transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Report on GitHub</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataSources;
