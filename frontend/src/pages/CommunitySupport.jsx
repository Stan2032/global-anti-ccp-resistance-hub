import React, { useState } from 'react';
import { Users, Heart, Shield, MessageCircle, MapPin, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CommunitySupport = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedSupport, setSelectedSupport] = useState('all');

  const supportRequests = [
    {
      id: 1,
      type: 'legal',
      title: 'Legal Aid Needed - Hong Kong Activist',
      description: 'Seeking legal representation for activist facing National Security Law charges. Urgent assistance required.',
      location: 'Hong Kong',
      priority: 'critical',
      posted: '2 hours ago',
      responses: 12,
      verified: true,
      tags: ['legal-aid', 'hong-kong', 'nsl']
    },
    {
      id: 2,
      type: 'financial',
      title: 'Emergency Fund - Uyghur Family Relocation',
      description: 'Family of four needs assistance relocating from Turkey to Canada. Documentation and travel costs required.',
      location: 'Turkey → Canada',
      priority: 'high',
      posted: '6 hours ago',
      responses: 8,
      verified: true,
      tags: ['uyghur', 'relocation', 'family']
    },
    {
      id: 3,
      type: 'housing',
      title: 'Safe House Network - Tibetan Refugees',
      description: 'Expanding safe house network for Tibetan refugees in Nepal. Seeking host families and funding.',
      location: 'Nepal',
      priority: 'medium',
      posted: '1 day ago',
      responses: 15,
      verified: true,
      tags: ['tibet', 'refugees', 'housing']
    },
    {
      id: 4,
      type: 'medical',
      title: 'Medical Support - Torture Survivor',
      description: 'Former political prisoner requires specialized medical care for torture-related injuries.',
      location: 'United States',
      priority: 'high',
      posted: '1 day ago',
      responses: 6,
      verified: true,
      tags: ['medical', 'torture', 'survivor']
    }
  ];

  const mutualAidNetworks = [
    {
      name: 'Hong Kong Diaspora Support Network',
      members: 2847,
      location: 'Global',
      focus: 'Supporting Hong Kong activists and families worldwide',
      contact: 'hkdsn@protonmail.com',
      verified: true,
      services: ['Legal Aid', 'Financial Support', 'Mental Health', 'Job Placement']
    },
    {
      name: 'Uyghur Emergency Response Fund',
      members: 1523,
      location: 'Europe & North America',
      focus: 'Emergency assistance for Uyghur refugees and families',
      contact: 'uerf@tutanota.com',
      verified: true,
      services: ['Emergency Funding', 'Legal Support', 'Translation', 'Housing']
    },
    {
      name: 'Tibet Solidarity Network',
      members: 3421,
      location: 'Global',
      focus: 'Supporting Tibetan refugees and cultural preservation',
      contact: 'tsn@riseup.net',
      verified: true,
      services: ['Cultural Programs', 'Education Support', 'Medical Aid', 'Advocacy']
    },
    {
      name: 'Chinese Dissidents Support Circle',
      members: 892,
      location: 'North America',
      focus: 'Supporting Chinese democracy activists and dissidents',
      contact: 'cdsc@protonmail.com',
      verified: true,
      services: ['Legal Aid', 'Mental Health', 'Career Support', 'Community Building']
    }
  ];

  const safetyResources = [
    {
      title: 'Security Center',
      description: 'Comprehensive digital security guides and tools for activists',
      type: 'guide',
      urgency: 'essential',
      link: '/security'
    },
    {
      title: 'Legal Aid Directory',
      description: 'Verified lawyers specializing in human rights cases',
      type: 'directory',
      urgency: 'high',
      link: '/legal-directory'
    },
    {
      title: 'Mental Health Support',
      description: 'Trauma-informed counseling for activists and survivors',
      type: 'support',
      urgency: 'high',
      link: '/mental-health'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'legal': return <Shield className="w-4 h-4" />;
      case 'financial': return <Heart className="w-4 h-4" />;
      case 'housing': return <MapPin className="w-4 h-4" />;
      case 'medical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Community Support</h1>
              <p className="text-blue-100">Mutual aid and support networks for the resistance community</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">847</div>
              <div className="text-blue-100">Active Support Requests</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">8,734</div>
            <div className="text-gray-600">Community Members</div>
          </Card>
          <Card className="p-6 text-center">
            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-gray-600">Successful Aids</div>
          </Card>
          <Card className="p-6 text-center">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-gray-600">Emergency Support</div>
          </Card>
          <Card className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">89</div>
            <div className="text-gray-600">Countries Covered</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Requests */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Active Support Requests</h2>
                <Button variant="primary" size="sm">
                  Submit Request
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Regions</option>
                  <option value="asia">Asia</option>
                  <option value="europe">Europe</option>
                  <option value="americas">Americas</option>
                  <option value="global">Global</option>
                </select>
                <select 
                  value={selectedSupport}
                  onChange={(e) => setSelectedSupport(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="legal">Legal Aid</option>
                  <option value="financial">Financial</option>
                  <option value="housing">Housing</option>
                  <option value="medical">Medical</option>
                </select>
              </div>

              {/* Support Request List */}
              <div className="space-y-4">
                {supportRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(request.type)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority.toUpperCase()}
                        </span>
                        {request.verified && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{request.posted}</div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{request.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{request.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {request.location}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {request.responses} responses
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        Offer Help
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {request.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mutual Aid Networks */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mutual Aid Networks</h3>
              <div className="space-y-4">
                {mutualAidNetworks.map((network, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{network.name}</h4>
                      {network.verified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{network.focus}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{network.members.toLocaleString()} members</span>
                      <span>{network.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {network.services.slice(0, 2).map((service) => (
                        <span key={service} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                          {service}
                        </span>
                      ))}
                      {network.services.length > 2 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                          +{network.services.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Safety Resources */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Resources</h3>
              <div className="space-y-3">
                {safetyResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{resource.title}</h4>
                      <p className="text-xs text-gray-600">{resource.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Access
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Emergency Contacts */}
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-red-900">Emergency Support</h3>
              </div>
              <p className="text-sm text-red-700 mb-4">
                If you're facing immediate danger or need urgent assistance, contact our 24/7 emergency network.
              </p>
              <Button variant="primary" className="w-full bg-red-600 hover:bg-red-700">
                Emergency Contact
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySupport;
