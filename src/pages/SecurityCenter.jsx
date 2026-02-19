import { useState } from 'react'
import { motion } from 'framer-motion'
import IncidentReportForm from '../components/IncidentReportForm'
import SecurityQuiz from '../components/SecurityQuiz'
import SafetyChecklist from '../components/SafetyChecklist'
import WitnessProtection from '../components/WitnessProtection'
import OfflineModeManager from '../components/OfflineModeManager'
import WhistleblowerPortal from '../components/WhistleblowerPortal'
import { 
  Shield, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Download,
  Wifi,
  Smartphone,
  Monitor,
  Globe,
  Key,
  FileText,
  Phone,
  AlertCircle,
  ChevronRight,
  Zap,
  ExternalLink
} from 'lucide-react'

const SecurityCenter = () => {
  const [activeTab, setActiveTab] = useState('assessment')
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [securityScore, setSecurityScore] = useState(0)
  const [categoryBreakdown, setCategoryBreakdown] = useState({ network: 0, device: 0, opsec: 0 })
  const [answers, setAnswers] = useState({})

  const [securityTools] = useState([
    {
      id: 1,
      name: 'Tor Browser',
      description: 'Anonymous browsing and access to .onion sites',
      status: 'essential',
      download: 'https://www.torproject.org/download/',
      features: ['Anonymous IP masking', 'Encrypted connections', 'Protection from tracking']
    },
    {
      id: 2,
      name: 'ProtonVPN',
      description: 'Secure VPN with no-log policy',
      status: 'essential',
      download: 'https://protonvpn.com/',
      features: ['Military-grade encryption', 'No activity logs', 'Kill switch protection']
    },
    {
      id: 3,
      name: 'Signal',
      description: 'End-to-end encrypted messaging',
      status: 'essential',
      download: 'https://signal.org/download/',
      features: ['E2E encryption', 'Voice/video calls', 'Disappearing messages']
    },
    {
      id: 4,
      name: 'Tails OS',
      description: 'Secure operating system for sensitive work',
      status: 'advanced',
      download: 'https://tails.net/',
      features: ['Amnesic system', 'No traces left', 'Tor integrated']
    },
    {
      id: 5,
      name: 'KeePass',
      description: 'Offline password manager',
      status: 'essential',
      download: 'https://keepass.info/',
      features: ['Strong encryption', 'Offline storage', 'Auto-fill support']
    },
    {
      id: 6,
      name: 'VeraCrypt',
      description: 'Full disk and partition encryption',
      status: 'advanced',
      download: 'https://www.veracrypt.fr/',
      features: ['AES-256 encryption', 'Hidden volumes', 'Plausible deniability']
    }
  ])

  const connectionTestTools = [
    {
      id: 1,
      name: 'Tor Project Connection Check',
      url: 'https://check.torproject.org/',
      description: 'Official Tor Project tool — confirms whether your browser is connected through the Tor network',
      provider: 'The Tor Project'
    },
    {
      id: 2,
      name: 'IPLeak.net',
      url: 'https://ipleak.net/',
      description: 'Checks for IP address leaks, DNS leaks, and WebRTC leaks that could expose your real location',
      provider: 'IPLeak.net (open source)'
    },
    {
      id: 3,
      name: 'DNS Leak Test',
      url: 'https://dnsleaktest.com/',
      description: 'Tests whether your DNS queries are being sent through your VPN or leaking to your ISP',
      provider: 'DNSLeakTest.com'
    },
    {
      id: 4,
      name: 'Mullvad Connection Check',
      url: 'https://mullvad.net/en/check',
      description: 'Comprehensive check for IP, DNS leaks, and WebRTC — works with any VPN, not just Mullvad',
      provider: 'Mullvad VPN AB'
    }
  ]

  const [assessmentQuestions] = useState([
    {
      id: 1,
      question: 'Do you use a VPN or Tor for all internet activity?',
      category: 'network',
      weight: 15
    },
    {
      id: 2,
      question: 'Is your device encrypted with full-disk encryption?',
      category: 'device',
      weight: 15
    },
    {
      id: 3,
      question: 'Do you use unique, strong passwords for each account?',
      category: 'passwords',
      weight: 10
    },
    {
      id: 4,
      question: 'Do you have two-factor authentication enabled on critical accounts?',
      category: 'authentication',
      weight: 15
    },
    {
      id: 5,
      question: 'Do you use end-to-end encrypted messaging for sensitive communications?',
      category: 'communications',
      weight: 15
    },
    {
      id: 6,
      question: 'Do you regularly update your operating system and software?',
      category: 'updates',
      weight: 10
    },
    {
      id: 7,
      question: 'Do you disable location services and camera/microphone when not needed?',
      category: 'device',
      weight: 10
    },
    {
      id: 8,
      question: 'Do you avoid using personal information in usernames and profiles?',
      category: 'opsec',
      weight: 10
    }
  ])

  const [emergencyContacts] = useState([
    {
      id: 1,
      name: 'International Consortium of Investigative Journalists',
      type: 'Document Submission',
      contact: 'https://www.icij.org/leak/',
      description: 'Secure document submission for journalists'
    },
    {
      id: 2,
      name: 'Amnesty International',
      type: 'Human Rights Reporting',
      contact: 'https://www.amnesty.org/en/contact-us/',
      description: 'Report human rights violations'
    },
    {
      id: 3,
      name: 'Human Rights Watch',
      type: 'Evidence Submission',
      contact: 'https://www.hrw.org/about/contact',
      description: 'Submit evidence of human rights abuses'
    },
    {
      id: 4,
      name: 'Freedom House',
      type: 'Urgent Assistance',
      contact: 'https://freedomhouse.org/contact',
      description: 'Emergency support for activists at risk'
    },
    {
      id: 5,
      name: 'International Federation for Human Rights',
      type: 'Emergency Protection',
      contact: 'https://www.fidh.org/en/about-us/contact',
      description: 'Emergency protection for threatened activists'
    }
  ])

  const [securityGuides] = useState([
    {
      id: 1,
      title: 'Device Security Hardening',
      topics: ['OS Configuration', 'Firewall Setup', 'Antivirus/Malware Protection', 'USB Security'],
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      title: 'Network Security Fundamentals',
      topics: ['VPN Configuration', 'Tor Usage', 'DNS Privacy', 'Traffic Analysis Prevention'],
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      title: 'Operational Security (OPSEC)',
      topics: ['Information Compartmentalization', 'Cover Stories', 'Counter-Surveillance', 'Secure Meetings'],
      difficulty: 'Advanced'
    },
    {
      id: 4,
      title: 'Digital Forensics Awareness',
      topics: ['Data Recovery Prevention', 'Metadata Removal', 'Secure Deletion', 'Evidence Preservation'],
      difficulty: 'Advanced'
    },
    {
      id: 5,
      title: 'Social Engineering Defense',
      topics: ['Phishing Recognition', 'Pretexting', 'Credential Harvesting', 'Verification Protocols'],
      difficulty: 'Beginner'
    },
    {
      id: 6,
      title: 'Crisis Response Procedures',
      topics: ['Device Lockdown', 'Account Recovery', 'Evidence Destruction', 'Safe House Protocols'],
      difficulty: 'Advanced'
    }
  ])

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleAssessment = () => {
    let score = 0
    const categoryScores = {}
    const categoryMaxes = {}

    for (const q of assessmentQuestions) {
      const cat = q.category
      if (!categoryMaxes[cat]) categoryMaxes[cat] = 0
      if (!categoryScores[cat]) categoryScores[cat] = 0
      categoryMaxes[cat] += q.weight

      const answer = answers[q.id]
      if (answer === 'yes') {
        score += q.weight
        categoryScores[cat] += q.weight
      } else if (answer === 'unsure') {
        const partial = Math.round(q.weight * 0.5)
        score += partial
        categoryScores[cat] += partial
      }
    }

    // Map categories to display groups
    const networkMax = (categoryMaxes['network'] || 0)
    const deviceMax = (categoryMaxes['device'] || 0)
    const opsecMax = (categoryMaxes['passwords'] || 0) + (categoryMaxes['authentication'] || 0) + (categoryMaxes['communications'] || 0) + (categoryMaxes['updates'] || 0) + (categoryMaxes['opsec'] || 0)

    setCategoryBreakdown({
      network: networkMax > 0 ? Math.round((categoryScores['network'] || 0) / networkMax * 100) : 0,
      device: deviceMax > 0 ? Math.round((categoryScores['device'] || 0) / deviceMax * 100) : 0,
      opsec: opsecMax > 0 ? Math.round(((categoryScores['passwords'] || 0) + (categoryScores['authentication'] || 0) + (categoryScores['communications'] || 0) + (categoryScores['updates'] || 0) + (categoryScores['opsec'] || 0)) / opsecMax * 100) : 0
    })

    setSecurityScore(score)
    setAssessmentComplete(true)
  }

  const ToolCard = ({ tool }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">{tool.name}</h3>
          <p className="text-slate-400 text-sm mt-1">{tool.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          tool.status === 'essential'
            ? 'bg-red-900 text-red-100'
            : 'bg-yellow-900 text-yellow-100'
        }`}>
          {tool.status === 'essential' ? 'Essential' : 'Advanced'}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-slate-400 text-xs font-medium mb-2">Features:</p>
        <ul className="space-y-1">
          {tool.features.map((feature, idx) => (
            <li key={idx} className="text-slate-300 text-sm flex items-center">
              <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={tool.download}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <Download className="w-4 h-4" />
        <span>Download</span>
      </motion.a>
    </motion.div>
  )

  const GuideCard = ({ guide }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">{guide.title}</h3>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            guide.difficulty === 'Beginner' ? 'bg-green-900 text-green-100' :
            guide.difficulty === 'Intermediate' ? 'bg-yellow-900 text-yellow-100' :
            'bg-red-900 text-red-100'
          }`}>
            {guide.difficulty}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-2">
        {guide.topics.map((topic, idx) => (
          <div key={idx} className="flex items-center text-slate-300 text-sm">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
            {topic}
          </div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Security Center</h1>
        <p className="text-slate-400 mt-2">
          Comprehensive security assessment, tools, and training for resistance activists
        </p>
      </div>

      {/* Critical Alert */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-900 border border-red-700 rounded-lg p-4"
      >
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-100 font-semibold">Security Notice</h3>
            <p className="text-red-200 text-sm mt-1">
              CCP actively targets resistance activists with surveillance, hacking, and intimidation. 
              Implement these security measures immediately to protect yourself and your organization.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-700 overflow-x-auto">
        {['assessment', 'report', 'tools', 'guides', 'emergency', 'checklist', 'protection', 'offline', 'whistleblower'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assessment Tab */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          <SecurityQuiz />
        </div>
      )}

      {/* Legacy Assessment Tab - Hidden */}
      {activeTab === 'legacy-assessment' && (
        <div className="space-y-6">
          {!assessmentComplete ? (
            <>
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Security Assessment</h2>
                <p className="text-slate-400 mb-6">
                  Answer the following questions to evaluate your current security posture. This assessment is anonymous and results are not stored.
                </p>

                <div className="space-y-4">
                  {assessmentQuestions.map((q, idx) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-white font-medium">{q.question}</p>
                        <span className="text-xs text-slate-400">{q.category}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleAnswer(q.id, 'yes')} className={`px-4 py-2 ${answers[q.id] === 'yes' ? 'bg-green-700 ring-2 ring-green-400' : 'bg-green-900 hover:bg-green-800'} text-green-100 rounded-lg transition-colors text-sm font-medium`}>
                          Yes
                        </button>
                        <button onClick={() => handleAnswer(q.id, 'no')} className={`px-4 py-2 ${answers[q.id] === 'no' ? 'bg-red-700 ring-2 ring-red-400' : 'bg-red-900 hover:bg-red-800'} text-red-100 rounded-lg transition-colors text-sm font-medium`}>
                          No
                        </button>
                        <button onClick={() => handleAnswer(q.id, 'unsure')} className={`px-4 py-2 ${answers[q.id] === 'unsure' ? 'bg-slate-500 ring-2 ring-slate-300' : 'bg-slate-600 hover:bg-slate-500'} text-slate-100 rounded-lg transition-colors text-sm font-medium`}>
                          Unsure
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAssessment}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Get Security Score
                </motion.button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-lg border border-slate-700 p-8"
            >
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${(securityScore / 100) * 282.7} 282.7`}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                    <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-4xl font-bold" fill="white">
                      {securityScore}
                    </text>
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Your Security Score</h2>
                <p className="text-slate-400 mb-6">
                  {securityScore >= 80 ? 'Excellent security posture. Continue maintaining these practices.' :
                   securityScore >= 60 ? 'Good security. Implement recommended improvements below.' :
                   'Needs improvement. Critical security gaps identified.'}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setAssessmentComplete(false); setAnswers({}) }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Retake Assessment
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Network Security</p>
                  <p className="text-white text-2xl font-bold mt-1">{categoryBreakdown.network}%</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Device Security</p>
                  <p className="text-white text-2xl font-bold mt-1">{categoryBreakdown.device}%</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Operational Security</p>
                  <p className="text-white text-2xl font-bold mt-1">{categoryBreakdown.opsec}%</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Report Tab */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <IncidentReportForm />
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Essential Security Tools</h2>
            <p className="text-slate-400 mb-6">
              Download and install these tools to protect your communications and devices
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* Verify Your Connection */}
          <div className="mt-8 border-t border-slate-700 pt-8">
            <h3 className="text-xl font-bold text-white mb-2">Verify Your Connection</h3>
            <p className="text-slate-400 text-sm mb-4">
              This platform cannot detect whether you are using a VPN or Tor. Use these reputable 
              third-party tools to self-test whether your connection is properly secured.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectionTestTools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-blue-500 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{tool.description}</p>
                  <p className="text-slate-500 text-xs mt-2">Provider: {tool.provider}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guides Tab */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Security Training Guides</h2>
            <p className="text-slate-400 mb-6">
              Comprehensive guides covering all aspects of digital and operational security
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      )}

      {/* Emergency Tab */}
      {activeTab === 'emergency' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900 border border-red-700 rounded-lg p-6"
          >
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-100 font-semibold text-lg">Emergency Procedures</h3>
                <p className="text-red-200 text-sm mt-1">
                  If you are in immediate danger or your security has been compromised:
                </p>
                <ul className="text-red-200 text-sm mt-3 space-y-1 ml-4 list-disc">
                  <li>Stop all online activity immediately</li>
                  <li>Power off your device without saving</li>
                  <li>Move to a safe location with a different device</li>
                  <li>Contact emergency support below</li>
                  <li>Do not attempt to retrieve data</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Emergency Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
                >
                  <h3 className="text-white font-semibold">{contact.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{contact.description}</p>
                  <p className="text-slate-500 text-xs mt-2 font-medium">{contact.type}</p>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={contact.contact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Contact</span>
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Safety Checklist Tab */}
      {activeTab === 'checklist' && (
        <SafetyChecklist />
      )}

      {/* Witness Protection Tab */}
      {activeTab === 'protection' && (
        <WitnessProtection />
      )}

      {/* Offline Mode Tab */}
      {activeTab === 'offline' && (
        <OfflineModeManager />
      )}

      {/* Whistleblower Portal Tab */}
      {activeTab === 'whistleblower' && (
        <WhistleblowerPortal />
      )}
    </div>
  )
}

export default SecurityCenter
