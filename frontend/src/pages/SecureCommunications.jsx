import React, { useState } from 'react';
import { MessageSquare, Shield, Lock, Users, Globe, Zap, Eye, EyeOff, Key } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SecureCommunications = () => {
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [showEncryption, setShowEncryption] = useState(false);

  const communicationChannels = [
    {
      id: 'general',
      name: 'General Coordination',
      members: 2847,
      status: 'active',
      encryption: 'E2E',
      lastActivity: '2 minutes ago',
      description: 'General coordination and updates for global resistance efforts'
    },
    {
      id: 'hong-kong',
      name: 'Hong Kong Operations',
      members: 1523,
      status: 'active',
      encryption: 'E2E',
      lastActivity: '5 minutes ago',
      description: 'Secure coordination for Hong Kong democracy movement'
    },
    {
      id: 'uyghur-rights',
      name: 'Uyghur Rights Campaign',
      members: 892,
      status: 'active',
      encryption: 'E2E',
      lastActivity: '12 minutes ago',
      description: 'Coordination for Uyghur genocide awareness and advocacy'
    },
    {
      id: 'tibet-solidarity',
      name: 'Tibet Solidarity Network',
      members: 1247,
      status: 'active',
      encryption: 'E2E',
      lastActivity: '18 minutes ago',
      description: 'Supporting Tibetan freedom and cultural preservation'
    },
    {
      id: 'taiwan-defense',
      name: 'Taiwan Defense Coordination',
      members: 634,
      status: 'active',
      encryption: 'E2E',
      lastActivity: '25 minutes ago',
      description: 'Supporting Taiwan democracy and security'
    },
    {
      id: 'intelligence',
      name: 'Intelligence Sharing',
      members: 156,
      status: 'restricted',
      encryption: 'E2E+',
      lastActivity: '1 hour ago',
      description: 'Verified intelligence sharing for trusted members only'
    }
  ];

  const securityFeatures = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'End-to-End Encryption',
      description: 'All messages encrypted with Signal Protocol, ensuring only intended recipients can read them',
      status: 'active'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Disappearing Messages',
      description: 'Messages automatically delete after specified time periods to prevent data retention',
      status: 'active'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Perfect Forward Secrecy',
      description: 'New encryption keys generated for each session, preventing retroactive decryption',
      status: 'active'
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: 'Identity Verification',
      description: 'Cryptographic verification ensures you\'re communicating with intended recipients',
      status: 'active'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Tor Integration',
      description: 'Built-in Tor routing for additional anonymity and location privacy',
      status: 'active'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Secure File Sharing',
      description: 'Encrypted file sharing for documents, images, and sensitive materials',
      status: 'active'
    }
  ];

  const recentMessages = [
    {
      channel: 'hong-kong',
      sender: 'HK_Activist_247',
      message: 'Legal team confirms appeal filing for Jimmy Lai case. International pressure campaign showing results.',
      timestamp: '2 minutes ago',
      priority: 'high',
      encrypted: true
    },
    {
      channel: 'uyghur-rights',
      sender: 'UyghurAdvocate_89',
      message: 'New evidence of forced labor in cotton industry. Preparing comprehensive report for UN submission.',
      timestamp: '8 minutes ago',
      priority: 'critical',
      encrypted: true
    },
    {
      channel: 'general',
      sender: 'CoordinatorAlpha',
      message: 'Weekly coordination meeting scheduled for Thursday 1400 UTC. Agenda includes campaign updates.',
      timestamp: '15 minutes ago',
      priority: 'medium',
      encrypted: true
    },
    {
      channel: 'tibet-solidarity',
      sender: 'TibetFreedom_21',
      message: 'Cultural preservation project needs volunteers for translation work. Tibetan to English required.',
      timestamp: '22 minutes ago',
      priority: 'medium',
      encrypted: true
    },
    {
      channel: 'intelligence',
      sender: 'IntelAnalyst_7',
      message: '[CLASSIFIED] New surveillance technology deployment detected in three major cities.',
      timestamp: '45 minutes ago',
      priority: 'critical',
      encrypted: true
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

  const getChannelStatus = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'restricted': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Secure Communications</h1>
              <p className="text-green-100">Encrypted coordination channels for resistance operations</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">7,343</div>
              <div className="text-green-100">Active Participants</div>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <Card className="p-6 mb-8 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">Maximum Security Active</h3>
                <p className="text-green-700">All communications protected with military-grade encryption</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">Secure Connection</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Communication Channels */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Communication Channels</h2>
                <Button variant="primary" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  New Channel
                </Button>
              </div>

              {/* Channel List */}
              <div className="space-y-4 mb-8">
                {communicationChannels.map((channel) => (
                  <div 
                    key={channel.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedChannel === channel.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedChannel(channel.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChannelStatus(channel.status)}`}>
                          {channel.status.toUpperCase()}
                        </span>
                        <div className="flex items-center text-green-600">
                          <Lock className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">{channel.encryption}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{channel.lastActivity}</div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{channel.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {channel.members.toLocaleString()} members
                      </div>
                      <Button variant="outline" size="sm">
                        Join Channel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Messages */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
                <div className="space-y-3">
                  {recentMessages.map((message, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">#{message.channel}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{message.sender}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                            {message.priority.toUpperCase()}
                          </span>
                          {message.encrypted && (
                            <Lock className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Features */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Security Features</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowEncryption(!showEncryption)}
                >
                  {showEncryption ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                      {showEncryption && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                          AES-256-GCM + X25519 + Ed25519
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Secure Chat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Create Group Channel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Identity
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Key className="w-4 h-4 mr-2" />
                  Generate New Keys
                </Button>
              </div>
            </Card>

            {/* Security Guidelines */}
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-yellow-900">Security Guidelines</h3>
              </div>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• Never share encryption keys or passwords</li>
                <li>• Verify recipient identities before sharing sensitive information</li>
                <li>• Use disappearing messages for sensitive discussions</li>
                <li>• Regularly update your security keys</li>
                <li>• Report suspicious activity immediately</li>
              </ul>
            </Card>

            {/* Emergency Protocol */}
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-red-900">Emergency Protocol</h3>
              </div>
              <p className="text-sm text-red-700 mb-4">
                If you suspect your communications are compromised, immediately activate emergency protocols.
              </p>
              <Button variant="primary" className="w-full bg-red-600 hover:bg-red-700">
                Activate Emergency Mode
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureCommunications;
