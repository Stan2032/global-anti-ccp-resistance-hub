import React, { useState } from 'react';

const ActivistToolkit = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: '📦' },
    { id: 'graphics', name: 'Graphics & Banners', icon: '🎨' },
    { id: 'templates', name: 'Letter Templates', icon: '📝' },
    { id: 'factsheets', name: 'Fact Sheets', icon: '📊' },
    { id: 'guides', name: 'How-To Guides', icon: '📖' },
    { id: 'social', name: 'Social Media', icon: '📱' },
  ];

  const resources = [
    // Graphics & Banners
    {
      id: 1,
      title: 'Free Jimmy Lai Banner',
      category: 'graphics',
      description: 'High-resolution banner for protests and social media',
      format: 'PNG',
      size: '2MB',
      dimensions: '1920x1080',
      downloadUrl: '#',
      preview: '🖼️',
    },
    {
      id: 2,
      title: 'Free Uyghurs Profile Frame',
      category: 'graphics',
      description: 'Social media profile picture overlay',
      format: 'PNG',
      size: '500KB',
      dimensions: '1080x1080',
      downloadUrl: '#',
      preview: '🖼️',
    },
    {
      id: 3,
      title: 'Stand with Hong Kong Poster',
      category: 'graphics',
      description: 'Printable protest poster',
      format: 'PDF',
      size: '3MB',
      dimensions: 'A3',
      downloadUrl: '#',
      preview: '🖼️',
    },
    {
      id: 4,
      title: 'Free Tibet Flag Graphics',
      category: 'graphics',
      description: 'Various sizes for digital and print use',
      format: 'ZIP',
      size: '5MB',
      dimensions: 'Multiple',
      downloadUrl: '#',
      preview: '🖼️',
    },
    
    // Letter Templates
    {
      id: 5,
      title: 'Letter to Representative - Uyghur Genocide',
      category: 'templates',
      description: 'Customizable letter template for US/UK/EU representatives',
      format: 'DOCX',
      size: '50KB',
      downloadUrl: '#',
      preview: '📄',
    },
    {
      id: 6,
      title: 'Letter to Representative - Hong Kong',
      category: 'templates',
      description: 'Template focusing on Hong Kong democracy and Jimmy Lai',
      format: 'DOCX',
      size: '45KB',
      downloadUrl: '#',
      preview: '📄',
    },
    {
      id: 7,
      title: 'Letter to Company - Forced Labor',
      category: 'templates',
      description: 'Template for contacting companies about supply chain issues',
      format: 'DOCX',
      size: '40KB',
      downloadUrl: '#',
      preview: '📄',
    },
    {
      id: 8,
      title: 'Media Pitch Template',
      category: 'templates',
      description: 'Template for pitching stories to journalists',
      format: 'DOCX',
      size: '35KB',
      downloadUrl: '#',
      preview: '📄',
    },
    
    // Fact Sheets
    {
      id: 9,
      title: 'Uyghur Genocide Fact Sheet',
      category: 'factsheets',
      description: 'Key facts and statistics with sources',
      format: 'PDF',
      size: '1MB',
      pages: 2,
      downloadUrl: '#',
      preview: '📊',
    },
    {
      id: 10,
      title: 'Hong Kong Timeline',
      category: 'factsheets',
      description: 'Timeline of events from 2019 to present',
      format: 'PDF',
      size: '2MB',
      pages: 4,
      downloadUrl: '#',
      preview: '📊',
    },
    {
      id: 11,
      title: 'Overseas Police Stations Map',
      category: 'factsheets',
      description: 'Visual guide to CCP police stations worldwide',
      format: 'PDF',
      size: '3MB',
      pages: 1,
      downloadUrl: '#',
      preview: '📊',
    },
    {
      id: 12,
      title: 'Forced Labor Companies List',
      category: 'factsheets',
      description: 'Companies linked to Uyghur forced labor',
      format: 'PDF',
      size: '1.5MB',
      pages: 3,
      downloadUrl: '#',
      preview: '📊',
    },
    
    // How-To Guides
    {
      id: 13,
      title: 'How to Contact Your Representative',
      category: 'guides',
      description: 'Step-by-step guide for effective advocacy',
      format: 'PDF',
      size: '500KB',
      pages: 5,
      downloadUrl: '#',
      preview: '📖',
    },
    {
      id: 14,
      title: 'Organizing a Protest Guide',
      category: 'guides',
      description: 'Legal considerations and best practices',
      format: 'PDF',
      size: '1MB',
      pages: 10,
      downloadUrl: '#',
      preview: '📖',
    },
    {
      id: 15,
      title: 'Digital Security for Activists',
      category: 'guides',
      description: 'Protecting yourself online',
      format: 'PDF',
      size: '2MB',
      pages: 15,
      downloadUrl: '#',
      preview: '📖',
    },
    {
      id: 16,
      title: 'Media Interview Preparation',
      category: 'guides',
      description: 'How to speak to journalists effectively',
      format: 'PDF',
      size: '800KB',
      pages: 8,
      downloadUrl: '#',
      preview: '📖',
    },
    
    // Social Media
    {
      id: 17,
      title: 'Twitter Thread Templates',
      category: 'social',
      description: 'Pre-written threads on key topics',
      format: 'TXT',
      size: '20KB',
      downloadUrl: '#',
      preview: '📱',
    },
    {
      id: 18,
      title: 'Instagram Story Templates',
      category: 'social',
      description: 'Canva-compatible story templates',
      format: 'ZIP',
      size: '10MB',
      downloadUrl: '#',
      preview: '📱',
    },
    {
      id: 19,
      title: 'Hashtag Guide',
      category: 'social',
      description: 'Effective hashtags by topic and platform',
      format: 'PDF',
      size: '200KB',
      pages: 2,
      downloadUrl: '#',
      preview: '📱',
    },
    {
      id: 20,
      title: 'Social Media Calendar',
      category: 'social',
      description: 'Important dates and suggested content',
      format: 'PDF',
      size: '500KB',
      pages: 12,
      downloadUrl: '#',
      preview: '📱',
    },
  ];

  const filteredResources = activeCategory === 'all'
    ? resources
    : resources.filter(r => r.category === activeCategory);

  const getCategoryInfo = (categoryId) => categories.find(c => c.id === categoryId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-700/50">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🧰</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Activist Toolkit</h2>
            <p className="text-slate-400">Downloadable resources for advocacy and awareness</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Free resources to support your activism. All materials are licensed for non-commercial use 
          in human rights advocacy.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-green-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            <span className="text-xs opacity-70">
              ({resources.filter(r => cat.id === 'all' || r.category === cat.id).length})
            </span>
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(resource => {
          const categoryInfo = getCategoryInfo(resource.category);
          
          return (
            <div 
              key={resource.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-green-600/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{resource.preview}</span>
                <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                  {resource.format}
                </span>
              </div>
              
              <h3 className="font-bold text-white mb-1">{resource.title}</h3>
              <p className="text-sm text-slate-400 mb-3">{resource.description}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span>{categoryInfo?.icon} {categoryInfo?.name}</span>
                <span>{resource.size}</span>
              </div>
              
              <button
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>⬇️</span>
                <span>Download</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Request Resources */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Need Something Specific?</h3>
        <p className="text-sm text-slate-400 mb-4">
          Can't find what you're looking for? Let us know what resources would help your advocacy.
        </p>
        <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
          Request a Resource
        </button>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
        <h3 className="font-medium text-white mb-2">Usage Guidelines</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• All resources are free for non-commercial human rights advocacy</li>
          <li>• Please credit the Global Resistance Hub when possible</li>
          <li>• Do not modify resources in ways that misrepresent the facts</li>
          <li>• Share widely to maximize impact</li>
        </ul>
      </div>
    </div>
  );
};

export default ActivistToolkit;
