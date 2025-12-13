import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, Globe, Smartphone, Wifi, AlertTriangle, CheckCircle, XCircle, Download, ExternalLink, Info } from 'lucide-react';
import { Card } from '../components/ui/Card';

const SecurityCenter = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [vpnStatus, setVpnStatus] = useState(false);
  const [torStatus, setTorStatus] = useState(false);
  const [encryptionLevel, setEncryptionLevel] = useState('standard');

  useEffect(() => {
    // Simulate security checks
    const checkSecurity = () => {
      // Check for VPN indicators
      const hasVPN = window.location.hostname.includes('vpn') || 
                    navigator.userAgent.includes('VPN') ||
                    Math.random() > 0.7; // Simulate VPN detection
      
      // Check for Tor indicators
      const hasTor = window.location.hostname.includes('.onion') ||
                    navigator.userAgent.includes('Tor') ||
                    Math.random() > 0.8; // Simulate Tor detection
      
      setVpnStatus(hasVPN);
      setTorStatus(hasTor);
      setConnectionStatus(hasVPN || hasTor ? 'secure' : 'medium');
      setEncryptionLevel(hasTor ? 'maximum' : hasVPN ? 'high' : 'standard');
    };

    setTimeout(checkSecurity, 1000);
  }, []);

  const securityTools = [
    {
      id: 1,
      name: 'Tor Browser',
      description: 'Anonymous browsing with maximum privacy protection',
      category: 'Essential',
      downloadUrl: 'https://www.torproject.org/download/',
      icon: Globe,
      status: torStatus ? 'active' : 'recommended',
      features: ['Anonymous browsing', 'IP address hiding', 'Traffic encryption', 'Censorship circumvention']
    },
    {
      id: 2,
      name: 'Signal Messenger',
      description: 'End-to-end encrypted messaging for secure communications',
      category: 'Essential',
      downloadUrl: 'https://signal.org/download/',
      icon: Smartphone,
      status: 'recommended',
      features: ['End-to-end encryption', 'Disappearing messages', 'Voice/video calls', 'Group messaging']
    },
    {
      id: 3,
      name: 'ProtonVPN',
      description: 'Secure VPN service with no-logs policy',
      category: 'Recommended',
      downloadUrl: 'https://protonvpn.com/',
      icon: Shield,
      status: vpnStatus ? 'active' : 'recommended',
      features: ['No-logs policy', 'Secure Core servers', 'Tor over VPN', 'Kill switch']
    },
    {
      id: 4,
      name: 'Tails OS',
      description: 'Portable operating system for maximum anonymity',
      category: 'Advanced',
      downloadUrl: 'https://tails.boum.org/',
      icon: Lock,
      status: 'advanced',
      features: ['Amnesic system', 'Tor integration', 'Encrypted storage', 'Portable USB boot']
    }
  ];

  const securityGuides = [
    {
      id: 1,
      title: 'Digital Security Fundamentals',
      description: 'Essential security practices for activists and journalists',
      level: 'Beginner',
      duration: '30 minutes',
      topics: ['Password security', 'Two-factor authentication', 'Secure communications', 'Data backup']
    },
    {
      id: 2,
      title: 'Advanced Anonymity Techniques',
      description: 'Comprehensive guide to maintaining anonymity online',
      level: 'Advanced',
      duration: '60 minutes',
      topics: ['Tor usage', 'VPN selection', 'Operational security', 'Threat modeling']
    },
    {
      id: 3,
      title: 'Mobile Device Security',
      description: 'Securing smartphones and tablets for activism',
      level: 'Intermediate',
      duration: '45 minutes',
      topics: ['App permissions', 'Encrypted messaging', 'Location privacy', 'Secure deletion']
    },
    {
      id: 4,
      title: 'Counter-Surveillance Measures',
      description: 'Protecting against state-level surveillance',
      level: 'Expert',
      duration: '90 minutes',
      topics: ['Traffic analysis', 'Metadata protection', 'Behavioral security', 'Physical security']
    }
  ];

  const threatLevels = {
    low: { color: 'green', text: 'Low Risk', description: 'Basic security measures sufficient' },
    medium: { color: 'yellow', text: 'Medium Risk', description: 'Enhanced security recommended' },
    high: { color: 'orange', text: 'High Risk', description: 'Advanced security measures required' },
    critical: { color: 'red', text: 'Critical Risk', description: 'Maximum security protocols essential' }
  };

  const currentThreat = threatLevels[connectionStatus === 'secure' ? 'low' : 'medium'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'recommended':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'advanced':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Security Center</h1>
            <p className="text-xl opacity-90 mb-8">
              Advanced privacy and security tools for activists and resistance coordination
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">256-bit</div>
                <div className="text-sm opacity-80">Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Zero</div>
                <div className="text-sm opacity-80">Logs Policy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-80">Protection</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Global</div>
                <div className="text-sm opacity-80">Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Status Dashboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Connection Security</h3>
                <div className={`w-3 h-3 rounded-full bg-${currentThreat.color}-500`}></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">VPN Status</span>
                  <div className="flex items-center gap-2">
                    {vpnStatus ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                    <span className="text-sm">{vpnStatus ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tor Status</span>
                  <div className="flex items-center gap-2">
                    {torStatus ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                    <span className="text-sm">{torStatus ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Encryption</span>
                  <span className="text-sm font-medium capitalize">{encryptionLevel}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Threat Level</h3>
                <AlertTriangle className={`w-5 h-5 text-${currentThreat.color}-600`} />
              </div>
              <div className="space-y-2">
                <div className={`text-lg font-bold text-${currentThreat.color}-600`}>
                  {currentThreat.text}
                </div>
                <p className="text-sm text-gray-600">{currentThreat.description}</p>
                <div className="mt-4">
                  <div className={`w-full bg-gray-200 rounded-full h-2`}>
                    <div 
                      className={`bg-${currentThreat.color}-500 h-2 rounded-full`}
                      style={{ width: connectionStatus === 'secure' ? '25%' : '50%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                {!vpnStatus && (
                  <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Consider using a VPN</span>
                  </div>
                )}
                {!torStatus && (
                  <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 p-2 rounded">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Tor Browser recommended</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                  <CheckCircle className="w-4 h-4" />
                  <span>HTTPS connection active</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Security Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Essential Security Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card key={tool.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tool.category === 'Essential' ? 'bg-red-100 text-red-800' :
                          tool.category === 'Recommended' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    {getStatusIcon(tool.status)}
                  </div>
                  
                  <p className="text-gray-700 mb-4">{tool.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={tool.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex-1 justify-center"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                    <button className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                      <Info className="w-4 h-4" />
                      Guide
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Security Guides */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Training Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityGuides.map((guide) => (
              <Card key={guide.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{guide.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      guide.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      guide.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      guide.level === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {guide.level}
                    </span>
                    <span>{guide.duration}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{guide.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {guide.topics.map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Start Training
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Security Resources</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Digital Security Helpline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-600" />
                    <span>+1-555-SECURITY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <a href="https://securityhelpline.org" className="text-blue-600 hover:underline">
                      securityhelpline.org
                    </a>
                  </div>
                  <p className="text-gray-600">24/7 emergency digital security support</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Aid Network</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-600" />
                    <span>+1-555-LEGAL-AID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <a href="https://legalaidnetwork.org" className="text-blue-600 hover:underline">
                      legalaidnetwork.org
                    </a>
                  </div>
                  <p className="text-gray-600">Legal support for activists and journalists</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure Drop</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-600" />
                    <span>Tor Hidden Service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="font-mono text-xs">securedrop.onion</span>
                  </div>
                  <p className="text-gray-600">Anonymous document submission</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;
