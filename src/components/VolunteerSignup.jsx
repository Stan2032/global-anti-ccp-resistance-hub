import React, { useState } from 'react';
import { Globe, PenTool, Search, Smartphone, Palette, Clapperboard, Laptop, Scale, ClipboardList, Handshake, Landmark, Mountain, Megaphone, Link2, Globe2, Newspaper, PartyPopper, UserPlus, Flame, FileText, Wrench, Heart, MessageCircle, Lock } from 'lucide-react';

const VolunteerSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    skills: [],
    availability: '',
    languages: [],
    experience: '',
    interests: [],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

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

  const languageOptions = [
    { id: 'english', name: 'English' },
    { id: 'mandarin', name: 'Mandarin Chinese' },
    { id: 'cantonese', name: 'Cantonese' },
    { id: 'uyghur', name: 'Uyghur' },
    { id: 'tibetan', name: 'Tibetan' },
    { id: 'taiwanese', name: 'Taiwanese/Hokkien' },
    { id: 'spanish', name: 'Spanish' },
    { id: 'french', name: 'French' },
    { id: 'german', name: 'German' },
    { id: 'japanese', name: 'Japanese' },
    { id: 'korean', name: 'Korean' },
    { id: 'other', name: 'Other' },
  ];

  const interestOptions = [
    { id: 'uyghur', name: 'Uyghur Rights', Icon: Landmark },
    { id: 'hongkong', name: 'Hong Kong', icon: '🇭🇰' },
    { id: 'tibet', name: 'Tibet', Icon: Mountain },
    { id: 'taiwan', name: 'Taiwan', icon: '🇹🇼' },
    { id: 'dissidents', name: 'Chinese Dissidents', Icon: Megaphone },
    { id: 'forced-labor', name: 'Forced Labor', Icon: Link2 },
    { id: 'transnational', name: 'Transnational Repression', Icon: Globe2 },
    { id: 'press-freedom', name: 'Press Freedom', Icon: Newspaper },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-8 text-center">
          <PartyPopper className="w-12 h-12 text-green-400 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-white mb-2">Thank You for Volunteering!</h2>
          <p className="text-slate-300 mb-4">
            Your information has been recorded. We'll be in touch soon with opportunities 
            that match your skills and interests.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 text-left max-w-md mx-auto">
            <h3 className="font-medium text-white mb-2">What Happens Next:</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>✓ Review your application (1-2 days)</li>
              <li>✓ Match you with relevant projects</li>
              <li>✓ Send onboarding materials</li>
              <li>✓ Connect you with team leads</li>
            </ul>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '', email: '', location: '', skills: [],
                availability: '', languages: [], experience: '',
                interests: [], message: '',
              });
            }}
            className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
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
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-700/50">
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
      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4">
        <h3 className="font-medium text-white mb-2"><Flame className="w-4 h-4 inline mr-1 text-yellow-400" /> Current Priority Needs</h3>
        <div className="grid md:grid-cols-3 gap-2">
          <div className="bg-slate-800/50 rounded-lg p-2 text-sm">
            <span className="text-yellow-400 font-medium">Translators</span>
            <p className="text-xs text-slate-400">Uyghur, Tibetan, Cantonese</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-sm">
            <span className="text-yellow-400 font-medium">Researchers</span>
            <p className="text-xs text-slate-400">OSINT, supply chain analysis</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-sm">
            <span className="text-yellow-400 font-medium">Social Media</span>
            <p className="text-xs text-slate-400">Content creation, outreach</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-4"><FileText className="w-4 h-4 inline mr-1" /> Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name (can be pseudonym)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country (optional)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Availability *</label>
              <select
                required
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
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
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-4"><Wrench className="w-4 h-4 inline mr-1" /> Skills (select all that apply)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {skillOptions.map(skill => (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSelection('skills', skill.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  formData.skills.includes(skill.id)
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <skill.Icon className="w-4 h-4" />
                <span>{skill.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-4"><Globe className="w-4 h-4 inline mr-1" /> Languages (select all you speak)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {languageOptions.map(lang => (
              <button
                key={lang.id}
                type="button"
                onClick={() => toggleSelection('languages', lang.id)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  formData.languages.includes(lang.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-4"><Heart className="w-4 h-4 inline mr-1 text-red-400" /> Areas of Interest</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {interestOptions.map(interest => (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleSelection('interests', interest.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  formData.interests.includes(interest.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {interest.Icon ? <interest.Icon className="w-4 h-4" /> : <span>{interest.icon}</span>}
                <span>{interest.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Experience & Message */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-4"><MessageCircle className="w-4 h-4 inline mr-1" /> Tell Us More</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Relevant Experience</label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Tell us about any relevant experience (activism, research, etc.)"
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Why do you want to volunteer?</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="What motivates you to get involved?"
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
          <h3 className="font-medium text-red-400 mb-2"><Lock className="w-4 h-4 inline mr-1" /> Security Notice</h3>
          <p className="text-sm text-slate-300">
            Your information will be handled securely. If you are in a sensitive situation, 
            consider using a pseudonym and secure email. We will never share your information 
            without your consent.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          Submit Volunteer Application
        </button>
      </form>

      {/* Partner Organizations */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <h3 className="font-medium text-white mb-2"><Handshake className="w-4 h-4 inline mr-1" /> Partner Organizations Also Seeking Volunteers</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="https://www.uhrp.org/get-involved/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Uyghur Human Rights Project
          </a>
          <a href="https://www.hongkongwatch.org/volunteer" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Hong Kong Watch
          </a>
          <a href="https://tibetaction.net/get-involved/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Students for a Free Tibet
          </a>
          <a href="https://www.amnesty.org/en/get-involved/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Amnesty International
          </a>
        </div>
      </div>
    </div>
  );
};

export default VolunteerSignup;
