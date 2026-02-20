import React, { useState } from 'react';
import { Package, Palette, FileText, BarChart3, BookOpen, Smartphone, Wrench, Image, Download } from 'lucide-react';

const ActivistToolkit = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', Icon: Package },
    { id: 'graphics', name: 'Graphics & Banners', Icon: Palette },
    { id: 'templates', name: 'Letter Templates', Icon: FileText },
    { id: 'factsheets', name: 'Fact Sheets', Icon: BarChart3 },
    { id: 'guides', name: 'How-To Guides', Icon: BookOpen },
    { id: 'social', name: 'Social Media', Icon: Smartphone },
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
      Preview: Image,
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
      Preview: Image,
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
      Preview: Image,
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
      Preview: Image,
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
      Preview: FileText,
    },
    {
      id: 6,
      title: 'Letter to Representative - Hong Kong',
      category: 'templates',
      description: 'Template focusing on Hong Kong democracy and Jimmy Lai',
      format: 'DOCX',
      size: '45KB',
      downloadUrl: '#',
      Preview: FileText,
    },
    {
      id: 7,
      title: 'Letter to Company - Forced Labor',
      category: 'templates',
      description: 'Template for contacting companies about supply chain issues',
      format: 'DOCX',
      size: '40KB',
      downloadUrl: '#',
      Preview: FileText,
    },
    {
      id: 8,
      title: 'Media Pitch Template',
      category: 'templates',
      description: 'Template for pitching stories to journalists',
      format: 'DOCX',
      size: '35KB',
      downloadUrl: '#',
      Preview: FileText,
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
      Preview: BarChart3,
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
      Preview: BarChart3,
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
      Preview: BarChart3,
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
      Preview: BarChart3,
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
      Preview: BookOpen,
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
      Preview: BookOpen,
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
      Preview: BookOpen,
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
      Preview: BookOpen,
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
      Preview: Smartphone,
    },
    {
      id: 18,
      title: 'Instagram Story Templates',
      category: 'social',
      description: 'Canva-compatible story templates',
      format: 'ZIP',
      size: '10MB',
      downloadUrl: '#',
      Preview: Smartphone,
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
      Preview: Smartphone,
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
      Preview: Smartphone,
    },
  ];

  const filteredResources = activeCategory === 'all'
    ? resources
    : resources.filter(r => r.category === activeCategory);

  const getCategoryInfo = (categoryId) => categories.find(c => c.id === categoryId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-green-500">
        <div className="flex items-center mb-4">
          <Wrench className="w-8 h-8 text-green-400 mr-3" />
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
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-green-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            <cat.Icon className="w-4 h-4" />
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
              className="bg-[#111820]/50 border border-[#1c2a35] p-4 hover:border-green-600/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <resource.Preview className="w-8 h-8 text-slate-400" />
                <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                  {resource.format}
                </span>
              </div>
              
              <h3 className="font-bold text-white mb-1">{resource.title}</h3>
              <p className="text-sm text-slate-400 mb-3">{resource.description}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1">{categoryInfo && <categoryInfo.Icon className="w-3 h-3" />} {categoryInfo?.name}</span>
                <span>{resource.size}</span>
              </div>
              
              <button
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Request Resources */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Need Something Specific?</h3>
        <p className="text-sm text-slate-400 mb-4">
          Can't find what you're looking for? Let us know what resources would help your advocacy.
        </p>
        <button className="px-6 py-2 bg-slate-700 hover:bg-[#1c2a35] text-white text-sm font-medium transition-colors">
          Request a Resource
        </button>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-blue-900/20 border border-blue-700/50 p-4">
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
