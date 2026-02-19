import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  MessageSquare, 
  Users, 
  Eye, 
  EyeOff,
  Send,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react'

const SecureComms = () => {
  const [activeTab, setActiveTab] = useState('channels')
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [showEncryptionDetails, setShowEncryptionDetails] = useState(false)

  const [channels] = useState([
    {
      id: 1,
      name: 'Hong Kong Coordination Hub',
      description: 'Central coordination for Hong Kong democracy movement',
      members: 1247,
      encryption: 'E2E AES-256',
      status: 'active',
      lastMessage: '2 minutes ago',
      unread: 3,
      verified: true
    },
    {
      id: 2,
      name: 'Uyghur Rights Network',
      description: 'Documentation and advocacy for Uyghur human rights',
      members: 856,
      encryption: 'E2E AES-256',
      status: 'active',
      lastMessage: '15 minutes ago',
      unread: 0,
      verified: true
    },
    {
      id: 3,
      name: 'Tibet Freedom Alliance',
      description: 'Coordination for Tibetan independence advocacy',
      members: 634,
      encryption: 'E2E AES-256',
      status: 'active',
      lastMessage: '1 hour ago',
      unread: 0,
      verified: true
    },
    {
      id: 4,
      name: 'Taiwan Solidarity Network',
      description: 'Support for Taiwan democracy and sovereignty',
      members: 512,
      encryption: 'E2E AES-256',
      status: 'active',
      lastMessage: '3 hours ago',
      unread: 1,
      verified: true
    },
    {
      id: 5,
      name: 'Free Jimmy Lai Campaign',
      description: 'International campaign for Jimmy Lai\'s release',
      members: 2156,
      encryption: 'E2E AES-256',
      status: 'active',
      lastMessage: '30 minutes ago',
      unread: 5,
      verified: true
    }
  ])

  const [messages] = useState([
    {
      id: 1,
      author: 'Hong Kong Activist',
      timestamp: '2 minutes ago',
      content: 'Latest updates on the trial proceedings. Need to coordinate international response.',
      verified: true,
      encrypted: true
    },
    {
      id: 2,
      author: 'International Coordinator',
      timestamp: '5 minutes ago',
      content: 'US State Department statement released. Forwarding to all channels.',
      verified: true,
      encrypted: true
    },
    {
      id: 3,
      author: 'Media Team',
      timestamp: '12 minutes ago',
      content: 'Press release drafted. Awaiting approval from core team.',
      verified: true,
      encrypted: true
    }
  ])

  const [securityFeatures] = useState([
    {
      title: 'End-to-End Encryption',
      description: 'All messages encrypted with AES-256 military-grade encryption',
      icon: Lock,
      status: 'active'
    },
    {
      title: 'User Verification',
      description: 'Multi-factor authentication and identity verification for all members',
      icon: CheckCircle,
      status: 'active'
    },
    {
      title: 'Message Expiration',
      description: 'Automatic message deletion after specified time period',
      icon: Clock,
      status: 'active'
    },
    {
      title: 'Metadata Protection',
      description: 'IP masking and connection anonymization via Tor',
      icon: Eye,
      status: 'active'
    },
    {
      title: 'Zero-Knowledge Architecture',
      description: 'Platform cannot access message content or user metadata',
      icon: Shield,
      status: 'active'
    },
    {
      title: 'Emergency Protocols',
      description: 'Instant account lockdown and evidence destruction capabilities',
      icon: AlertCircle,
      status: 'active'
    }
  ])

  const [guidelines] = useState([
    {
      category: 'Operational Security',
      items: [
        'Never share personal identifying information in channels',
        'Use VPN or Tor for all communications',
        'Enable two-factor authentication on your account',
        'Regularly update your encryption keys',
        'Use unique, strong passwords for each channel'
      ]
    },
    {
      category: 'Communication Protocol',
      items: [
        'Assume all communications may be monitored by hostile actors',
        'Use code words for sensitive operations',
        'Verify identity of all new members before sharing sensitive info',
        'Limit sensitive discussions to verified channels only',
        'Archive important messages locally in encrypted format'
      ]
    },
    {
      category: 'Emergency Procedures',
      items: [
        'If compromised, immediately notify channel administrators',
        'Use emergency exit protocol to securely leave the network',
        'Activate account destruction to remove all traces',
        'Contact emergency support team for immediate assistance',
        'Switch to backup communication channels if primary is compromised'
      ]
    }
  ])

  const ChannelCard = ({ channel }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedChannel(channel.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedChannel(channel.id) } }}
      role="button"
      tabIndex={0}
      aria-pressed={selectedChannel === channel.id}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        selectedChannel === channel.id
          ? 'bg-blue-900 border-blue-500 shadow-lg shadow-blue-500/20'
          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold">{channel.name}</h3>
            {channel.verified && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">{channel.description}</p>
          <div className="flex items-center space-x-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              {channel.members} members
            </span>
            <span className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              {channel.encryption}
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {channel.lastMessage}
            </span>
          </div>
        </div>
        {channel.unread > 0 && (
          <div className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {channel.unread}
          </div>
        )}
      </div>
    </motion.div>
  )

  const SecurityFeatureCard = ({ feature }) => {
    const Icon = feature.icon
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg border border-slate-700 p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-900 rounded-lg">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">{feature.title}</h3>
            <p className="text-slate-400 text-sm mt-1">{feature.description}</p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Secure Communications</h1>
          <p className="text-slate-400 mt-2">
            End-to-end encrypted channels for coordinated resistance operations
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Channel</span>
        </motion.button>
      </div>

      {/* Security Alert */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-900 border border-green-700 rounded-lg p-4"
      >
        <div className="flex items-start">
          <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-green-100 font-semibold">All Communications Secured</h3>
            <p className="text-green-200 text-sm mt-1">
              All channels use military-grade AES-256 encryption. Your communications are protected from surveillance.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-700">
        {['channels', 'security', 'guidelines'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Channels Tab */}
      {activeTab === 'channels' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Channel List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                aria-label="Search"
                type="text"
                placeholder="Search channels..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {channels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </div>

          {/* Message View */}
          <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 flex flex-col h-96">
            {selectedChannel ? (
              <>
                {/* Channel Header */}
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-white font-semibold">
                        {channels.find(c => c.id === selectedChannel)?.name}
                      </h2>
                      <p className="text-slate-400 text-sm">
                        {channels.find(c => c.id === selectedChannel)?.members} members
                      </p>
                    </div>
                    <button
                      onClick={() => setShowEncryptionDetails(!showEncryptionDetails)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Lock className="w-5 h-5 text-green-400" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{msg.author}</span>
                            {msg.verified && (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <p className="text-slate-300 mt-2">{msg.content}</p>
                        </div>
                        <span className="text-slate-400 text-xs whitespace-nowrap ml-2">
                          {msg.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Lock className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">Encrypted</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-700">
                  <div className="flex items-center space-x-2">
                    <input
                      aria-label="Type encrypted message..."
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type encrypted message..."
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select a channel to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security Features Tab */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Security Architecture</h2>
            <p className="text-slate-400 mb-6">
              Our secure communications platform uses industry-leading encryption and privacy technologies to protect resistance operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, idx) => (
              <SecurityFeatureCard key={idx} feature={feature} />
            ))}
          </div>

          {/* Technical Details */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Technical Specifications</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Encryption Algorithm</p>
                  <p className="text-white font-mono text-lg">AES-256-GCM</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Key Exchange</p>
                  <p className="text-white font-mono text-lg">ECDH (P-256)</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Hash Function</p>
                  <p className="text-white font-mono text-lg">SHA-256</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Authentication</p>
                  <p className="text-white font-mono text-lg">HMAC-SHA256</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guidelines Tab */}
      {activeTab === 'guidelines' && (
        <div className="space-y-8">
          {guidelines.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">{section.category}</h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SecureComms
