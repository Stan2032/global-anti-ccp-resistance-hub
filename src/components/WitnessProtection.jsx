import React, { useState } from 'react';
import { ClipboardList, AlertTriangle, Siren, Plane, Scale, Handshake, Shield, Square } from 'lucide-react';

const WitnessProtection = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [riskLevel, setRiskLevel] = useState(null);
  const [riskAnswers, setRiskAnswers] = useState({});

  const sections = [
    { id: 'overview', name: 'Overview', Icon: ClipboardList },
    { id: 'assessment', name: 'Risk Assessment', Icon: AlertTriangle },
    { id: 'immediate', name: 'Immediate Steps', Icon: Siren },
    { id: 'relocation', name: 'Relocation', Icon: Plane },
    { id: 'legal', name: 'Legal Protection', Icon: Scale },
    { id: 'organizations', name: 'Organizations', Icon: Handshake },
  ];

  const riskQuestions = [
    {
      id: 'q1',
      question: 'Have you publicly criticized the CCP or spoken about human rights abuses?',
      weight: 2,
    },
    {
      id: 'q2',
      question: 'Do you have family members still in China, Hong Kong, Tibet, or Xinjiang?',
      weight: 3,
    },
    {
      id: 'q3',
      question: 'Have you received threats, warnings, or suspicious contact?',
      weight: 4,
    },
    {
      id: 'q4',
      question: 'Are you a journalist, activist, or human rights worker?',
      weight: 2,
    },
    {
      id: 'q5',
      question: 'Have you been approached by unknown individuals asking about your activities?',
      weight: 3,
    },
    {
      id: 'q6',
      question: 'Do you believe you are under surveillance (physical or digital)?',
      weight: 4,
    },
    {
      id: 'q7',
      question: 'Have you testified or provided evidence against CCP interests?',
      weight: 5,
    },
    {
      id: 'q8',
      question: 'Are you a former CCP official, police officer, or military member who has defected?',
      weight: 5,
    },
  ];

  const calculateRisk = () => {
    const totalWeight = riskQuestions.reduce((sum, q) => sum + q.weight, 0);
    const score = riskQuestions.reduce((sum, q) => {
      return sum + (riskAnswers[q.id] === 'yes' ? q.weight : 0);
    }, 0);
    const percentage = (score / totalWeight) * 100;
    
    if (percentage >= 60) return 'critical';
    if (percentage >= 40) return 'high';
    if (percentage >= 20) return 'moderate';
    return 'low';
  };

  const protectionOrganizations = [
    {
      name: 'Front Line Defenders',
      description: 'Protection and support for human rights defenders at risk',
      services: ['Emergency grants', 'Security training', 'Temporary relocation', 'Advocacy'],
      contact: '+353 1 210 0489 (24/7)',
      website: 'https://www.frontlinedefenders.org',
      region: 'Global',
    },
    {
      name: 'Safeguard Defenders',
      description: 'Specializes in China-related human rights cases',
      services: ['Legal support', 'Documentation', 'Advocacy', 'Research'],
      contact: 'contact@safeguarddefenders.com',
      website: 'https://safeguarddefenders.com',
      region: 'China focus',
    },
    {
      name: 'Uyghur Human Rights Project',
      description: 'Protection and advocacy for Uyghurs',
      services: ['Documentation', 'Advocacy', 'Family support', 'Legal referrals'],
      contact: 'info@uhrp.org',
      website: 'https://uhrp.org',
      region: 'Uyghur focus',
    },
    {
      name: 'Hong Kong Watch',
      description: 'Support for Hong Kong activists and refugees',
      services: ['Advocacy', 'Legal support', 'Resettlement assistance'],
      contact: 'info@hongkongwatch.org',
      website: 'https://www.hongkongwatch.org',
      region: 'Hong Kong focus',
    },
    {
      name: 'International Campaign for Tibet',
      description: 'Protection and advocacy for Tibetans',
      services: ['Advocacy', 'Documentation', 'Refugee support'],
      contact: 'info@savetibet.org',
      website: 'https://savetibet.org',
      region: 'Tibet focus',
    },
    {
      name: 'Reporters Without Borders',
      description: 'Protection for journalists and media workers',
      services: ['Emergency assistance', 'Legal support', 'Relocation', 'Advocacy'],
      contact: 'assistance@rsf.org',
      website: 'https://rsf.org',
      region: 'Global (journalists)',
    },
    {
      name: 'Committee to Protect Journalists',
      description: 'Emergency assistance for journalists at risk',
      services: ['Emergency grants', 'Legal defense', 'Relocation assistance'],
      contact: 'emergencies@cpj.org',
      website: 'https://cpj.org',
      region: 'Global (journalists)',
    },
    {
      name: 'Access Now',
      description: 'Digital security support for activists',
      services: ['24/7 digital security helpline', 'Security training', 'Advocacy'],
      contact: 'help@accessnow.org',
      website: 'https://www.accessnow.org',
      region: 'Global (digital)',
    },
  ];

  const relocationCountries = [
    {
      country: 'United Kingdom',
      flag: '🇬🇧',
      programs: ['BN(O) Visa for Hong Kongers', 'Asylum', 'Refugee resettlement'],
      notes: 'Strong Hong Kong community, active advocacy groups',
      difficulty: 'Moderate',
    },
    {
      country: 'United States',
      flag: '🇺🇸',
      programs: ['Asylum', 'Refugee resettlement', 'Hong Kong Safe Harbor'],
      notes: 'Large diaspora communities, strong legal protections',
      difficulty: 'Difficult',
    },
    {
      country: 'Canada',
      flag: '🇨🇦',
      programs: ['Asylum', 'Hong Kong Pathway', 'Refugee sponsorship'],
      notes: 'Welcoming immigration policy, strong Chinese diaspora',
      difficulty: 'Moderate',
    },
    {
      country: 'Australia',
      flag: '🇦🇺',
      programs: ['Asylum', 'Hong Kong visa extensions', 'Skilled migration'],
      notes: 'Active advocacy community, good support networks',
      difficulty: 'Moderate',
    },
    {
      country: 'Taiwan',
      flag: '🇹🇼',
      programs: ['Hong Kong humanitarian assistance', 'Residency programs'],
      notes: 'Cultural familiarity, but proximity to China is a concern',
      difficulty: 'Easy',
    },
    {
      country: 'Germany',
      flag: '🇩🇪',
      programs: ['Asylum', 'Humanitarian visa', 'Refugee resettlement'],
      notes: 'Strong human rights framework, active NGO community',
      difficulty: 'Moderate',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-purple-500 p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-8 h-8 text-purple-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Witness Protection Guide</h2>
            <p className="text-slate-400">Resources for at-risk activists and witnesses</p>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-700/50 p-3 mt-4">
          <p className="text-sm text-red-200">
            <strong className="inline-flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Important:</strong> If you are in immediate danger, contact local emergency services 
            or Front Line Defenders' 24/7 emergency line: <strong>+353 1 210 0489</strong>
          </p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-purple-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            <section.Icon className="w-4 h-4" />
            <span>{section.name}</span>
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <h3 className="text-lg font-semibold text-white mb-3">Who Needs Protection?</h3>
            <p className="text-slate-300 mb-4">
              The CCP conducts transnational repression against critics worldwide. You may need 
              protection if you are:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>A <strong>witness</strong> to human rights abuses (camps, torture, forced labor)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>A <strong>defector</strong> from CCP, police, or military</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>A <strong>journalist</strong> covering sensitive topics</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>An <strong>activist</strong> organizing resistance activities</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>A <strong>family member</strong> of someone the CCP wants to silence</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Anyone who has <strong>testified</strong> against CCP interests</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <h3 className="text-lg font-semibold text-white mb-3">Types of Threats</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-900/20 border border-red-700/30 p-3">
                <h4 className="font-medium text-red-300 mb-2">Direct Threats</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Physical surveillance</li>
                  <li>• Kidnapping/forced return</li>
                  <li>• Physical assault</li>
                  <li>• Detention during travel</li>
                </ul>
              </div>
              <div className="bg-orange-900/20 border border-orange-700/30 p-3">
                <h4 className="font-medium text-orange-300 mb-2">Indirect Threats</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Threats to family in China</li>
                  <li>• Harassment campaigns</li>
                  <li>• Doxxing and smear campaigns</li>
                  <li>• Economic pressure</li>
                </ul>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700/30 p-3">
                <h4 className="font-medium text-yellow-300 mb-2">Digital Threats</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Hacking and surveillance</li>
                  <li>• Phishing attacks</li>
                  <li>• Social media monitoring</li>
                  <li>• Device compromise</li>
                </ul>
              </div>
              <div className="bg-blue-900/20 border border-blue-700/30 p-3">
                <h4 className="font-medium text-blue-300 mb-2">Legal Threats</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Interpol red notices (abuse)</li>
                  <li>• Extradition requests</li>
                  <li>• Lawsuits (SLAPP)</li>
                  <li>• Visa/immigration issues</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment Section */}
      {activeSection === 'assessment' && (
        <div className="space-y-4">
          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Risk Assessment</h3>
            <p className="text-slate-400 mb-4 text-sm">
              Answer these questions to assess your risk level. This is for guidance only - 
              if you feel unsafe, seek help immediately.
            </p>
            
            <div className="space-y-4">
              {riskQuestions.map(q => (
                <div key={q.id} className="bg-[#0a0e14]/50 p-4">
                  <p className="text-white mb-3">{q.question}</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setRiskAnswers({...riskAnswers, [q.id]: 'yes'})}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        riskAnswers[q.id] === 'yes'
                          ? 'bg-red-600 text-white'
                          : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setRiskAnswers({...riskAnswers, [q.id]: 'no'})}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        riskAnswers[q.id] === 'no'
                          ? 'bg-green-600 text-white'
                          : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {Object.keys(riskAnswers).length === riskQuestions.length && (
              <div className="mt-6">
                <button
                  onClick={() => setRiskLevel(calculateRisk())}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 font-medium transition-colors"
                >
                  Calculate Risk Level
                </button>
              </div>
            )}

            {riskLevel && (
              <div className={`mt-6 p-4 border ${
                riskLevel === 'critical' ? 'bg-red-900/30 border-red-700' :
                riskLevel === 'high' ? 'bg-orange-900/30 border-orange-700' :
                riskLevel === 'moderate' ? 'bg-yellow-900/30 border-yellow-700' :
                'bg-green-900/30 border-green-700'
              }`}>
                <h4 className={`font-semibold text-lg mb-2 ${
                  riskLevel === 'critical' ? 'text-red-400' :
                  riskLevel === 'high' ? 'text-orange-400' :
                  riskLevel === 'moderate' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  Risk Level: {riskLevel.toUpperCase()}
                </h4>
                <p className="text-slate-300 text-sm">
                  {riskLevel === 'critical' && 'You should seek immediate assistance from protection organizations. Consider temporary relocation and contact Front Line Defenders.'}
                  {riskLevel === 'high' && 'You should take significant precautions. Contact a protection organization for a security assessment and develop an emergency plan.'}
                  {riskLevel === 'moderate' && 'You should implement basic security measures and stay vigilant. Review the safety checklist and establish emergency contacts.'}
                  {riskLevel === 'low' && 'Your current risk appears low, but stay informed about security best practices and monitor for any changes.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Immediate Steps Section */}
      {activeSection === 'immediate' && (
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-700/50 p-5">
            <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2"><Siren className="w-5 h-5" /> If You're in Immediate Danger</h3>
            <ol className="space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">1</span>
                <span><strong>Call local emergency services</strong> (911, 999, 000, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">2</span>
                <span><strong>Go to a safe location</strong> - police station, embassy, trusted friend</span>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">3</span>
                <span><strong>Contact Front Line Defenders</strong>: +353 1 210 0489 (24/7)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">4</span>
                <span><strong>Document everything</strong> - photos, videos, written accounts</span>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">5</span>
                <span><strong>Alert trusted contacts</strong> about your situation</span>
              </li>
            </ol>
          </div>

          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><ClipboardList className="w-5 h-5" /> First 48 Hours Checklist</h3>
            <div className="space-y-2">
              {[
                'Secure all devices - change passwords, enable 2FA',
                'Back up important documents to encrypted cloud',
                'Inform trusted contacts of your situation',
                'Document all threats and suspicious activity',
                'Contact a protection organization',
                'Review your digital footprint - remove identifying info',
                'Prepare a go-bag with essentials',
                'Identify safe locations and escape routes',
                'Consider temporary accommodation change',
                'Consult with a lawyer about your options',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-2 bg-[#0a0e14]/50 rounded">
                  <Square className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Relocation Section */}
      {activeSection === 'relocation' && (
        <div className="space-y-4">
          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Relocation Options</h3>
            <p className="text-slate-400 mb-4 text-sm">
              If you need to relocate for safety, these countries have programs for at-risk individuals:
            </p>
            
            <div className="space-y-3">
              {relocationCountries.map((country, idx) => (
                <div key={idx} className="bg-[#0a0e14]/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{country.flag}</span>
                      <h4 className="font-medium text-white">{country.country}</h4>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      country.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' :
                      country.difficulty === 'Moderate' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-red-900/50 text-red-400'
                    }`}>
                      {country.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {country.programs.map((program, pidx) => (
                      <span key={pidx} className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded">
                        {program}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-400">{country.notes}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-700/50 p-4">
            <h3 className="font-medium text-yellow-300 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Important Considerations</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• <strong>Avoid countries with extradition treaties with China</strong></li>
              <li>• Consider proximity to China and CCP influence</li>
              <li>• Research local Chinese diaspora community dynamics</li>
              <li>• Consult with protection organizations before relocating</li>
              <li>• Have legal representation in your destination country</li>
            </ul>
          </div>
        </div>
      )}

      {/* Legal Protection Section */}
      {activeSection === 'legal' && (
        <div className="space-y-4">
          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <h3 className="text-lg font-semibold text-white mb-3">Legal Protections Available</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-700/30 p-4">
                <h4 className="font-medium text-blue-300 mb-2">Asylum</h4>
                <p className="text-sm text-slate-400">
                  If you fear persecution, you can apply for asylum in most democratic countries. 
                  You must demonstrate a well-founded fear of persecution based on race, religion, 
                  nationality, political opinion, or membership in a particular social group.
                </p>
              </div>

              <div className="bg-green-900/20 border border-green-700/30 p-4">
                <h4 className="font-medium text-green-300 mb-2">Refugee Status</h4>
                <p className="text-sm text-slate-400">
                  UNHCR can provide refugee status and facilitate resettlement to a third country. 
                  This is particularly relevant if you're in a country that doesn't offer asylum.
                </p>
              </div>

              <div className="bg-purple-900/20 border border-purple-700/30 p-4">
                <h4 className="font-medium text-purple-300 mb-2">Humanitarian Visas</h4>
                <p className="text-sm text-slate-400">
                  Some countries offer humanitarian visas for people at risk. These are often 
                  faster than asylum processes but may have limited duration.
                </p>
              </div>

              <div className="bg-orange-900/20 border border-orange-700/30 p-4">
                <h4 className="font-medium text-orange-300 mb-2">Interpol Red Notice Challenges</h4>
                <p className="text-sm text-slate-400">
                  China abuses Interpol red notices to target dissidents. If you're subject to one, 
                  you can challenge it through Interpol's Commission for the Control of Files (CCF).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <h3 className="text-lg font-semibold text-white mb-3">Legal Resources</h3>
            <div className="space-y-2 text-sm">
              <a href="https://www.unhcr.org" target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:underline">
                UNHCR - UN Refugee Agency
              </a>
              <a href="https://www.interpol.int/How-we-work/Notices/View-Red-Notices" target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:underline">
                Interpol - Challenge Red Notices
              </a>
              <a href="https://www.amnesty.org/en/what-we-do/refugees-asylum-seekers-and-migrants/" target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:underline">
                Amnesty International - Refugee Rights
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Organizations Section */}
      {activeSection === 'organizations' && (
        <div className="space-y-4">
          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Protection Organizations</h3>
            
            <div className="space-y-4">
              {protectionOrganizations.map((org, idx) => (
                <div key={idx} className="bg-[#0a0e14]/50 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white">{org.name}</h4>
                    <span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded">
                      {org.region}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{org.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {org.services.map((service, sidx) => (
                      <span key={sidx} className="text-xs px-2 py-1 bg-[#111820] text-slate-300 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{org.contact}</span>
                    <a 
                      href={org.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Website →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
        <p className="text-sm text-slate-400">
          This guide is for informational purposes only. Always consult with professional 
          protection organizations for personalized advice.
        </p>
      </div>
    </div>
  );
};

export default WitnessProtection;
