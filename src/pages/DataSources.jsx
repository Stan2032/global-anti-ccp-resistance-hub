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
import dataSourcesData from '../data/data_sources.json';

const ICON_MAP = {
  Shield: Shield,
  Building: Building,
  FileText: FileText,
};

const DataSources = () => {
  const rssSources = dataSourcesData.rss_sources;

  const majorSources = dataSourcesData.major_sources.map(cat => ({
    ...cat,
    icon: (() => {
      const IconComponent = ICON_MAP[cat.icon_name] || Database;
      return <IconComponent className="w-6 h-6" />;
    })(),
    dataFile: cat.data_file,
  }));

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
            <Database className="w-12 h-12 text-[#22d3ee]" />
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
          className="bg-[#22d3ee]/20 border border-[#1c2a35] p-6 mb-12"
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
            <RefreshCw className="w-8 h-8 text-[#22d3ee]" />
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
                    <Newspaper className="w-6 h-6 text-[#22d3ee]" />
                    <h3 className="text-lg font-semibold group-hover:text-[#22d3ee] transition-colors">
                      {source.name}
                    </h3>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-[#22d3ee] transition-colors" />
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
            <Database className="w-8 h-8 text-[#22d3ee]" />
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
                  <div className="text-[#22d3ee]">{category.icon}</div>
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
                      className="flex items-center space-x-2 text-[#22d3ee] hover:text-[#22d3ee] transition-colors group"
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
          <GraduationCap className="w-16 h-16 text-[#22d3ee] mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Complete Documentation</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            For detailed information about our data collection methodology, verification process, 
            quality standards, and limitations, please see our complete documentation.
          </p>
          <a
            href="https://github.com/Stan2032/global-anti-ccp-resistance-hub/blob/master/DATA_SOURCES.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] font-semibold transition-colors"
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
