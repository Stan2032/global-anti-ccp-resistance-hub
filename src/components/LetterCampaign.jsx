import React, { useState } from 'react';
import { Mail, PenLine, Send, Clock, Copy, Lightbulb, BookOpen } from 'lucide-react';

const LetterCampaign = () => {
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [customizations, setCustomizations] = useState({
    name: '',
    location: '',
    personalStory: '',
  });

  const campaigns = [
    {
      id: 'jimmy-lai',
      title: 'Free Jimmy Lai',
      target: 'Your Government Representatives',
      urgency: 'critical',
      deadline: 'Ongoing',
      description: 'Demand action to secure the release of Hong Kong media tycoon Jimmy Lai, sentenced to 20 years under the National Security Law.',
      background: 'Jimmy Lai, 78, founder of Apple Daily, has been imprisoned since 2020. On December 15, 2025, he was found guilty of "conspiracy to collude with foreign forces." On February 9, 2026, he was sentenced to 20 years in prison. He is a British citizen.',
      asks: [
        'Publicly condemn the verdict',
        'Impose sanctions on Hong Kong officials responsible',
        'Raise the case in bilateral meetings with China',
        'Support his nomination for the Nobel Peace Prize',
      ],
      letterTemplate: `Dear [Representative],

I am writing to urge you to take immediate action regarding the unjust imprisonment of Jimmy Lai, the 78-year-old founder of Apple Daily newspaper in Hong Kong.

On December 15, 2025, Mr. Lai was found guilty of "conspiracy to collude with foreign forces" under Hong Kong's National Security Law. On February 9, 2026, he was sentenced to 20 years in prison — the harshest sentence yet under the NSL. This represents a devastating blow to press freedom and demonstrates the complete erosion of Hong Kong's promised autonomy.

Mr. Lai is a [British/American] citizen who has spent his life advocating for democracy and press freedom. His only "crime" was publishing a newspaper that told the truth about the Chinese Communist Party.

I respectfully request that you:
1. Publicly condemn this verdict as a violation of international human rights standards
2. Support targeted sanctions against Hong Kong officials responsible for this prosecution
3. Raise Mr. Lai's case in all bilateral engagements with Chinese officials
4. Support his nomination for the Nobel Peace Prize

The world is watching how democratic nations respond to this injustice. Silence will only embolden further repression.

Thank you for your attention to this urgent matter.

Sincerely,
[Your Name]
[Your Location]`,
    },
    {
      id: 'uyghur-forced-labor',
      title: 'End Uyghur Forced Labor',
      target: 'Corporate Executives',
      urgency: 'high',
      deadline: 'Ongoing',
      description: 'Demand companies audit their supply chains and eliminate Uyghur forced labor.',
      background: 'Over 1 million Uyghurs are estimated to be in forced labor programs. Major brands continue to source from Xinjiang or suppliers linked to forced labor despite the Uyghur Forced Labor Prevention Act.',
      asks: [
        'Conduct independent supply chain audits',
        'Publish supplier lists for transparency',
        'Exit suppliers linked to forced labor',
        'Support industry-wide standards',
      ],
      letterTemplate: `Dear [CEO/Company],

I am writing as a concerned [customer/shareholder/citizen] regarding your company's supply chain and its potential links to Uyghur forced labor in China.

Credible reports from organizations including the Australian Strategic Policy Institute, the Coalition to End Forced Labour in the Uyghur Region, and investigative journalists have documented how major brands are connected to forced labor in Xinjiang through their supply chains.

The Uyghur Forced Labor Prevention Act (UFLPA) creates a rebuttable presumption that goods from Xinjiang are made with forced labor. Beyond legal compliance, there is a moral imperative to ensure your products are not tainted by human rights abuses.

I urge your company to:
1. Conduct independent, third-party audits of your entire supply chain
2. Publish a complete list of your suppliers for public transparency
3. Immediately exit any suppliers with links to Xinjiang or forced labor programs
4. Support industry-wide standards for supply chain transparency

Consumers increasingly make purchasing decisions based on ethical considerations. I look forward to your response and concrete actions.

Sincerely,
[Your Name]`,
    },
    {
      id: 'overseas-police',
      title: 'Investigate CCP Police Stations',
      target: 'Law Enforcement & Government',
      urgency: 'high',
      deadline: 'Ongoing',
      description: 'Demand investigation and closure of illegal CCP overseas police stations operating in your country.',
      background: 'Safeguard Defenders has documented over 100 CCP overseas police stations in 53 countries. These stations are used to monitor, harass, and coerce Chinese nationals abroad to return to China.',
      asks: [
        'Launch formal investigation into identified stations',
        'Prosecute any illegal activities',
        'Strengthen laws against foreign interference',
        'Protect diaspora communities from harassment',
      ],
      letterTemplate: `Dear [Official],

I am writing to urge immediate action regarding the presence of illegal Chinese Communist Party (CCP) overseas police stations operating in [Country].

According to research by Safeguard Defenders, over 100 such stations have been identified in 53 countries, including [number] in [Country]. These stations operate outside legal frameworks and are used to:
- Monitor and surveil Chinese nationals abroad
- Harass and intimidate diaspora communities
- Coerce individuals to return to China through threats to family members
- Conduct "persuasion" operations that violate sovereignty

This represents a serious violation of [Country]'s sovereignty and a threat to the safety of residents, including citizens of Chinese descent who fled persecution.

I urge you to:
1. Launch a formal investigation into all identified stations
2. Prosecute any individuals engaged in illegal activities
3. Strengthen laws against foreign interference and transnational repression
4. Provide resources to protect diaspora communities from harassment

The safety of all residents must be protected regardless of their country of origin.

Sincerely,
[Your Name]
[Your Location]`,
    },
    {
      id: 'hk47',
      title: 'Support Hong Kong 47',
      target: 'Government Representatives',
      urgency: 'high',
      deadline: 'Ongoing',
      description: 'Demand action to support the 45 pro-democracy activists convicted in Hong Kong\'s largest National Security Law case.',
      background: 'The Hong Kong 47 were charged with "conspiracy to commit subversion" for organizing or participating in unofficial primary elections in 2020. 45 were convicted with sentences ranging from 4 to 10 years.',
      asks: [
        'Condemn the convictions as politically motivated',
        'Offer asylum to Hong Kong activists',
        'Impose sanctions on prosecutors and judges',
        'Support international monitoring of Hong Kong courts',
      ],
      letterTemplate: `Dear [Representative],

I am writing regarding the Hong Kong 47 case, the largest prosecution under Hong Kong's National Security Law, which has resulted in the conviction of 45 pro-democracy activists.

These individuals—including former legislators, lawyers, journalists, and activists—were convicted of "conspiracy to commit subversion" for organizing or participating in unofficial primary elections in 2020. Their sentences range from 4 to 10 years in prison.

Organizing primary elections is a normal democratic activity in free societies. These convictions demonstrate that Hong Kong's legal system has been weaponized to eliminate political opposition.

I urge you to:
1. Publicly condemn these convictions as politically motivated
2. Offer asylum pathways to Hong Kong activists and their families
3. Support targeted sanctions against prosecutors and judges involved
4. Advocate for international monitoring of Hong Kong's courts

The systematic dismantling of Hong Kong's freedoms demands a strong international response.

Sincerely,
[Your Name]
[Your Location]`,
    },
  ];

  const copyLetter = (template) => {
    let letter = template;
    if (customizations.name) {
      letter = letter.replace('[Your Name]', customizations.name);
    }
    if (customizations.location) {
      letter = letter.replace('[Your Location]', customizations.location);
    }
    navigator.clipboard.writeText(letter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const urgencyColors = {
    critical: 'bg-red-900/30 border-red-700/50 text-red-400',
    high: 'bg-orange-900/30 border-orange-700/50 text-orange-400',
    medium: 'bg-yellow-900/30 border-yellow-700/50 text-yellow-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-blue-500 p-6">
        <div className="flex items-center mb-4">
          <Mail className="w-8 h-8 mr-3 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Letter Writing Campaigns</h2>
            <p className="text-slate-400">Ready-to-use templates for advocacy</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Writing to representatives and companies is one of the most effective forms of advocacy. 
          Use these templates as a starting point and personalize them for maximum impact.
        </p>
      </div>

      {/* Customization */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-3 flex items-center gap-2"><PenLine className="w-5 h-5" /> Personalize Your Letters</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Your Name</label>
            <input
              aria-label="Your Name"
              type="text"
              value={customizations.name}
              onChange={(e) => setCustomizations({ ...customizations, name: e.target.value })}
              placeholder="Your name"
              className="w-full bg-[#0a0e14] border border-[#1c2a35] px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Your Location</label>
            <input
              aria-label="Your Location"
              type="text"
              value={customizations.location}
              onChange={(e) => setCustomizations({ ...customizations, location: e.target.value })}
              placeholder="City, State/Country"
              className="w-full bg-[#0a0e14] border border-[#1c2a35] px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Your information will be automatically inserted into letter templates when you copy them.
        </p>
      </div>

      {/* Campaigns */}
      <div className="space-y-4">
        {campaigns.map(campaign => (
          <div 
            key={campaign.id}
            className="bg-[#111820]/50 border border-[#1c2a35] overflow-hidden"
          >
            {/* Campaign Header */}
            <div 
              className="p-4 cursor-pointer hover:bg-[#111820]/70 transition-colors"
              onClick={() => setActiveCampaign(activeCampaign === campaign.id ? null : campaign.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-white">{campaign.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded border ${urgencyColors[campaign.urgency]}`}>
                      {campaign.urgency}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{campaign.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Send className="w-3 h-3" /> Target: {campaign.target}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {campaign.deadline}</span>
                  </div>
                </div>
                <span className="text-slate-400 text-xl">
                  {activeCampaign === campaign.id ? '−' : '+'}
                </span>
              </div>
            </div>

            {/* Expanded Content */}
            {activeCampaign === campaign.id && (
              <div className="px-4 pb-4 border-t border-[#1c2a35] pt-4">
                {/* Background */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-1">Background</h4>
                  <p className="text-sm text-slate-400">{campaign.background}</p>
                </div>

                {/* Key Asks */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-1">Key Asks</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    {campaign.asks.map((ask, idx) => (
                      <li key={idx}>• {ask}</li>
                    ))}
                  </ul>
                </div>

                {/* Letter Template */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">Letter Template</h4>
                    <button
                      onClick={() => copyLetter(campaign.letterTemplate)}
                      className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      {copiedLetter ? '✓ Copied!' : <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy Letter</span>}
                    </button>
                  </div>
                  <pre className="bg-[#0a0e14] p-4 text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
                    {campaign.letterTemplate}
                  </pre>
                </div>

                {/* Tips */}
                <div className="bg-yellow-900/20 border border-yellow-700/50 p-3">
                  <h4 className="text-sm font-medium text-white mb-1 flex items-center gap-1"><Lightbulb className="w-4 h-4" /> Tips for Effectiveness</h4>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• Personalize the letter with your own words and experiences</li>
                    <li>• Be respectful but firm in your requests</li>
                    <li>• Follow up if you don't receive a response within 2 weeks</li>
                    <li>• Share on social media that you've written (without the full text)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resources */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Find Your Representatives</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            🇺🇸 US House Representatives
          </a>
          <a href="https://www.senate.gov/senators/senators-contact.htm" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            🇺🇸 US Senators
          </a>
          <a href="https://members.parliament.uk/members/Commons" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            🇬🇧 UK Members of Parliament
          </a>
          <a href="https://www.ourcommons.ca/members/en" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            🇨🇦 Canadian MPs
          </a>
        </div>
      </div>
    </div>
  );
};

export default LetterCampaign;
