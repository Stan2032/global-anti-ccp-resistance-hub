import { useState } from 'react';
import { Megaphone, Mountain, Building, Link2, Target, Landmark } from 'lucide-react';

const ContactRepresentatives = () => {
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [copied, setCopied] = useState(false);

  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'eu', name: 'European Union', flag: '🇪🇺' },
  ];

  const topics = [
    { id: 'general', name: 'General Human Rights', Icon: Megaphone },
    { id: 'uyghur', name: 'Uyghur Genocide', Icon: Mountain },
    { id: 'hongkong', name: 'Hong Kong Freedom', Icon: Building },
    { id: 'tibet', name: 'Tibetan Rights', Icon: Mountain },
    { id: 'taiwan', name: 'Taiwan Support', flag: '🇹🇼' },
    { id: 'jimmylai', name: 'Free Jimmy Lai', Icon: Link2 },
    { id: 'sanctions', name: 'Magnitsky Sanctions', Icon: Target },
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

  const letterTemplates = {
    general: {
      subject: 'Urging Action on Human Rights Abuses by the Chinese Communist Party',
      body: `Dear [Representative Name],

I am writing to urge you to take action on the ongoing human rights abuses perpetrated by the Chinese Communist Party (CCP).

The CCP continues to commit serious violations including:
• The detention of over 1 million Uyghurs in concentration camps
• The systematic destruction of Hong Kong's autonomy and freedoms
• The persecution of Tibetans, Falun Gong practitioners, and Christians
• Transnational repression targeting diaspora communities worldwide

I urge you to:
1. Support legislation imposing Magnitsky sanctions on CCP officials responsible for human rights abuses
2. Advocate for the release of political prisoners including Jimmy Lai
3. Ensure supply chains are free from forced labor
4. Speak out publicly against CCP human rights violations

As your constituent, I believe our country must stand firmly for human rights and against authoritarian oppression.

Thank you for your attention to this critical issue.

Sincerely,
[Your Name]
[Your Address]`
    },
    uyghur: {
      subject: 'Urgent Action Needed on Uyghur Genocide',
      body: `Dear [Representative Name],

I am writing to urge immediate action on the genocide being committed against the Uyghur people in the Xinjiang Uyghur Autonomous Region of China.

The evidence is overwhelming:
• Over 1 million Uyghurs detained in concentration camps
• Forced sterilization and birth prevention
• Systematic cultural and religious destruction
• Forced labor in factories supplying global brands
• Separation of families and "re-education" of children

The UN Human Rights Office has documented these abuses as potential crimes against humanity.

I urge you to:
1. Support the Uyghur Forced Labor Prevention Act and its enforcement
2. Impose Magnitsky sanctions on officials responsible for the genocide
3. Ensure no products made with forced labor enter our markets
4. Advocate for independent UN access to Xinjiang
5. Support Uyghur refugees and asylum seekers

We must not be complicit in genocide through silence or inaction.

Sincerely,
[Your Name]
[Your Address]`
    },
    hongkong: {
      subject: 'Support for Hong Kong Democracy and Freedom',
      body: `Dear [Representative Name],

I am writing to urge continued support for the people of Hong Kong who are fighting for their fundamental freedoms.

Since the imposition of the National Security Law in 2020:
• Over 260 people have been arrested under the NSL
• Independent media has been shut down (Apple Daily, Stand News)
• Pro-democracy legislators have been disqualified and imprisoned
• Civil society organizations have been forced to disband
• The "Hong Kong 47" were sentenced to 4-10 years in prison for organizing a primary election

I urge you to:
1. Support sanctions on officials responsible for suppressing Hong Kong's freedoms
2. Provide pathways for Hong Kongers seeking refuge
3. Advocate for the release of political prisoners including Jimmy Lai
4. Ensure our country does not legitimize the erosion of "One Country, Two Systems"

Hong Kong's fight is a fight for democracy everywhere.

Sincerely,
[Your Name]
[Your Address]`
    },
    tibet: {
      subject: 'Support for Tibetan Rights and Self-Determination',
      body: `Dear [Representative Name],

I am writing to urge action on the ongoing oppression of the Tibetan people by the Chinese Communist Party.

For over 70 years, Tibetans have faced:
• Systematic destruction of religious and cultural heritage
• Arbitrary detention of monks, nuns, and activists
• Forced "patriotic education" and Sinicization
• Environmental destruction of the Tibetan Plateau
• Surveillance and restrictions on movement

The Dalai Lama, now 89 years old, remains in exile while the CCP attempts to control his succession.

I urge you to:
1. Support the Tibetan Policy and Support Act
2. Advocate for dialogue between the CCP and Tibetan representatives
3. Oppose CCP interference in the selection of the next Dalai Lama
4. Support Tibetan refugees and cultural preservation efforts

Tibet's struggle for freedom deserves our solidarity.

Sincerely,
[Your Name]
[Your Address]`
    },
    taiwan: {
      subject: "Support for Taiwan's Democracy and Security",
      body: `Dear [Representative Name],

I am writing to urge strong support for Taiwan, a vibrant democracy facing increasing threats from the Chinese Communist Party.

Taiwan faces daily threats including:
• Military incursions into Taiwan's Air Defense Identification Zone
• Economic coercion and diplomatic isolation campaigns
• Disinformation and influence operations
• Explicit threats of military invasion

Taiwan is a beacon of democracy in Asia with:
• Free and fair elections
• A free press and civil society
• Strong human rights protections
• A thriving high-tech economy

I urge you to:
1. Support Taiwan's meaningful participation in international organizations
2. Strengthen security cooperation and deterrence
3. Expand economic and trade ties with Taiwan
4. Clearly communicate the costs of any military aggression

Taiwan's democracy must be defended.

Sincerely,
[Your Name]
[Your Address]`
    },
    jimmylai: {
      subject: 'Urgent: Free Jimmy Lai - Hong Kong Press Freedom Hero',
      body: `Dear [Representative Name],

I am writing to urge immediate action to secure the release of Jimmy Lai, the 78-year-old Hong Kong media entrepreneur and democracy advocate.

Jimmy Lai:
• Founded Apple Daily, Hong Kong's largest pro-democracy newspaper
• Has been imprisoned since December 2020
• Was just convicted on December 15, 2025 under the National Security Law
• Sentenced to 20 years in prison for exercising press freedom
• Is a British citizen being denied consular access

His "crime" was publishing a newspaper that criticized the Chinese Communist Party.

I urge you to:
1. Publicly call for Jimmy Lai's immediate release
2. Impose sanctions on officials responsible for his prosecution
3. Raise his case in all bilateral discussions with China
4. Support his family's advocacy efforts

Jimmy Lai's imprisonment is an attack on press freedom worldwide.

Sincerely,
[Your Name]
[Your Address]`
    },
    sanctions: {
      subject: 'Support Magnitsky Sanctions on CCP Human Rights Abusers',
      body: `Dear [Representative Name],

I am writing to urge the use of Magnitsky sanctions against Chinese Communist Party officials responsible for human rights abuses.

Officials who should face sanctions include those responsible for:
• The Uyghur genocide and forced labor system
• The destruction of Hong Kong's autonomy
• Transnational repression operations (overseas police stations)
• The persecution of political prisoners
• Religious persecution of Tibetans, Christians, and Falun Gong

Magnitsky sanctions are an effective tool because they:
• Target individual perpetrators, not the Chinese people
• Freeze assets and ban travel to democratic countries
• Send a clear message that human rights abusers will face consequences
• Create a deterrent for future abuses

I urge you to:
1. Support expanded use of Global Magnitsky sanctions
2. Advocate for coordinated sanctions with allies
3. Ensure robust enforcement of existing sanctions
4. Publicly name officials responsible for abuses

Accountability is essential to defending human rights.

Sincerely,
[Your Name]
[Your Address]`
    }
  };

  const currentTemplate = letterTemplates[selectedTopic];
  const currentLinks = contactLinks[selectedCountry];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Landmark className="w-6 h-6" /> Contact Your Representatives</h2>
        <p className="text-slate-300">
          Your voice matters. Use these tools and templates to contact your elected officials 
          about CCP human rights abuses.
        </p>
      </div>

      {/* Country Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Select Your Country</h3>
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => setSelectedCountry(country.code)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCountry === country.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{country.flag}</span>
              {country.name}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Links */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">
          Find Your Representatives ({currentLinks.name})
        </h3>
        <div className="grid gap-2 md:grid-cols-3">
          {currentLinks.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between"
            >
              {link.name}
              <span>→</span>
            </a>
          ))}
        </div>
      </div>

      {/* Topic Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Select a Topic</h3>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedTopic === topic.id
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {topic.Icon ? <topic.Icon className="w-4 h-4" /> : <span>{topic.flag}</span>}
              {topic.name}
            </button>
          ))}
        </div>
      </div>

      {/* Letter Template */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Letter Template</h3>
          <button
            onClick={() => copyToClipboard(currentTemplate.subject + '\n\n' + currentTemplate.body)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              copied ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy Letter'}
          </button>
        </div>
        
        <div className="mb-4">
          <label className="text-sm text-slate-400 mb-1 block">Subject Line:</label>
          <div className="bg-slate-900 border border-slate-600 rounded p-3 text-white font-medium">
            {currentTemplate.subject}
          </div>
        </div>
        
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Letter Body:</label>
          <div className="bg-slate-900 border border-slate-600 rounded p-4 text-slate-300 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
            {currentTemplate.body}
          </div>
        </div>
        
        <p className="text-xs text-slate-500 mt-3">
          Tip: Personalize this letter with your own experiences and concerns. Personal letters are more impactful than form letters.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
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
