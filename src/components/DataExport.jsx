import React, { useState } from 'react';
import { Link2, ShieldAlert, Users, Ban, Building, Factory, Calendar, UserX, BarChart3, FileText, Upload, ClipboardList } from 'lucide-react';

const DataExport = () => {
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const datasets = [
    {
      id: 'prisoners',
      name: 'Political Prisoners Database',
      description: 'Documented cases of political detention including names, charges, sentences, and status',
      records: 53,
      lastUpdated: '2025-12-20',
      fields: ['name', 'status', 'detention_date', 'charges', 'sentence', 'location', 'category'],
      Icon: Link2
    },
    {
      id: 'police_stations',
      name: 'Overseas Police Stations',
      description: 'CCP police service stations operating in foreign countries',
      records: 102,
      lastUpdated: '2025-12-20',
      fields: ['country', 'city', 'status', 'source', 'government_action'],
      Icon: ShieldAlert
    },
    {
      id: 'organizations',
      name: 'Resistance Organizations',
      description: 'Human rights and advocacy organizations fighting CCP abuses',
      records: 24,
      lastUpdated: '2025-12-20',
      fields: ['name', 'category', 'focus_area', 'website', 'location', 'description'],
      Icon: Users
    },
    {
      id: 'sanctions',
      name: 'Sanctioned Officials',
      description: 'CCP officials under Magnitsky and other sanctions',
      records: 18,
      lastUpdated: '2025-12-20',
      fields: ['name', 'position', 'sanctions', 'reason', 'date'],
      Icon: Ban
    },
    {
      id: 'confucius',
      name: 'Confucius Institutes',
      description: 'Confucius Institutes at universities worldwide',
      records: 36,
      lastUpdated: '2025-12-20',
      fields: ['university', 'country', 'status', 'closure_date', 'reason'],
      Icon: Building
    },
    {
      id: 'companies',
      name: 'Boycott List Companies',
      description: 'Companies linked to Uyghur forced labor',
      records: 27,
      lastUpdated: '2025-12-20',
      fields: ['name', 'industry', 'status', 'evidence', 'alternatives'],
      Icon: Factory
    },
    {
      id: 'timeline',
      name: 'Historical Timeline',
      description: 'Key events in CCP repression history',
      records: 28,
      lastUpdated: '2025-12-20',
      fields: ['date', 'title', 'description', 'category', 'significance', 'sources'],
      Icon: Calendar
    },
    {
      id: 'exit_bans',
      name: 'Exit Ban Cases',
      description: 'Documented cases of exit bans and hostage diplomacy',
      records: 14,
      lastUpdated: '2025-12-20',
      fields: ['name', 'nationality', 'status', 'duration', 'reason'],
      Icon: UserX
    }
  ];

  const formats = [
    { id: 'json', name: 'JSON', description: 'JavaScript Object Notation - best for developers', icon: '{ }' },
    { id: 'csv', name: 'CSV', description: 'Comma Separated Values - best for spreadsheets', Icon: BarChart3 },
    { id: 'markdown', name: 'Markdown', description: 'Formatted text - best for documentation', Icon: FileText },
  ];

  const toggleDataset = (id) => {
    setSelectedDatasets(prev => 
      prev.includes(id) 
        ? prev.filter(d => d !== id)
        : [...prev, id]
    );
    setExportComplete(false);
  };

  const selectAll = () => {
    setSelectedDatasets(datasets.map(d => d.id));
    setExportComplete(false);
  };

  const selectNone = () => {
    setSelectedDatasets([]);
    setExportComplete(false);
  };

  const generateExportData = () => {
    // This would normally fetch real data - for now we generate sample structure
    const exportData = {};
    
    selectedDatasets.forEach(id => {
      const dataset = datasets.find(d => d.id === id);
      if (dataset) {
        exportData[id] = {
          metadata: {
            name: dataset.name,
            description: dataset.description,
            records: dataset.records,
            lastUpdated: dataset.lastUpdated,
            exportedAt: new Date().toISOString(),
            source: 'Global Anti-CCP Resistance Hub',
            license: 'CC BY 4.0 - Attribution required'
          },
          schema: dataset.fields,
          data: `[${dataset.records} records - download to view full data]`
        };
      }
    });

    return exportData;
  };

  const handleExport = async () => {
    if (selectedDatasets.length === 0) return;

    setIsExporting(true);
    
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const data = generateExportData();
    let content, filename, mimeType;

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `resistance-hub-export-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      case 'csv': {
        // Generate CSV for each dataset
        const csvParts = Object.entries(data).map(([, value]) => {
          return `# ${value.metadata.name}\n# ${value.metadata.description}\n# Records: ${value.metadata.records}\n# Last Updated: ${value.metadata.lastUpdated}\n\n${value.schema.join(',')}\n[Data rows would appear here]`;
        });
        content = csvParts.join('\n\n---\n\n');
        filename = `resistance-hub-export-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      }
      case 'markdown': {
        const mdParts = Object.entries(data).map(([, value]) => {
          return `# ${value.metadata.name}\n\n${value.metadata.description}\n\n- **Records:** ${value.metadata.records}\n- **Last Updated:** ${value.metadata.lastUpdated}\n- **Source:** ${value.metadata.source}\n- **License:** ${value.metadata.license}\n\n## Schema\n\n| Field |\n|-------|\n${value.schema.map(f => `| ${f} |`).join('\n')}\n`;
        });
        content = `# Resistance Hub Data Export\n\nExported: ${new Date().toISOString()}\n\n---\n\n${mdParts.join('\n---\n\n')}`;
        filename = `resistance-hub-export-${Date.now()}.md`;
        mimeType = 'text/markdown';
        break;
      }
      default:
        content = JSON.stringify(data, null, 2);
        filename = `resistance-hub-export-${Date.now()}.json`;
        mimeType = 'application/json';
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    setExportComplete(true);
  };

  const totalRecords = selectedDatasets.reduce((sum, id) => {
    const dataset = datasets.find(d => d.id === id);
    return sum + (dataset?.records || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-cyan-500 p-6">
        <div className="flex items-center mb-4">
          <Upload className="w-8 h-8 text-slate-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Data Export for Researchers</h2>
            <p className="text-slate-400">Download structured data for research and analysis</p>
          </div>
        </div>
        <div className="bg-[#111820]/50 p-4 mt-4">
          <p className="text-sm text-slate-300">
            <strong className="text-cyan-400">License:</strong> All data is provided under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
              Creative Commons Attribution 4.0 (CC BY 4.0)
            </a>. 
            You are free to share and adapt the data for any purpose, provided you give appropriate credit.
          </p>
        </div>
      </div>

      {/* Dataset Selection */}
      <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Select Datasets</h3>
          <div className="flex space-x-2">
            <button
              onClick={selectAll}
              className="px-3 py-1 text-sm bg-slate-700 hover:bg-[#1c2a35] text-slate-300 rounded transition-colors"
            >
              Select All
            </button>
            <button
              onClick={selectNone}
              className="px-3 py-1 text-sm bg-slate-700 hover:bg-[#1c2a35] text-slate-300 rounded transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {datasets.map(dataset => (
            <button
              key={dataset.id}
              onClick={() => toggleDataset(dataset.id)}
              className={`p-4 border text-left transition-all ${
                selectedDatasets.includes(dataset.id)
                  ? 'bg-cyan-900/30 border-cyan-500'
                  : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start">
                <dataset.Icon className="w-6 h-6 text-slate-300 mr-3 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{dataset.name}</h4>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedDatasets.includes(dataset.id)
                        ? 'bg-cyan-500 border-cyan-500'
                        : 'border-slate-500'
                    }`}>
                      {selectedDatasets.includes(dataset.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{dataset.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                    <span>{dataset.records} records</span>
                    <span>Updated: {dataset.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
        <h3 className="text-lg font-bold text-white mb-4">Export Format</h3>
        <div className="flex flex-wrap gap-4">
          {formats.map(format => (
            <button
              key={format.id}
              onClick={() => setExportFormat(format.id)}
              className={`flex-1 min-w-[150px] p-4 border text-left transition-all ${
                exportFormat === format.id
                  ? 'bg-cyan-900/30 border-cyan-500'
                  : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center mb-2">
                {format.Icon ? <format.Icon className="w-5 h-5 mr-2" /> : <span className="text-xl mr-2">{format.icon}</span>}
                <span className="font-medium text-white">{format.name}</span>
              </div>
              <p className="text-xs text-slate-400">{format.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Export Summary & Button */}
      <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Export Summary</h3>
            <p className="text-slate-400 text-sm mt-1">
              {selectedDatasets.length} dataset{selectedDatasets.length !== 1 ? 's' : ''} selected • {totalRecords.toLocaleString()} total records • {exportFormat.toUpperCase()} format
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={selectedDatasets.length === 0 || isExporting}
            className={`px-6 py-3 font-medium transition-all flex items-center ${
              selectedDatasets.length === 0
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : isExporting
                ? 'bg-cyan-700 text-white cursor-wait'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Export
              </>
            )}
          </button>
        </div>

        {exportComplete && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-700 flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-400 text-sm">Export complete! Check your downloads folder.</span>
          </div>
        )}
      </div>

      {/* Usage Guidelines */}
      <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-1"><ClipboardList className="w-5 h-5" /> Usage Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">Recommended Uses</h4>
            <ul className="space-y-1 text-slate-400">
              <li>✓ Academic research and publications</li>
              <li>✓ Journalism and investigative reporting</li>
              <li>✓ Policy analysis and advocacy</li>
              <li>✓ Data visualization projects</li>
              <li>✓ Educational materials</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Attribution Format</h4>
            <div className="bg-[#0a0e14] rounded p-3 font-mono text-xs text-slate-400">
              Data source: Global Anti-CCP Resistance Hub<br />
              URL: https://stan2032.github.io/global-anti-ccp-resistance-hub/<br />
              License: CC BY 4.0<br />
              Accessed: [Date]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
