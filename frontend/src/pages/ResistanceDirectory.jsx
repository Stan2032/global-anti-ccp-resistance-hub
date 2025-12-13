import React, { useState, useMemo } from 'react';
import { Search, MapPin, Users, Globe, Star, ExternalLink, Mail, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { expandedOrganizations } from '../data/expandedOrganizations';

const ResistanceDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedType, setSelectedType] = useState('All Types');

  const regions = ['All Regions', 'Global', 'North America', 'Europe', 'Asia', 'Oceania'];
  const types = ['All Types', 'Advocacy', 'Human Rights', 'Research', 'Student Organization', 'Foundation', 'Coalition'];

  const filteredOrganizations = useMemo(() => {
    return expandedOrganizations.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.focusAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRegion = selectedRegion === 'All Regions' || org.region === selectedRegion;
      const matchesType = selectedType === 'All Types' || org.type === selectedType;
      
      return matchesSearch && matchesRegion && matchesType;
    });
  }, [searchTerm, selectedRegion, selectedType]);

  const featuredOrganizations = filteredOrganizations.filter(org => org.priority === 'featured');
  const regularOrganizations = filteredOrganizations.filter(org => org.priority !== 'featured');

  const getRegionCount = (region) => {
    if (region === 'All Regions') return expandedOrganizations.length;
    return expandedOrganizations.filter(org => org.region === region).length;
  };

  const getTypeCount = (type) => {
    if (type === 'All Types') return expandedOrganizations.length;
    return expandedOrganizations.filter(org => org.type === type).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Global Resistance Directory</h1>
            <p className="text-xl opacity-90 mb-8">
              Comprehensive database of organizations fighting for freedom and democracy
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{expandedOrganizations.length}</div>
                <div className="text-sm opacity-80">Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">89</div>
                <div className="text-sm opacity-80">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500K+</div>
                <div className="text-sm opacity-80">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-80">Global Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search organizations, focus areas, or locations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {region} ({getRegionCount(region)})
                </option>
              ))}
            </select>
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type} ({getTypeCount(type)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Organizations */}
        {featuredOrganizations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Organizations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOrganizations.map((org) => (
                <Card key={org.id} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{org.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {org.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {org.members}
                        </span>
                      </div>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{org.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {org.focusAreas.slice(0, 3).map((area, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Founded {org.founded}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      org.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {org.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                    {org.email && (
                      <a
                        href={`mailto:${org.email}`}
                        className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Contact
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Organizations */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Organizations ({filteredOrganizations.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularOrganizations.map((org) => (
              <Card key={org.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{org.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {org.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {org.members}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">{org.description}</p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {org.focusAreas.slice(0, 3).map((area, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Founded {org.founded}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    org.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {org.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex-1 justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit
                    </a>
                  )}
                  {org.email && (
                    <a
                      href={`mailto:${org.email}`}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {filteredOrganizations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No organizations found matching your criteria.</div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('All Regions');
                setSelectedType('All Types');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResistanceDirectory;
