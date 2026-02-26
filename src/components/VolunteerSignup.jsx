import React, { useState } from 'react';
import { Globe, PenTool, Search, Smartphone, Palette, Clapperboard, Laptop, Scale, ClipboardList, Handshake, PartyPopper, UserPlus, Flame, FileText, Wrench, MessageCircle, Lock, Info } from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { submitVolunteerSignup } from '../services/supabaseService';

const VolunteerSignup = () => {
  const backendConnected = isSupabaseConfigured();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [],
    availability: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const skillOptions = [
    { id: 'translation', name: 'Translation', Icon: Globe },
    { id: 'writing', name: 'Writing/Editing', Icon: PenTool },
    { id: 'research', name: 'Research', Icon: Search },
    { id: 'social-media', name: 'Social Media', Icon: Smartphone },
    { id: 'graphic-design', name: 'Graphic Design', Icon: Palette },
    { id: 'video-editing', name: 'Video Editing', Icon: Clapperboard },
    { id: 'web-dev', name: 'Web Development', Icon: Laptop },
    { id: 'legal', name: 'Legal/Policy', Icon: Scale },
    { id: 'organizing', name: 'Event Organizing', Icon: ClipboardList },
    { id: 'outreach', name: 'Community Outreach', Icon: Handshake },
  ];

  const availabilityOptions = [
    { id: '1-5', name: '1-5 hours/week' },
    { id: '5-10', name: '5-10 hours/week' },
    { id: '10-20', name: '10-20 hours/week' },
    { id: '20+', name: '20+ hours/week' },
    { id: 'flexible', name: 'Flexible/As needed' },
  ];

  const toggleSelection = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (backendConnected) {
      setSubmitting(true);
      setSubmitError(null);
      const { error } = await submitVolunteerSignup({
        name: formData.name,
        email: formData.email,
        skills: formData.skills,
        languages: [],
        availability: formData.availability,
        message: formData.message,
      });
      setSubmitting(false);
      if (error) {
        setSubmitError(error);
        return;
      }
    }
    // Static-only fallback or success
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-900/30 border border-amber-700/50 p-8 text-center">
          <PartyPopper className="w-12 h-12 text-amber-400 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-white mb-2">Thank You for Your Interest!</h2>
          <p className="text-slate-300 mb-4">
            {backendConnected
              ? 'Your volunteer application has been securely submitted. We will review it and get back to you. You can also reach out to the organizations below directly:'
              : <>This volunteer signup form is not yet connected to a backend. Your data has <strong>not</strong> been submitted.
              To volunteer, please contact the organizations below directly:</>}
          </p>
          <div className="bg-[#111820]/50 p-4 text-left max-w-md mx-auto">
            <h3 className="font-medium text-white mb-2">Volunteer Directly With:</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>→ <a href="https://www.uhrp.org/get-involved/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">Uyghur Human Rights Project</a></li>
              <li>→ <a href="https://www.hongkongwatch.org/volunteer" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">Hong Kong Watch</a></li>
              <li>→ <a href="https://tibetaction.net/get-involved/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">Tibet Action Institute</a></li>
              <li>→ <a href="https://www.amnesty.org/en/get-involved/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">Amnesty International</a></li>
            </ul>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '', email: '', skills: [],
                availability: '', message: '',
              });
            }}
            className="mt-4 px-4 py-2 bg-[#111820] hover:bg-[#1c2a35] text-white transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-green-500">
        <div className="flex items-center mb-4">
          <UserPlus className="w-8 h-8 text-green-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Volunteer With Us</h2>
            <p className="text-slate-400">Join the global movement for human rights</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          We're always looking for dedicated volunteers to help with research, translation, 
          outreach, and more. Fill out this form to get involved.
        </p>
      </div>

      {/* Current Needs */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 p-4">
        <h3 className="font-medium text-white mb-2"><Flame className="w-4 h-4 inline mr-1 text-yellow-400" /> Current Priority Needs</h3>
        <div className="grid md:grid-cols-3 gap-2">
          <div className="bg-[#111820]/50 p-2 text-sm">
            <span className="text-yellow-400 font-medium">Translators</span>
            <p className="text-xs text-slate-400">Uyghur, Tibetan, Cantonese</p>
          </div>
          <div className="bg-[#111820]/50 p-2 text-sm">
            <span className="text-yellow-400 font-medium">Researchers</span>
            <p className="text-xs text-slate-400">OSINT, supply chain analysis</p>
          </div>
          <div className="bg-[#111820]/50 p-2 text-sm">
            <span className="text-yellow-400 font-medium">Social Media</span>
            <p className="text-xs text-slate-400">Content creation, outreach</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      {!backendConnected && (
      <div className="bg-amber-900/20 border border-amber-700/50 p-4 flex items-start gap-3">
        <UserPlus className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-300 text-sm">Form Not Yet Connected (Coming Soon)</h3>
          <p className="text-amber-200/70 text-xs mt-1">
            This form is not yet connected to a backend. Submitted data will not be stored or sent anywhere.
            To volunteer now, please visit the partner organizations listed at the bottom of this page.
          </p>
        </div>
      </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
          <h3 className="font-medium text-white mb-4"><FileText className="w-4 h-4 inline mr-1" /> Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Name *</label>
              <input
                aria-label="Name *"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name (can be pseudonym)"
                className="w-full bg-[#0a0e14] border border-[#1c2a35] px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email *</label>
              <input
                aria-label="Email *"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-[#0a0e14] border border-[#1c2a35] px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Availability *</label>
              <select
                aria-label="Availability *"
                required
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full bg-[#0a0e14] border border-[#1c2a35] px-3 py-2 text-white focus:outline-none focus:border-green-500"
              >
                <option value="">Select availability</option>
                {availabilityOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
          <h3 className="font-medium text-white mb-4"><Wrench className="w-4 h-4 inline mr-1" /> Skills (select all that apply)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {skillOptions.map(skill => (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSelection('skills', skill.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm transition-colors ${
                  formData.skills.includes(skill.id)
                    ? 'bg-green-600 text-white'
                    : 'bg-[#0a0e14] text-slate-300 hover:bg-[#111820]'
                }`}
              >
                <skill.Icon className="w-4 h-4" />
                <span>{skill.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
          <h3 className="font-medium text-white mb-4"><MessageCircle className="w-4 h-4 inline mr-1" /> Tell Us More (optional)</h3>
          <textarea
            aria-label="Tell us about yourself"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us about your experience, motivation, or how you'd like to help"
            rows={3}
            className="w-full bg-[#0a0e14] border border-[#1c2a35] px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Security Notice */}
        <div className="bg-red-900/20 border border-red-700/50 p-4">
          <h3 className="font-medium text-red-400 mb-2"><Lock className="w-4 h-4 inline mr-1" /> Security Notice</h3>
          <p className="text-sm text-slate-300">
            If you are in a sensitive situation, consider using a pseudonym and secure email when contacting organizations.
            {!backendConnected && ' This form is a preview — no data is currently stored or transmitted.'}
          </p>
        </div>

        {/* Error message */}
        {submitError && (
          <div className="p-3 bg-red-900/30 border border-red-700/50 text-sm text-red-300">
            Error submitting application: {submitError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-[#111820] disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Volunteer Application'}
        </button>
      </form>

      {/* Partner Organizations */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-2"><Handshake className="w-4 h-4 inline mr-1" /> Partner Organizations Also Seeking Volunteers</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="https://www.uhrp.org/get-involved/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Uyghur Human Rights Project
          </a>
          <a href="https://www.hongkongwatch.org/volunteer" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Hong Kong Watch
          </a>
          <a href="https://tibetaction.net/get-involved/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Students for a Free Tibet
          </a>
          <a href="https://www.amnesty.org/en/get-involved/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Amnesty International
          </a>
        </div>
      </div>

      {/* Backend status footer */}
      <div className="bg-[#0a0e14]/50 border border-[#1c2a35] p-3">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          {backendConnected ? (
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Connected to secure backend
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3" /> Form not yet active — coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerSignup;
