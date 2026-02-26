import React, { useState } from 'react';
import { Shield, AlertTriangle, Lock, Eye, FileText, Send, CheckCircle, ExternalLink } from 'lucide-react';

const WhistleblowerPortal = () => {
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const securityChecklist = [
    {
      item: 'Using Tor Browser',
      description: 'Access this portal through Tor Browser for maximum anonymity',
      critical: true,
      link: 'https://www.torproject.org'
    },
    {
      item: 'Using VPN',
      description: 'Connect through a trusted VPN before accessing',
      critical: true,
      link: 'https://www.privacytools.io/vpn'
    },
    {
      item: 'Secure device',
      description: 'Use a device that cannot be traced back to you',
      critical: true,
      link: null
    },
    {
      item: 'No personal information',
      description: 'Do not include any identifying information in your submission',
      critical: true,
      link: null
    },
    {
      item: 'Encrypted files',
      description: 'Encrypt sensitive files before uploading',
      critical: false,
      link: 'https://www.veracrypt.fr'
    },
    {
      item: 'Remove metadata',
      description: 'Strip EXIF data from photos and metadata from documents',
      critical: false,
      link: 'https://www.exifcleaner.com'
    }
  ];

  const submissionOrganizations = [
    {
      name: 'ICIJ (International Consortium of Investigative Journalists)',
      description: 'Secure platform for submitting leaked documents. Published China Cables and other major leaks.',
      secureSubmission: true,
      url: 'https://www.icij.org/leak/',
      features: ['Tor access', 'End-to-end encryption', 'No logs', 'Experienced journalists'],
      recommended: true
    },
    {
      name: 'The Intercept SecureDrop',
      description: 'Whistleblower submission system used by journalists worldwide.',
      secureSubmission: true,
      url: 'https://theintercept.com/source/',
      features: ['Tor-only access', 'No tracking', 'Secure messaging', 'Anonymous'],
      recommended: true
    },
    {
      name: 'New York Times Tips',
      description: 'Secure tips submission for major investigative journalism.',
      secureSubmission: true,
      url: 'https://www.nytimes.com/tips',
      features: ['Signal support', 'SecureDrop', 'Experienced China reporters'],
      recommended: true
    },
    {
      name: 'Radio Free Asia',
      description: 'Submit tips and evidence about CCP human rights abuses.',
      secureSubmission: false,
      url: 'https://www.rfa.org/english/contact',
      features: ['Multiple languages', 'China expertise', 'Whistleblower protection'],
      recommended: true
    },
    {
      name: 'Human Rights Watch',
      description: 'Submit evidence of human rights violations.',
      secureSubmission: false,
      url: 'https://www.hrw.org/contact-us',
      features: ['Legal expertise', 'International reach', 'Advocacy'],
      recommended: false
    },
    {
      name: 'Amnesty International',
      description: 'Report human rights abuses and provide evidence.',
      secureSubmission: false,
      url: 'https://www.amnesty.org/en/get-involved/contact/',
      features: ['Global network', 'Campaign support', 'Legal advocacy'],
      recommended: false
    }
  ];

  const documentTypes = [
    {
      type: 'Internal CCP Documents',
      examples: ['Policy directives', 'Meeting minutes', 'Internal communications', 'Orders'],
      importance: 'Critical',
      handling: 'Verify authenticity, translate if needed, cross-reference with known information'
    },
    {
      type: 'Police/Security Files',
      examples: ['Detention records', 'Surveillance reports', 'Arrest warrants', 'Interrogation logs'],
      importance: 'Critical',
      handling: 'Protect identities of victims, verify sources, coordinate with legal experts'
    },
    {
      type: 'Financial Records',
      examples: ['Corruption evidence', 'Money laundering', 'Asset transfers', 'Shell companies'],
      importance: 'High',
      handling: 'Verify transactions, trace connections, work with financial investigators'
    },
    {
      type: 'Photographic/Video Evidence',
      examples: ['Detention facilities', 'Abuse documentation', 'Protests', 'Forced labor'],
      importance: 'High',
      handling: 'Verify authenticity, remove metadata, protect identities of subjects'
    },
    {
      type: 'Witness Testimony',
      examples: ['First-hand accounts', 'Survivor stories', 'Insider information'],
      importance: 'High',
      handling: 'Protect identity, verify details, coordinate with legal teams'
    }
  ];

  return (
    <div className="bg-[#111820]/50 backdrop-blur-sm border border-[#1c2a35]/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-[#22d3ee]" />
        <div>
          <h2 className="text-2xl font-bold text-white">Whistleblower Portal</h2>
          <p className="text-slate-400 text-sm">Secure guidance for submitting leaked documents and evidence</p>
        </div>
      </div>

      {/* Critical Warning */}
      <div className="bg-red-500/10 border border-red-500/30 p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> CRITICAL SECURITY WARNING</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p><strong>This page is for INFORMATION ONLY.</strong> Do NOT submit sensitive documents through this website.</p>
              <p><strong>If you are in China or under CCP surveillance:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use Tor Browser ONLY</li>
                <li>Use a trusted VPN</li>
                <li>Use a device that cannot be traced to you</li>
                <li>Never access from work, home, or public WiFi</li>
                <li>Assume all communications are monitored</li>
              </ul>
              <p className="font-bold text-red-400 mt-3">Whistleblowing against the CCP is extremely dangerous. Your life may be at risk.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-[#22d3ee] text-[#0a0e14]' : 'bg-[#111820] text-slate-400'
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div className={`w-12 h-1 ${step > s ? 'bg-[#22d3ee]' : 'bg-[#111820]'}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Security Checklist */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Step 1: Security Checklist</h3>
            <p className="text-slate-300 text-sm mb-4">
              Before proceeding, ensure you have taken all necessary security precautions:
            </p>
          </div>

          <div className="space-y-3">
            {securityChecklist.map((item, index) => (
              <div key={index} className={`p-4 border ${item.critical ? 'bg-red-500/10 border-red-500/30' : 'bg-[#0a0e14]/50 border-[#1c2a35]/50'}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {item.critical ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : (
                      <Shield className="w-5 h-5 text-[#22d3ee]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white">{item.item}</h4>
                      {item.critical && (
                        <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400">
                          CRITICAL
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{item.description}</p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#22d3ee] hover:text-[#22d3ee] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Learn more
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#0a0e14]/50 border border-[#1c2a35]/50">
            <input
              aria-label="I understand the security protocols"
              type="checkbox"
              id="security-agreement"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="security-agreement" className="text-sm text-slate-300 cursor-pointer">
              I understand the security risks and have taken necessary precautions
            </label>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!agreedToTerms}
            className={`w-full py-3 font-medium transition-colors ${
              agreedToTerms
                ? 'bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14]'
                : 'bg-[#111820] text-slate-500 cursor-not-allowed'
            }`}
          >
            Continue to Step 2
          </button>
        </div>
      )}

      {/* Step 2: Choose Submission Method */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Step 2: Choose Submission Organization</h3>
            <p className="text-slate-300 text-sm mb-4">
              Select a trusted organization to submit your evidence. Organizations marked "Recommended" have secure submission systems.
            </p>
          </div>

          <div className="space-y-4">
            {submissionOrganizations.map((org, index) => (
              <div key={index} className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5 hover:border-[#1c2a35] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-bold text-white">{org.name}</h4>
                      {org.recommended && (
                        <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400">
                          Recommended
                        </span>
                      )}
                      {org.secureSubmission && (
                        <Lock className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{org.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {org.features.map((feature, fIndex) => (
                        <span key={fIndex} className="px-2 py-1 bg-[#111820] rounded text-xs text-slate-400">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] transition-colors text-sm inline-flex mt-3"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Submission Portal
                </a>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-[#111820] hover:bg-[#1c2a35] text-white font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] font-medium transition-colors"
            >
              Continue to Step 3
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Document Types */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Step 3: Understand Document Types</h3>
            <p className="text-slate-300 text-sm mb-4">
              Different types of evidence require different handling. Understand what you have:
            </p>
          </div>

          <div className="space-y-4">
            {documentTypes.map((doc, index) => (
              <div key={index} className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <FileText className="w-5 h-5 text-[#22d3ee] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-white">{doc.type}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        doc.importance === 'Critical' 
                          ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                          : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                      }`}>
                        {doc.importance}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="text-sm text-slate-400 mb-1">Examples:</div>
                      <div className="flex flex-wrap gap-2">
                        {doc.examples.map((example, eIndex) => (
                          <span key={eIndex} className="px-2 py-1 bg-[#111820] rounded text-xs text-slate-300">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">How it's handled:</div>
                      <p className="text-sm text-slate-300">{doc.handling}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-[#111820] hover:bg-[#1c2a35] text-white font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] font-medium transition-colors"
            >
              Continue to Step 4
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Final Checklist */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Step 4: Final Checklist Before Submission</h3>
            <p className="text-slate-300 text-sm mb-4">
              Review this checklist before submitting your evidence:
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-[#0a0e14]/50 border border-[#1c2a35]/50">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">Remove all identifying information</h4>
                  <p className="text-sm text-slate-300">Strip metadata, remove names, locations, dates that could identify you</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0a0e14]/50 border border-[#1c2a35]/50">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">Verify document authenticity</h4>
                  <p className="text-sm text-slate-300">Ensure documents are genuine and unaltered</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0a0e14]/50 border border-[#1c2a35]/50">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">Protect others</h4>
                  <p className="text-sm text-slate-300">Redact names and information that could endanger others</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0a0e14]/50 border border-[#1c2a35]/50">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">Use secure submission method</h4>
                  <p className="text-sm text-slate-300">Submit through Tor-enabled SecureDrop or similar secure platform</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0a0e14]/50 border border-[#1c2a35]/50">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">Destroy local copies securely</h4>
                  <p className="text-sm text-slate-300">After submission, securely delete all traces from your device</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0a0e14]/50 border border-[#1c2a35]/50">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">Have an exit plan</h4>
                  <p className="text-sm text-slate-300">If you're in danger, have a plan to leave China or seek asylum</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#22d3ee]/10 border border-[#1c2a35] p-4">
            <h3 className="text-[#22d3ee] font-bold mb-2">You're Ready</h3>
            <p className="text-slate-300 text-sm mb-3">
              You now have the information needed to safely submit evidence. Return to Step 2 to choose an organization and access their secure submission portal.
            </p>
            <p className="text-slate-300 text-sm font-bold">
              Remember: Your safety is the top priority. If you feel unsafe at any point, stop and seek help.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-[#111820] hover:bg-[#1c2a35] text-white font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] font-medium transition-colors"
            >
              Go to Submission Organizations
            </button>
          </div>
        </div>
      )}

      {/* Additional Resources */}
      <div className="mt-6 bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
        <h3 className="text-white font-bold mb-3">Additional Resources</h3>
        <div className="space-y-2">
          <a
            href="https://freedom.press/training/everything-you-wanted-know-about-media-source-protection/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820]/50 hover:bg-[#111820] transition-colors text-sm text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            Freedom of the Press Foundation - Source Protection Guide
          </a>
          <a
            href="https://www.eff.org/issues/anonymity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820]/50 hover:bg-[#111820] transition-colors text-sm text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            EFF - Anonymity Guide
          </a>
          <a
            href="https://ssd.eff.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820]/50 hover:bg-[#111820] transition-colors text-sm text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            Surveillance Self-Defense
          </a>
        </div>
      </div>
    </div>
  );
};

export default WhistleblowerPortal;
