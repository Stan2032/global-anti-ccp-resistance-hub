import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SIGHTING_TYPES = [
  {
    id: 'police_station',
    label: 'Overseas Police Station',
    icon: '🚔',
    description: 'Suspected CCP police service center or "110 overseas" operation',
    fields: ['address', 'operating_hours', 'signage', 'activities_observed']
  },
  {
    id: 'surveillance',
    label: 'Surveillance Activity',
    icon: '📹',
    description: 'Suspected monitoring, photography, or tracking of diaspora',
    fields: ['location', 'description', 'targets', 'frequency']
  },
  {
    id: 'intimidation',
    label: 'Intimidation/Harassment',
    icon: '⚠️',
    description: 'Threats, harassment, or pressure on individuals or family',
    fields: ['incident_type', 'description', 'threats_made', 'family_targeted']
  },
  {
    id: 'united_front',
    label: 'United Front Activity',
    icon: '🎭',
    description: 'Suspected UFWD operations, CSSAs, or influence campaigns',
    fields: ['organization', 'activity_type', 'funding_sources', 'connections']
  },
  {
    id: 'disinformation',
    label: 'Disinformation Campaign',
    icon: '📱',
    description: 'Coordinated propaganda, bot networks, or fake accounts',
    fields: ['platform', 'content_type', 'accounts_involved', 'narrative']
  },
  {
    id: 'infiltration',
    label: 'Institutional Infiltration',
    icon: '🏛️',
    description: 'CCP influence in universities, businesses, or government',
    fields: ['institution', 'type', 'individuals', 'evidence']
  },
  {
    id: 'other',
    label: 'Other Activity',
    icon: '📋',
    description: 'Any other suspicious CCP-related activity',
    fields: ['description', 'evidence', 'concerns']
  }
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Netherlands', 'Italy', 'Spain', 'Ireland', 'Japan',
  'South Korea', 'Taiwan', 'New Zealand', 'Sweden', 'Norway', 'Denmark',
  'Belgium', 'Switzerland', 'Austria', 'Portugal', 'Czech Republic',
  'Poland', 'Hungary', 'Romania', 'Greece', 'Turkey', 'South Africa',
  'Brazil', 'Argentina', 'Mexico', 'India', 'Indonesia', 'Malaysia',
  'Singapore', 'Thailand', 'Philippines', 'Vietnam', 'Other'
];

const ReportSighting = () => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    country: '',
    city: '',
    date: '',
    description: '',
    evidence: '',
    contact: '',
    anonymous: true,
    consent: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData(prev => ({ ...prev, type: type.id }));
    setStep(2);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send to a secure backend
    console.log('Report submitted:', formData);
    setSubmitted(true);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedType(null);
    setFormData({
      type: '',
      country: '',
      city: '',
      date: '',
      description: '',
      evidence: '',
      contact: '',
      anonymous: true,
      consent: false
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-900/30 border border-green-500 rounded-lg p-8 text-center"
      >
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-400 mb-4">Report Submitted</h3>
        <p className="text-gray-300 mb-6">
          Thank you for your report. Your information helps document CCP activities 
          and protect diaspora communities worldwide.
        </p>
        <div className="bg-slate-800 rounded-lg p-4 mb-6 text-left">
          <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Important Security Reminder</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Clear your browser history if using a shared device</li>
            <li>• Consider using Tor for future reports</li>
            <li>• Do not discuss this report on unsecured channels</li>
            <li>• If you feel unsafe, contact emergency services</li>
          </ul>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={resetForm}
            className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Submit Another Report
          </button>
          <a
            href="/security"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Security Resources
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">🔍 Report CCP Activity</h2>
        <p className="text-gray-200">
          Help document transnational repression and CCP influence operations
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-900/30 border-b border-yellow-700 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h4 className="font-semibold text-yellow-400">Security First</h4>
            <p className="text-sm text-gray-300">
              For your safety, we recommend using a VPN or Tor browser. 
              Reports can be submitted anonymously. No personal data is required.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-red-600 text-white' : 'bg-slate-700 text-gray-400'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > s ? 'bg-red-600' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 mt-2 text-sm text-gray-400">
          <span className={step >= 1 ? 'text-red-400' : ''}>Type</span>
          <span className={step >= 2 ? 'text-red-400' : ''}>Details</span>
          <span className={step >= 3 ? 'text-red-400' : ''}>Review</span>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                What type of activity are you reporting?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SIGHTING_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type)}
                    className="p-4 bg-slate-700 rounded-lg text-left hover:bg-slate-600 hover:border-red-500 border border-transparent transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-semibold text-white">{type.label}</span>
                    </div>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{selectedType?.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedType?.label}</h3>
                  <p className="text-sm text-gray-400">{selectedType?.description}</p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country *
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                      required
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City/Region
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g., London, New York"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Observation
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Please describe what you observed in detail. Include specific locations, times, individuals involved (if known), and any other relevant information."
                    rows={5}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Evidence/Documentation
                  </label>
                  <textarea
                    value={formData.evidence}
                    onChange={(e) => handleInputChange('evidence', e.target.value)}
                    placeholder="Describe any photos, videos, documents, or other evidence you have. Do NOT upload files here - use secure channels like SecureDrop if available."
                    rows={3}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!formData.country || !formData.description}
                    className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Review Your Report</h3>

              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <p className="text-white">{selectedType?.label}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <p className="text-white">{formData.city}, {formData.country}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="text-white">{formData.date || 'Not specified'}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-gray-400 text-sm">Description:</span>
                  <p className="text-white mt-1">{formData.description}</p>
                </div>
                {formData.evidence && (
                  <div className="mt-4">
                    <span className="text-gray-400 text-sm">Evidence:</span>
                    <p className="text-white mt-1">{formData.evidence}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.anonymous}
                    onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-white font-medium">Submit anonymously</span>
                    <p className="text-sm text-gray-400">
                      Your report will not include any identifying information
                    </p>
                  </div>
                </label>

                {!formData.anonymous && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Information (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      placeholder="Secure email or Signal number"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => handleInputChange('consent', e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <div>
                    <span className="text-white font-medium">I consent to share this information *</span>
                    <p className="text-sm text-gray-400">
                      This report may be shared with human rights organizations, researchers, 
                      and government agencies investigating CCP activities
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!formData.consent}
                  className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Resources */}
      <div className="bg-slate-900 p-4 border-t border-slate-700">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Report to Official Channels:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="https://www.fbi.gov/tips" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            🇺🇸 FBI Tips
          </a>
          <a href="https://www.mi5.gov.uk/contact-us" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            🇬🇧 MI5
          </a>
          <a href="https://www.rcmp-grc.gc.ca/en/report-information" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            🇨🇦 RCMP
          </a>
          <a href="https://www.asio.gov.au/report-suspicious-activity" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            🇦🇺 ASIO
          </a>
          <a href="https://safeguarddefenders.com/en/contact" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            🌐 Safeguard Defenders
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReportSighting;
