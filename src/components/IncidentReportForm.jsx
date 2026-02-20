import { useState } from 'react';
import { AlertTriangle, Lock, Info } from 'lucide-react';

const IncidentReportForm = () => {
  const [formData, setFormData] = useState({
    incidentType: '',
    location: '',
    date: '',
    description: '',
    perpetrators: '',
    witnesses: '',
    evidence: '',
    contactEmail: '',
    anonymous: true,
    consent: false,
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const incidentTypes = [
    { value: 'police_station', label: 'CCP Overseas Police Station Activity', description: 'Coercion, intimidation, or "persuasion" by unofficial Chinese police' },
    { value: 'surveillance', label: 'Surveillance / Monitoring', description: 'Being followed, photographed, or having devices compromised' },
    { value: 'harassment', label: 'Harassment / Intimidation', description: 'Threats, pressure, or intimidation from CCP-linked individuals' },
    { value: 'family_threats', label: 'Threats to Family in China', description: 'Family members in China being threatened or detained' },
    { value: 'cyber_attack', label: 'Cyber Attack / Hacking', description: 'Phishing, malware, or account compromises' },
    { value: 'academic', label: 'Academic Interference', description: 'Pressure at universities, CSSA involvement, research theft' },
    { value: 'media', label: 'Media / Censorship', description: 'Pressure to remove content, deplatforming, disinformation' },
    { value: 'economic', label: 'Economic Coercion', description: 'Business pressure, visa denial, financial threats' },
    { value: 'other', label: 'Other', description: 'Other forms of transnational repression' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to a secure backend
    setSubmitted(true);
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  if (submitted) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Thank You for Your Report</h2>
        <p className="text-slate-400 mb-6">
          This form is not yet connected to a backend. Your data has <strong>not</strong> been submitted or stored.
          Please report directly to the organizations below:
        </p>
        <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-white mb-2">Report Directly To:</h3>
          <ul className="text-sm text-slate-400 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">→</span>
              <a href="https://safeguarddefenders.com/en/contact" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Safeguard Defenders</a> — CCP transnational repression specialists
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">→</span>
              <a href="https://www.fbi.gov/tips" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">FBI Tips</a> — If you're in the United States
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">→</span>
              <a href="https://www.hrw.org/contact-us" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Human Rights Watch</a> — International human rights documentation
            </li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({
                incidentType: '',
                location: '',
                date: '',
                description: '',
                perpetrators: '',
                witnesses: '',
                evidence: '',
                contactEmail: '',
                anonymous: true,
                consent: false,
              });
            }}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Submit Another Report
          </button>
          <a
            href="https://safeguarddefenders.com/en/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Contact Safeguard Defenders
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/50 to-slate-900 p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Report CCP Harassment or Transnational Repression
        </h2>
        <p className="text-slate-400 mt-1">
          Your report helps document patterns of CCP interference worldwide
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-900/20 border-b border-amber-700/50 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-300 text-sm">Form Not Yet Connected (Coming Soon)</h3>
            <p className="text-amber-200/70 text-xs mt-1">
              This form is not yet connected to a backend service. Submitted data is not stored or transmitted.
              For immediate reporting, please contact <a href="https://safeguarddefenders.com/en/contact" target="_blank" rel="noopener noreferrer" className="underline text-amber-300 hover:text-amber-200">Safeguard Defenders</a> or the <a href="https://www.fbi.gov/tips" target="_blank" rel="noopener noreferrer" className="underline text-amber-300 hover:text-amber-200">FBI Tips line</a> directly.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= s ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 sm:w-24 h-1 mx-2 ${
                  step > s ? 'bg-red-600' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-slate-400">
          <span>Incident Type</span>
          <span>Details</span>
          <span>Submit</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Step 1: Incident Type */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">What type of incident are you reporting?</h3>
            <div className="grid gap-3">
              {incidentTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.incidentType === type.value
                      ? 'bg-red-900/30 border-red-600'
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="incidentType"
                    value={type.value}
                    checked={formData.incidentType === type.value}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-white">{type.label}</div>
                    <div className="text-sm text-slate-400">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Incident Details</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Location (City, Country)
                </label>
                <input
                  aria-label="Location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., London, UK"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Date of Incident
                </label>
                <input
                  aria-label="Date of Incident"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Description of Incident *
              </label>
              <textarea
                aria-label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Please describe what happened in as much detail as you feel comfortable sharing..."
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Perpetrators (if known)
              </label>
              <input
                aria-label="Perpetrators"
                type="text"
                name="perpetrators"
                value={formData.perpetrators}
                onChange={handleChange}
                placeholder="e.g., Unknown individuals, Chinese embassy staff, CSSA members"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Evidence Available
              </label>
              <input
                aria-label="Evidence"
                type="text"
                name="evidence"
                value={formData.evidence}
                onChange={handleChange}
                placeholder="e.g., Screenshots, photos, recordings, documents"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Do not upload files here. If you have evidence, mention it and we'll provide secure upload instructions.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Contact & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Contact & Submission</h3>
            
            <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-white">Submit Anonymously</div>
                  <div className="text-sm text-slate-400">
                    Your report will be recorded without any identifying information
                  </div>
                </div>
              </label>
            </div>

            {!formData.anonymous && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Contact Email (optional)
                </label>
                <input
                  aria-label="Contact Email"
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="your-secure-email@protonmail.com"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  We recommend using a secure email provider like ProtonMail
                </p>
              </div>
            )}

            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-yellow-300 text-sm">Consent to Share Data</div>
                  <div className="text-xs text-yellow-200/70 mt-1">
                    I understand that this information may be shared with verified human rights organizations 
                    (such as Safeguard Defenders, Freedom House, and government agencies) to document and 
                    combat CCP transnational repression. My personal information will be protected.
                  </div>
                </div>
              </label>
            </div>

            {/* Summary */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Report Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Incident Type:</span>
                  <span className="text-white">{incidentTypes.find(t => t.value === formData.incidentType)?.label || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white">{formData.location || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="text-white">{formData.date || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Anonymous:</span>
                  <span className="text-white">{formData.anonymous ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t border-slate-700">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={step === 1 && !formData.incidentType}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={!formData.consent || !formData.description}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Submit Securely
            </button>
          )}
        </div>
      </form>

      {/* Footer */}
      <div className="bg-slate-900/50 p-4 border-t border-slate-700">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3" /> Form not yet active — coming soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportForm;
