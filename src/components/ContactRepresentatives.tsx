/**
 * ContactRepresentatives — Directory of elected representatives and
 * advocacy targets. Helps users contact their MPs, senators, and MEPs
 * about CCP human rights issues.
 *
 * @module ContactRepresentatives
 */
import { useState } from 'react';
import { Building } from 'lucide-react';
import { DisclosureSection } from './DisclosureSection';
import { LETTER_TEMPLATES, LETTER_TOPICS } from '../data/letterTemplates';
import { logger } from '../utils/logger';

const ContactRepresentatives = () => {
  const [copiedTopic, setCopiedTopic] = useState<string | null>(null);

  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'eu', name: 'European Union', flag: '🇪🇺' },
  ];


  const contactLinks = {
    us: {
      name: 'United States',
      links: [
        { name: 'Find Your Representative', url: 'https://www.house.gov/representatives/find-your-representative' },
        { name: 'Find Your Senators', url: 'https://www.senate.gov/senators/senators-contact.htm' },
        { name: 'CECC (Congressional-Executive Commission on China)', url: 'https://www.cecc.gov/' },
      ]
    },
    uk: {
      name: 'United Kingdom',
      links: [
        { name: 'Find Your MP', url: 'https://members.parliament.uk/FindYourMP' },
        { name: 'Write to Your MP', url: 'https://www.writetothem.com/' },
        { name: 'APPG on Hong Kong', url: 'https://www.hongkongwatch.org/all-party-parliamentary-group' },
      ]
    },
    ca: {
      name: 'Canada',
      links: [
        { name: 'Find Your MP', url: 'https://www.ourcommons.ca/members/en/search' },
        { name: 'Contact Your Senator', url: 'https://sencanada.ca/en/senators/' },
        { name: 'Subcommittee on International Human Rights', url: 'https://www.ourcommons.ca/Committees/en/SDIR' },
      ]
    },
    au: {
      name: 'Australia',
      links: [
        { name: 'Find Your MP', url: 'https://www.aph.gov.au/Senators_and_Members/Members' },
        { name: 'Find Your Senator', url: 'https://www.aph.gov.au/Senators_and_Members/Senators' },
        { name: 'Parliamentary Joint Committee on Intelligence', url: 'https://www.aph.gov.au/Parliamentary_Business/Committees/Joint/Intelligence_and_Security' },
      ]
    },
    eu: {
      name: 'European Union',
      links: [
        { name: 'Find Your MEP', url: 'https://www.europarl.europa.eu/meps/en/home' },
        { name: 'EU Human Rights Subcommittee', url: 'https://www.europarl.europa.eu/committees/en/droi/home/highlights' },
        { name: 'IPAC (Inter-Parliamentary Alliance on China)', url: 'https://ipac.global/' },
      ]
    }
  };

  const templates = LETTER_TEMPLATES;
  const topics = LETTER_TOPICS;
  const links = contactLinks as Record<string, { name: string; links: { name: string; url: string }[] }>;

  const copyTemplate = async (topicId: string) => {
    const template = templates[topicId];
    try {
      await navigator.clipboard.writeText(template.subject + '\n\n' + template.body);
      setCopiedTopic(topicId);
      setTimeout(() => setCopiedTopic(null), 2000);
    } catch (err) {
      logger.warn('clipboard', 'Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#22d3ee] p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Building className="w-6 h-6" /> Contact Your Representatives</h2>
        <p className="text-slate-300">
          Your voice matters. Use these tools and templates to contact your elected officials 
          about CCP human rights abuses.
        </p>
      </div>

      {/* Every country's links at once: five short lists, nothing to click.
          The country tabs they replace showed one country and hid the other
          four from readers without JavaScript. */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Find Your Representatives</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <div key={country.code} className="bg-[#111820] border border-[#1c2a35] p-4">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span aria-hidden="true">{country.flag}</span>
                {country.name}
              </h4>
              <ul className="space-y-1">
                {links[country.code].links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#22d3ee] hover:underline"
                    >
                      {link.name} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* One letter per topic, as native <details>: every template is in the
          page and opens without JavaScript. */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Letter Templates</h3>
        <div className="space-y-3">
          {topics.map((topic) => {
            const template = templates[topic.id];
            return (
              <DisclosureSection key={topic.id} title={topic.name} defaultOpen={topic.id === 'general'}>
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => copyTemplate(topic.id)}
                    aria-label={`Copy the ${topic.name} letter`}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      copiedTopic === topic.id ? 'bg-green-600 text-[#0a0e14]' : 'bg-[#22d3ee] hover:bg-[#22d3ee] text-[#0a0e14]'
                    }`}
                  >
                    {copiedTopic === topic.id ? '✓ Copied!' : 'Copy Letter'}
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-slate-400 mb-1">Subject Line:</p>
                  <div className="bg-[#0a0e14] border border-[#1c2a35] rounded p-3 text-white font-medium">
                    {template.subject}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Letter Body:</p>
                  <div className="bg-[#0a0e14] border border-[#1c2a35] rounded p-4 text-slate-300 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
                    {template.body}
                  </div>
                </div>
              </DisclosureSection>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Tip: Personalize the letter with your own experiences and concerns. Personal letters are more impactful than form letters.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-green-900/20 border border-green-700/50 p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Tips for Effective Advocacy</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            Be respectful and professional in your communication
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            Include your full name and address to show you're a constituent
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            Focus on one or two specific asks
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            Share personal connections to the issue if relevant
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            Follow up with a phone call - calls are often more impactful than emails
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            Thank your representative if they take action
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactRepresentatives;
