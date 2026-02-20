import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import useWebRTCLeakCheck from '../hooks/useWebRTCLeakCheck'
import securityData from '../data/security_center_data.json'
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
  ExternalLink,
  Play,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion
} from 'lucide-react'

const SectionLoader = () => (
  <div className="flex items-center justify-center py-8">
    <span className="font-mono text-[#4afa82] text-sm">$ loading</span><span className="font-mono text-[#4afa82] text-sm animate-pulse ml-0.5">█</span>
  </div>
);

const IncidentReportForm = lazy(() => import('../components/IncidentReportForm'));
const SecurityQuiz = lazy(() => import('../components/SecurityQuiz'));
const SafetyChecklist = lazy(() => import('../components/SafetyChecklist'));
const WitnessProtection = lazy(() => import('../components/WitnessProtection'));
const OfflineModeManager = lazy(() => import('../components/OfflineModeManager'));
const WhistleblowerPortal = lazy(() => import('../components/WhistleblowerPortal'));

const SecurityCenter = () => {
  const [activeTab, setActiveTab] = useState('assessment')
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [securityScore, setSecurityScore] = useState(0)
  const [categoryBreakdown, setCategoryBreakdown] = useState({ network: 0, device: 0, opsec: 0 })
  const [answers, setAnswers] = useState({})
  const { status: webrtcStatus, leakedIPs, isLeaking, runCheck: runWebRTCCheck } = useWebRTCLeakCheck()

  const securityTools = securityData.securityTools
  const connectionTestTools = securityData.connectionTestTools
  const assessmentQuestions = securityData.assessmentQuestions
  const emergencyContacts = securityData.emergencyContacts
  const securityGuides = securityData.securityGuides

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
      className="bg-[#111820] border border-[#1c2a35] p-6 hover:border-[#2a9a52] transition-colors"
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
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium transition-colors flex items-center justify-center space-x-2"
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
      className="bg-[#111820] border border-[#1c2a35] p-6 hover:border-[#2a9a52] transition-colors"
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
        className="bg-red-900 border border-red-700 p-4"
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
      <div className="flex space-x-4 border-b border-[#1c2a35] overflow-x-auto">
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
          <Suspense fallback={<SectionLoader />}><SecurityQuiz /></Suspense>
        </div>
      )}

      {/* Legacy Assessment Tab - Hidden */}
      {activeTab === 'legacy-assessment' && (
        <div className="space-y-6">
          {!assessmentComplete ? (
            <>
              <div className="bg-[#111820] border border-[#1c2a35] p-6">
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
                      className="bg-[#1c2a35] p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-white font-medium">{q.question}</p>
                        <span className="text-xs text-slate-400">{q.category}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleAnswer(q.id, 'yes')} className={`px-4 py-2 ${answers[q.id] === 'yes' ? 'bg-green-700 ring-2 ring-green-400' : 'bg-green-900 hover:bg-green-800'} text-green-100 transition-colors text-sm font-medium`}>
                          Yes
                        </button>
                        <button onClick={() => handleAnswer(q.id, 'no')} className={`px-4 py-2 ${answers[q.id] === 'no' ? 'bg-red-700 ring-2 ring-red-400' : 'bg-red-900 hover:bg-red-800'} text-red-100 transition-colors text-sm font-medium`}>
                          No
                        </button>
                        <button onClick={() => handleAnswer(q.id, 'unsure')} className={`px-4 py-2 ${answers[q.id] === 'unsure' ? 'bg-[#1c2a35] ring-2 ring-[#4afa82]' : 'bg-[#1c2a35] hover:bg-[#111820]'} text-slate-100 transition-colors text-sm font-medium`}>
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
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium transition-colors"
                >
                  Get Security Score
                </motion.button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111820] border border-[#1c2a35] p-8"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium transition-colors"
                >
                  Retake Assessment
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-[#1c2a35] p-4">
                  <p className="text-slate-400 text-sm">Network Security</p>
                  <p className="text-white text-2xl font-bold mt-1">{categoryBreakdown.network}%</p>
                </div>
                <div className="bg-[#1c2a35] p-4">
                  <p className="text-slate-400 text-sm">Device Security</p>
                  <p className="text-white text-2xl font-bold mt-1">{categoryBreakdown.device}%</p>
                </div>
                <div className="bg-[#1c2a35] p-4">
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
          <Suspense fallback={<SectionLoader />}><IncidentReportForm /></Suspense>
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

          {/* WebRTC Leak Test — runs entirely in your browser */}
          <div className="mt-8 border-t border-[#1c2a35] pt-8">
            <div className="flex items-center gap-2 mb-2">
              {webrtcStatus === 'complete' && isLeaking === false && <ShieldCheck className="w-5 h-5 text-green-400" />}
              {webrtcStatus === 'complete' && isLeaking === true && <ShieldAlert className="w-5 h-5 text-red-400" />}
              {(webrtcStatus === 'idle' || webrtcStatus === 'unsupported' || webrtcStatus === 'error') && <ShieldQuestion className="w-5 h-5 text-slate-400" />}
              {webrtcStatus === 'running' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
              <h3 className="text-xl font-bold text-white">WebRTC Leak Test</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              WebRTC can expose your real IP address even when using a VPN. This test runs
              entirely in your browser — no data is sent to any server.
            </p>

            {webrtcStatus === 'idle' && (
              <button
                onClick={runWebRTCCheck}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                Run WebRTC Leak Test
              </button>
            )}

            {webrtcStatus === 'running' && (
              <div className="flex items-center gap-2 text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Checking for WebRTC leaks...</span>
              </div>
            )}

            {webrtcStatus === 'unsupported' && (
              <div className="bg-[#111820] border border-[#2a9a52] p-4">
                <p className="text-slate-400 text-sm">
                  Your browser does not support WebRTC, which means it cannot leak your IP through this method.
                  This is actually a good thing for privacy.
                </p>
              </div>
            )}

            {webrtcStatus === 'error' && (
              <div className="bg-[#111820] border border-yellow-700 p-4">
                <p className="text-yellow-400 text-sm">
                  Could not complete the WebRTC leak test. Your browser may be blocking WebRTC
                  (which is good for privacy) or an unexpected error occurred.
                </p>
                <button
                  onClick={runWebRTCCheck}
                  className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Try again
                </button>
              </div>
            )}

            {webrtcStatus === 'complete' && (
              <div className={`p-4 border ${isLeaking ? 'bg-red-900/30 border-red-700' : 'bg-green-900/30 border-green-700'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {isLeaking ? (
                    <>
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                      <span className="text-red-300 font-semibold">WebRTC is leaking your IP address</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-semibold">No public IP leak detected</span>
                    </>
                  )}
                </div>

                {leakedIPs.length > 0 && (
                  <div className="space-y-1 mb-3">
                    <p className="text-slate-400 text-xs font-medium">Detected addresses:</p>
                    {leakedIPs.map((ip, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${ip.type === 'public' ? 'bg-red-800 text-red-200' : 'bg-[#1c2a35] text-slate-300'}`}>
                          {ip.type}
                        </span>
                        <code className="text-slate-300 font-mono text-xs">{ip.address}</code>
                      </div>
                    ))}
                  </div>
                )}

                {isLeaking && (
                  <div className="mt-3 pt-3 border-t border-red-800">
                    <p className="text-red-200 text-sm font-medium mb-2">How to fix this:</p>
                    <ul className="text-slate-400 text-sm space-y-1">
                      <li>• <strong>Firefox:</strong> Go to <code className="text-slate-300">about:config</code> and set <code className="text-slate-300">media.peerconnection.enabled</code> to <code className="text-slate-300">false</code></li>
                      <li>• <strong>Chrome:</strong> Install the <a href="https://chrome.google.com/webstore/detail/webrtc-leak-prevent/eiadekoaikejlgdbkbdfeijglgfdalml" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">WebRTC Leak Prevent</a> extension</li>
                      <li>• <strong>Tor Browser:</strong> WebRTC is disabled by default — use Tor Browser for maximum protection</li>
                    </ul>
                  </div>
                )}

                <button
                  onClick={runWebRTCCheck}
                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Run test again
                </button>
              </div>
            )}
          </div>

          {/* Verify Your Connection */}
          <div className="mt-8 border-t border-[#1c2a35] pt-8">
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
                  className="bg-[#111820] border border-[#1c2a35] p-4 hover:border-blue-500 transition-colors group"
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
            className="bg-red-900 border border-red-700 p-6"
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
                  className="bg-[#111820] border border-[#1c2a35] p-6 hover:border-[#2a9a52] transition-colors"
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
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium transition-colors flex items-center justify-center space-x-2"
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
        <Suspense fallback={<SectionLoader />}><SafetyChecklist /></Suspense>
      )}

      {/* Witness Protection Tab */}
      {activeTab === 'protection' && (
        <Suspense fallback={<SectionLoader />}><WitnessProtection /></Suspense>
      )}

      {/* Offline Mode Tab */}
      {activeTab === 'offline' && (
        <Suspense fallback={<SectionLoader />}><OfflineModeManager /></Suspense>
      )}

      {/* Whistleblower Portal Tab */}
      {activeTab === 'whistleblower' && (
        <Suspense fallback={<SectionLoader />}><WhistleblowerPortal /></Suspense>
      )}
    </div>
  )
}

export default SecurityCenter
