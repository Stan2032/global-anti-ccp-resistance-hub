import { useState } from 'react';
import { PenLine, Megaphone } from 'lucide-react';

const PetitionLinks = () => {
  const [expandedPetition, setExpandedPetition] = useState(null);

  const petitions = [
    {
      id: 1,
      title: 'Free Jimmy Lai',
      organization: 'Committee for Freedom in Hong Kong',
      signatures: '150,000+',
      target: '200,000',
      progress: 75,
      urgency: 'CRITICAL',
      url: 'https://www.change.org/p/free-jimmy-lai',
      description: 'Demand the release of Hong Kong media tycoon Jimmy Lai, sentenced to 20 years in prison for exercising press freedom.',
      actions: ['Sign petition', 'Write to your MP/Representative', 'Share on social media']
    },
    {
      id: 2,
      title: 'End Uyghur Forced Labor',
      organization: 'Coalition to End Forced Labour in the Uyghur Region',
      signatures: '500,000+',
      target: '1,000,000',
      progress: 50,
      urgency: 'CRITICAL',
      url: 'https://enduyghurforcedlabour.org/take-action/',
      description: 'Call on brands to exit Xinjiang and stop profiting from Uyghur forced labor.',
      actions: ['Sign petition', 'Check brand complicity', 'Boycott complicit brands']
    },
    {
      id: 3,
      title: 'Sanction CCP Officials',
      organization: 'Hong Kong Watch',
      signatures: '75,000+',
      target: '100,000',
      progress: 75,
      urgency: 'HIGH',
      url: 'https://www.hongkongwatch.org/sanctions',
      description: 'Urge governments to impose Magnitsky sanctions on Hong Kong and CCP officials responsible for human rights abuses.',
      actions: ['Sign petition', 'Contact foreign ministry', 'Support sanctions legislation']
    },
    {
      id: 4,
      title: 'Free Tibet',
      organization: 'International Campaign for Tibet',
      signatures: '200,000+',
      target: '500,000',
      progress: 40,
      urgency: 'HIGH',
      url: 'https://savetibet.org/take-action/',
      description: 'Support Tibetan freedom and the right to self-determination. Demand China end religious persecution.',
      actions: ['Sign petition', 'Support Tibetan businesses', 'Attend local events']
    },
    {
      id: 5,
      title: 'Protect Taiwan',
      organization: 'Taiwan Foundation for Democracy',
      signatures: '100,000+',
      target: '250,000',
      progress: 40,
      urgency: 'HIGH',
      url: 'https://www.tfd.org.tw/',
      description: 'Support Taiwan\'s democracy and sovereignty against CCP threats.',
      actions: ['Sign petition', 'Support Taiwan recognition', 'Buy Taiwanese products']
    },
    {
      id: 6,
      title: 'Close CCP Police Stations',
      organization: 'Safeguard Defenders',
      signatures: '50,000+',
      target: '100,000',
      progress: 50,
      urgency: 'CRITICAL',
      url: 'https://safeguarddefenders.com/',
      description: 'Demand governments investigate and shut down illegal CCP overseas police stations.',
      actions: ['Sign petition', 'Report suspicious activity', 'Contact law enforcement']
    }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <PenLine className="w-5 h-5" /> Active Petitions
        </h2>
        <span className="text-sm text-slate-400">{petitions.length} campaigns</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {petitions.map((petition) => (
          <div
            key={petition.id}
            className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-500 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-white">{petition.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getUrgencyColor(petition.urgency)}`}>
                  {petition.urgency}
                </span>
              </div>
              
              <p className="text-sm text-slate-400 mb-3">{petition.organization}</p>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{petition.signatures} signed</span>
                  <span>Goal: {petition.target}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
                    style={{ width: `${petition.progress}%` }}
                  />
                </div>
              </div>

              {expandedPetition === petition.id && (
                <div className="mb-3 p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-slate-300 mb-2">{petition.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-semibold">Actions you can take:</p>
                    {petition.actions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-green-400">✓</span>
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <a
                  href={petition.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  Sign Now
                </a>
                <button
                  onClick={() => setExpandedPetition(expandedPetition === petition.id ? null : petition.id)}
                  className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  {expandedPetition === petition.id ? '−' : '+'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-700/50 rounded-lg p-4 mt-6">
        <div className="flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-slate-300" />
          <div>
            <h3 className="font-bold text-white">Your Voice Matters</h3>
            <p className="text-sm text-slate-300">
              Every signature helps build pressure on governments and corporations to act against CCP human rights abuses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetitionLinks;
