import { useState } from 'react';
import { ClipboardList, AlertTriangle, Link as LinkIcon, Lock } from 'lucide-react';

const SecurityQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: 'Do you use a VPN when browsing the internet?',
      category: 'Network Security',
      options: [
        { text: 'Always, with a reputable provider', points: 3 },
        { text: 'Sometimes, when accessing sensitive content', points: 2 },
        { text: 'Rarely or never', points: 0 },
        { text: 'I use a free VPN', points: 1 },
      ],
      recommendation: 'Use a reputable, paid VPN service like Mullvad, ProtonVPN, or IVPN. Avoid free VPNs as they may log your data.'
    },
    {
      id: 2,
      question: 'What messaging app do you primarily use for sensitive communications?',
      category: 'Communications',
      options: [
        { text: 'Signal with disappearing messages', points: 3 },
        { text: 'WhatsApp or Telegram', points: 1 },
        { text: 'WeChat, QQ, or Chinese apps', points: 0 },
        { text: 'Regular SMS or iMessage', points: 1 },
      ],
      recommendation: 'Use Signal for all sensitive communications. Enable disappearing messages. Never use WeChat or Chinese apps for anything sensitive.'
    },
    {
      id: 3,
      question: 'How do you manage your passwords?',
      category: 'Account Security',
      options: [
        { text: 'Password manager with unique passwords', points: 3 },
        { text: 'I remember different passwords for important accounts', points: 2 },
        { text: 'I use the same password for multiple accounts', points: 0 },
        { text: 'I write them down on paper', points: 1 },
      ],
      recommendation: 'Use a password manager like Bitwarden or 1Password. Generate unique, long passwords for every account.'
    },
    {
      id: 4,
      question: 'Do you use two-factor authentication (2FA)?',
      category: 'Account Security',
      options: [
        { text: 'Yes, with hardware key or authenticator app', points: 3 },
        { text: 'Yes, with SMS codes', points: 1 },
        { text: 'Only on some accounts', points: 1 },
        { text: 'No, I dont use 2FA', points: 0 },
      ],
      recommendation: 'Enable 2FA on all accounts. Use hardware keys (YubiKey) or authenticator apps. Avoid SMS-based 2FA when possible.'
    },
    {
      id: 5,
      question: 'What email service do you use for sensitive communications?',
      category: 'Communications',
      options: [
        { text: 'ProtonMail or Tutanota', points: 3 },
        { text: 'Gmail, Outlook, or Yahoo', points: 1 },
        { text: 'Chinese email services (QQ, 163, etc.)', points: 0 },
        { text: 'I use multiple services for different purposes', points: 2 },
      ],
      recommendation: 'Use ProtonMail or Tutanota for sensitive communications. Never use Chinese email services for anything related to activism.'
    },
    {
      id: 6,
      question: 'How do you handle your social media presence?',
      category: 'Digital Footprint',
      options: [
        { text: 'Separate accounts with pseudonyms for activism', points: 3 },
        { text: 'Private accounts with limited personal info', points: 2 },
        { text: 'Public accounts with real name and photos', points: 0 },
        { text: 'I dont use social media', points: 2 },
      ],
      recommendation: 'Use pseudonymous accounts for activism. Never link activist accounts to your real identity. Use different email addresses.'
    },
    {
      id: 7,
      question: 'Do you use Tor browser for sensitive research?',
      category: 'Network Security',
      options: [
        { text: 'Yes, regularly for sensitive topics', points: 3 },
        { text: 'Sometimes, when I remember', points: 1 },
        { text: 'No, I dont know how to use it', points: 0 },
        { text: 'I use private/incognito mode instead', points: 0 },
      ],
      recommendation: 'Use Tor Browser for researching sensitive topics. Private/incognito mode does NOT hide your activity from your ISP or government.'
    },
    {
      id: 8,
      question: 'How do you store sensitive documents?',
      category: 'Data Security',
      options: [
        { text: 'Encrypted storage (VeraCrypt, Cryptomator)', points: 3 },
        { text: 'Cloud storage with 2FA (Google Drive, Dropbox)', points: 1 },
        { text: 'On my computer without encryption', points: 0 },
        { text: 'I dont store sensitive documents digitally', points: 2 },
      ],
      recommendation: 'Use encrypted storage solutions like VeraCrypt or Cryptomator. Consider using Tails OS for highly sensitive work.'
    },
    {
      id: 9,
      question: 'Have you received security training or read security guides?',
      category: 'Knowledge',
      options: [
        { text: 'Yes, I regularly update my security knowledge', points: 3 },
        { text: 'I have read some guides', points: 2 },
        { text: 'No, but I want to learn', points: 1 },
        { text: 'I dont think I need security training', points: 0 },
      ],
      recommendation: 'Regularly update your security knowledge. Read guides from EFF, Access Now, and Front Line Defenders.'
    },
    {
      id: 10,
      question: 'Do you have a plan if your accounts are compromised?',
      category: 'Emergency Preparedness',
      options: [
        { text: 'Yes, with backup contacts and recovery plans', points: 3 },
        { text: 'I have some backup methods', points: 2 },
        { text: 'No, I havent thought about it', points: 0 },
        { text: 'I have trusted contacts who can help', points: 1 },
      ],
      recommendation: 'Create an emergency plan. Have backup communication methods. Know who to contact if compromised (Safeguard Defenders, Access Now).'
    },
  ];

  const handleAnswer = (points) => {
    setAnswers({ ...answers, [currentQuestion]: points });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final score
      const totalPoints = Object.values({ ...answers, [currentQuestion]: points }).reduce((a, b) => a + b, 0);
      setScore(totalPoints);
      setShowResults(true);
    }
  };

  const getSecurityLevel = () => {
    const maxScore = questions.length * 3;
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 80) return { level: 'EXCELLENT', color: 'text-green-400', bg: 'bg-green-600', message: 'Your security practices are strong. Keep staying vigilant!' };
    if (percentage >= 60) return { level: 'GOOD', color: 'text-blue-400', bg: 'bg-blue-600', message: 'You have good security habits but there is room for improvement.' };
    if (percentage >= 40) return { level: 'MODERATE', color: 'text-yellow-400', bg: 'bg-yellow-600', message: 'Your security needs improvement. Review the recommendations below.' };
    return { level: 'AT RISK', color: 'text-red-400', bg: 'bg-red-600', message: 'Your security practices put you at significant risk. Please implement the recommendations urgently.' };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const securityLevel = getSecurityLevel();
    const maxScore = questions.length * 3;
    
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="bg-[#111820] border border-[#1c2a35] p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Security Assessment Results</h2>
          <div className="text-6xl font-bold my-4">
            <span className={securityLevel.color}>{score}</span>
            <span className="text-slate-500">/{maxScore}</span>
          </div>
          <span className={`inline-block px-4 py-2 rounded-full text-white font-bold ${securityLevel.bg}`}>
            {securityLevel.level}
          </span>
          <p className="text-slate-300 mt-4">{securityLevel.message}</p>
        </div>

        {/* Recommendations */}
        <div className="bg-[#111820] border border-[#1c2a35] p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Personalized Recommendations</h3>
          <div className="space-y-4">
            {questions.map((q, index) => {
              const userPoints = answers[index] || 0;
              const needsImprovement = userPoints < 3;
              
              return needsImprovement ? (
                <div key={q.id} className="bg-[#0a0e14]/50 p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-yellow-400 font-medium">{q.category}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{q.recommendation}</p>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Resources */}
        <div className="bg-[#111820] border border-[#1c2a35] p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><LinkIcon className="w-5 h-5" /> Security Resources</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="https://ssd.eff.org/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4 transition-colors">
              <h4 className="font-semibold text-white">EFF Surveillance Self-Defense</h4>
              <p className="text-sm text-slate-400">Comprehensive security guides</p>
            </a>
            <a href="https://www.frontlinedefenders.org/en/digital-security-resources" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4 transition-colors">
              <h4 className="font-semibold text-white">Front Line Defenders</h4>
              <p className="text-sm text-slate-400">Resources for human rights defenders</p>
            </a>
            <a href="https://www.accessnow.org/help/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4 transition-colors">
              <h4 className="font-semibold text-white">Access Now Digital Security Helpline</h4>
              <p className="text-sm text-slate-400">24/7 emergency support</p>
            </a>
            <a href="https://securityinabox.org/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4 transition-colors">
              <h4 className="font-semibold text-white">Security in a Box</h4>
              <p className="text-sm text-slate-400">Digital security tools and tactics</p>
            </a>
          </div>
        </div>

        {/* Retake Button */}
        <div className="text-center">
          <button
            onClick={resetQuiz}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-medium transition-colors"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm text-slate-400">{question.category}</span>
        </div>
        <div className="w-full bg-[#111820] rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h2 className="text-xl font-bold text-white mb-6">{question.question}</h2>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.points)}
              className="w-full text-left bg-[#111820] hover:bg-[#1c2a35] border border-[#1c2a35] hover:border-red-500/50 p-4 transition-all"
            >
              <span className="text-white">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 p-4">
        <p className="text-sm text-yellow-300">
          <span className="font-semibold flex items-center gap-1"><Lock className="w-4 h-4" /> Privacy Notice:</span> Your answers are not stored or transmitted. 
          This assessment runs entirely in your browser.
        </p>
      </div>
    </div>
  );
};

export default SecurityQuiz;
