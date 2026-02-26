import React, { useState } from 'react';
import { Mail, Send, MessageCircle, Lock, Info, CheckCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { submitContactMessage } from '../services/supabaseService';

const ContactForm = () => {
  const backendConnected = isSupabaseConfigured();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const subjectOptions = [
    { id: 'general', name: 'General Inquiry' },
    { id: 'volunteer', name: 'Volunteering' },
    { id: 'report', name: 'Report an Issue' },
    { id: 'partnership', name: 'Partnership / Collaboration' },
    { id: 'media', name: 'Media Inquiry' },
    { id: 'technical', name: 'Technical / Bug Report' },
    { id: 'other', name: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (backendConnected) {
      setSubmitting(true);
      setSubmitError(null);
      const { error } = await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
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
          <CheckCircle className="w-12 h-12 text-green-400 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-white mb-2">Message Received</h2>
          <p className="text-slate-300 mb-4">
            {backendConnected
              ? 'Your message has been securely submitted. We will review it and respond as soon as possible.'
              : <>This contact form is not yet connected to a backend. Your data has <strong>not</strong> been submitted.
              To get in touch, please reach out to the organizations below directly:</>}
          </p>
          <div className="bg-[#111820]/50 p-4 text-left max-w-md mx-auto">
            <h3 className="font-medium text-white mb-2">Reach Out Directly:</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>→ <a href="https://www.hrw.org/contact-us" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">Human Rights Watch</a></li>
              <li>→ <a href="https://www.amnesty.org/en/contact-us/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">Amnesty International</a></li>
              <li>→ <a href="https://safeguarddefenders.com/en/contact" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">Safeguard Defenders</a></li>
              <li>→ <a href="https://freedomhouse.org/contact-us" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">Freedom House</a></li>
            </ul>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', subject: '', message: '' });
            }}
            className="mt-4 px-4 py-2 bg-[#111820] hover:bg-[#1c2a35] text-white transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#22d3ee] p-6">
        <div className="flex items-center mb-4">
          <Mail className="w-8 h-8 text-[#22d3ee] mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            <p className="text-slate-400">Get in touch with the Global Resistance Hub team</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Have a question, suggestion, or want to collaborate? Send us a message and we'll get back to you.
        </p>
      </div>

      {/* Coming Soon Notice */}
      {!backendConnected && (
        <div className="bg-amber-900/20 border border-amber-700/50 p-4 flex items-start gap-3">
          <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-300 text-sm">Form Not Yet Connected (Coming Soon)</h3>
            <p className="text-amber-200/70 text-xs mt-1">
              This contact form is not yet connected to a backend. Submitted data will not be stored or sent.
              For now, please reach out to the organizations listed at the bottom of this page directly.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email */}
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
          <h3 className="font-medium text-white mb-4"><MessageCircle className="w-4 h-4 inline mr-1" /> Your Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Name *</label>
              <input
                aria-label="Name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-[#0a0e14] border border-[#1c2a35] px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1c2a35]"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email *</label>
              <input
                aria-label="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-[#0a0e14] border border-[#1c2a35] px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1c2a35]"
              />
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
          <h3 className="font-medium text-white mb-4"><Send className="w-4 h-4 inline mr-1" /> Subject</h3>
          <select
            aria-label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-[#0a0e14] border border-[#1c2a35] px-3 py-2 text-white focus:outline-none focus:border-[#1c2a35]"
          >
            <option value="">Select a topic (optional)</option>
            {subjectOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
          <h3 className="font-medium text-white mb-4"><MessageCircle className="w-4 h-4 inline mr-1" /> Message</h3>
          <textarea
            aria-label="Message"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="How can we help you?"
            rows={5}
            className="w-full bg-[#0a0e14] border border-[#1c2a35] px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1c2a35]"
          />
        </div>

        {/* Security Notice */}
        <div className="bg-red-900/20 border border-red-700/50 p-4">
          <h3 className="font-medium text-red-400 mb-2"><Lock className="w-4 h-4 inline mr-1" /> Security Notice</h3>
          <p className="text-sm text-slate-300">
            If you are in a sensitive situation, consider using a secure email provider like ProtonMail.
            {!backendConnected && ' This form is a preview — no data is currently stored or transmitted.'}
          </p>
        </div>

        {/* Error message */}
        {submitError && (
          <div className="p-3 bg-red-900/30 border border-red-700/50 text-sm text-red-300">
            Error sending message: {submitError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 disabled:bg-[#111820] disabled:cursor-not-allowed text-[#0a0e14] font-medium transition-colors"
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

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

export default ContactForm;
