import React, { useState } from 'react';
import { Target, TrendingUp, Users, Calendar, CheckCircle, Clock, AlertTriangle, ChevronRight, ExternalLink, Share2 } from 'lucide-react';

const campaigns = [
  {
    id: 1,
    name: 'Free Jimmy Lai',
    slug: 'free-jimmy-lai',
    status: 'active',
    priority: 'critical',
    category: 'Political Prisoner',
    description: 'Campaign for the release of media mogul Jimmy Lai, convicted under Hong Kong\'s National Security Law',
    goal: 'Secure release of Jimmy Lai',
    startDate: '2020-08-10',
    targetDate: '2025-12-31',
    milestones: [
      { name: 'International awareness', completed: true, date: '2020-08' },
      { name: 'UK government intervention', completed: true, date: '2021-01' },
      { name: 'UN Human Rights Council statement', completed: true, date: '2022-03' },
      { name: 'Magnitsky sanctions on prosecutors', completed: false, date: null },
      { name: 'Release from detention', completed: false, date: null },
    ],
    metrics: {
      petitionSignatures: 250000,
      petitionGoal: 500000,
      countriesInvolved: 28,
      mediaArticles: 1500,
      governmentStatements: 45,
    },
    recentUpdates: [
      { date: '2026-02-09', text: 'Jimmy Lai sentenced to 20 years in prison' },
      { date: '2025-12-15', text: 'Jimmy Lai found guilty on all charges' },
      { date: '2025-12-16', text: 'UK Foreign Secretary condemns verdict' },
    ],
    actions: [
      { name: 'Sign petition', url: 'https://www.change.org/p/free-jimmy-lai', type: 'petition' },
      { name: 'Contact UK Foreign Office', url: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office', type: 'government' },
      { name: 'Share on social media', hashtag: '#FreeJimmyLai', type: 'social' },
    ],
    organizations: ['Hong Kong Watch', 'Committee to Protect Journalists', 'Reporters Without Borders'],
  },
  {
    id: 2,
    name: 'End Uyghur Forced Labor',
    slug: 'end-uyghur-forced-labor',
    status: 'active',
    priority: 'high',
    category: 'Economic Action',
    description: 'Campaign to eliminate Uyghur forced labor from global supply chains',
    goal: 'Full implementation of UFLPA and similar laws worldwide',
    startDate: '2020-01-01',
    targetDate: '2026-12-31',
    milestones: [
      { name: 'UFLPA passed in US', completed: true, date: '2021-12' },
      { name: 'EU due diligence directive', completed: true, date: '2024-04' },
      { name: 'UK Modern Slavery Act strengthened', completed: false, date: null },
      { name: 'Major brands exit Xinjiang', completed: false, date: null },
      { name: 'Full supply chain transparency', completed: false, date: null },
    ],
    metrics: {
      companiesTargeted: 83,
      companiesResponded: 34,
      shipmentsBlocked: 4500,
      legislationPassed: 5,
    },
    recentUpdates: [
      { date: '2024-12-10', text: 'New UFLPA enforcement guidance released' },
      { date: '2024-11-28', text: 'Major retailer commits to supply chain audit' },
    ],
    actions: [
      { name: 'Check product labels', url: null, type: 'personal' },
      { name: 'Report violations to CBP', url: 'https://www.cbp.gov/trade/forced-labor', type: 'government' },
      { name: 'Support ethical brands', url: null, type: 'economic' },
    ],
    organizations: ['Coalition to End Forced Labour in the Uyghur Region', 'Worker Rights Consortium'],
  },
  {
    id: 3,
    name: 'Close Overseas Police Stations',
    slug: 'close-police-stations',
    status: 'active',
    priority: 'high',
    category: 'Transnational Repression',
    description: 'Campaign to shut down CCP overseas police stations operating illegally in democratic countries',
    goal: 'Close all 102+ identified police stations',
    startDate: '2022-09-01',
    targetDate: '2025-12-31',
    milestones: [
      { name: 'Safeguard Defenders report published', completed: true, date: '2022-09' },
      { name: 'Netherlands closes stations', completed: true, date: '2023-10' },
      { name: 'Canada investigates', completed: true, date: '2023-03' },
      { name: 'US arrests made', completed: true, date: '2023-04' },
      { name: 'All stations closed globally', completed: false, date: null },
    ],
    metrics: {
      stationsIdentified: 102,
      stationsClosed: 23,
      countriesInvestigating: 15,
      arrestsMade: 8,
    },
    recentUpdates: [
      { date: '2024-12-05', text: 'New station identified in South America' },
      { date: '2024-11-20', text: 'Ireland opens investigation' },
    ],
    actions: [
      { name: 'Report suspicious activity', url: null, type: 'report' },
      { name: 'Contact local law enforcement', url: null, type: 'government' },
      { name: 'Support Safeguard Defenders', url: 'https://safeguarddefenders.com/', type: 'donate' },
    ],
    organizations: ['Safeguard Defenders', 'FBI', 'RCMP'],
  },
  {
    id: 4,
    name: 'Support Hong Kong 47',
    slug: 'hong-kong-47',
    status: 'active',
    priority: 'critical',
    category: 'Political Prisoner',
    description: 'Campaign for the release of 47 pro-democracy activists convicted under NSL',
    goal: 'Release all Hong Kong 47 defendants',
    startDate: '2021-01-06',
    targetDate: '2027-12-31',
    milestones: [
      { name: 'International attention secured', completed: true, date: '2021-03' },
      { name: 'Trial begins', completed: true, date: '2023-02' },
      { name: 'Verdicts delivered', completed: true, date: '2024-05' },
      { name: 'Sentences handed down', completed: true, date: '2024-11' },
      { name: 'Appeals filed', completed: false, date: null },
    ],
    metrics: {
      defendantsTotal: 47,
      convicted: 45,
      acquitted: 2,
      averageSentence: '5.5 years',
      longestSentence: '10 years',
    },
    recentUpdates: [
      { date: '2024-11-19', text: 'All 45 defendants sentenced' },
      { date: '2024-11-20', text: 'International condemnation follows' },
    ],
    actions: [
      { name: 'Write to prisoners', url: 'https://wallsandbridge.hk/', type: 'personal' },
      { name: 'Adopt a political prisoner', url: null, type: 'personal' },
      { name: 'Contact your government', url: null, type: 'government' },
    ],
    organizations: ['Hong Kong Watch', 'HKDC', 'Amnesty International'],
  },
  {
    id: 5,
    name: 'Recognize Uyghur Genocide',
    slug: 'recognize-genocide',
    status: 'active',
    priority: 'high',
    category: 'Advocacy',
    description: 'Campaign for official genocide recognition by governments worldwide',
    goal: 'Universal recognition of Uyghur genocide',
    startDate: '2020-01-01',
    targetDate: '2026-12-31',
    milestones: [
      { name: 'US declares genocide', completed: true, date: '2021-01' },
      { name: 'UK Parliament motion', completed: true, date: '2021-04' },
      { name: 'Canada declares genocide', completed: true, date: '2021-02' },
      { name: 'EU resolution', completed: true, date: '2022-06' },
      { name: 'UN formal recognition', completed: false, date: null },
    ],
    metrics: {
      countriesRecognized: 12,
      parliamentsVoted: 18,
      unReportsPublished: 1,
    },
    recentUpdates: [
      { date: '2024-10-15', text: 'New country considers recognition' },
    ],
    actions: [
      { name: 'Contact your representative', url: null, type: 'government' },
      { name: 'Support UHRP', url: 'https://uhrp.org/', type: 'donate' },
    ],
    organizations: ['UHRP', 'Campaign for Uyghurs', 'World Uyghur Congress'],
  },
];

const getPriorityColor = (priority) => {
  const colors = {
    critical: 'bg-red-600',
    high: 'bg-orange-600',
    medium: 'bg-yellow-600',
    low: 'bg-green-600',
  };
  return colors[priority] || 'bg-gray-600';
};

const getStatusColor = (status) => {
  const colors = {
    active: 'text-green-400',
    paused: 'text-yellow-400',
    completed: 'text-blue-400',
    urgent: 'text-red-400',
  };
  return colors[status] || 'text-gray-400';
};

const ProgressBar = ({ current, goal, label }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span>
        <span>{current.toLocaleString()} / {goal.toLocaleString()}</span>
      </div>
      <div className="w-full bg-[#111820] rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const MilestoneTimeline = ({ milestones }) => {
  const completedCount = milestones.filter(m => m.completed).length;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        <span>Milestones</span>
        <span>{completedCount}/{milestones.length} completed</span>
      </div>
      {milestones.map((milestone, index) => (
        <div key={index} className="flex items-center gap-2">
          {milestone.completed ? (
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          ) : (
            <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
          )}
          <span className={`text-sm ${milestone.completed ? 'text-slate-300' : 'text-slate-500'}`}>
            {milestone.name}
          </span>
          {milestone.date && (
            <span className="text-xs text-slate-500 ml-auto">{milestone.date}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default function CampaignProgress() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredCampaigns = campaigns.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'critical') return c.priority === 'critical';
    return c.category.toLowerCase().includes(filter.toLowerCase());
  });

  const totalMilestones = campaigns.reduce((acc, c) => acc + c.milestones.length, 0);
  const completedMilestones = campaigns.reduce((acc, c) => acc + c.milestones.filter(m => m.completed).length, 0);

  return (
    <div className="bg-[#111820]/50 border border-[#1c2a35]">
      {/* Header */}
      <div className="p-6 border-b border-[#1c2a35]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Campaign Progress Tracker</h2>
            <p className="text-sm text-slate-400">Monitor ongoing advocacy campaigns</p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-[#0a0e14]/50 p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{campaigns.length}</p>
            <p className="text-xs text-slate-500">Active Campaigns</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{completedMilestones}</p>
            <p className="text-xs text-slate-500">Milestones Achieved</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3 text-center">
            <p className="text-2xl font-bold text-orange-400">{Math.round((completedMilestones / totalMilestones) * 100)}%</p>
            <p className="text-xs text-slate-500">Overall Progress</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3 text-center">
            <p className="text-2xl font-bold text-purple-400">{campaigns.filter(c => c.priority === 'critical').length}</p>
            <p className="text-xs text-slate-500">Critical Priority</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-[#1c2a35] flex flex-wrap gap-2">
        {['all', 'critical', 'Political Prisoner', 'Economic Action', 'Advocacy'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {f === 'all' ? 'All Campaigns' : f}
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredCampaigns.map(campaign => (
            <div
              key={campaign.id}
              className="bg-[#0a0e14]/50 border border-[#1c2a35] overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getPriorityColor(campaign.priority)}`}>
                      {campaign.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">{campaign.category}</span>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    ● {campaign.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{campaign.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{campaign.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Campaign Progress</span>
                    <span>{campaign.milestones.filter(m => m.completed).length}/{campaign.milestones.length} milestones</span>
                  </div>
                  <div className="w-full bg-[#111820] rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(campaign.milestones.filter(m => m.completed).length / campaign.milestones.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {Object.entries(campaign.metrics).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="bg-[#111820] rounded p-2 text-center">
                      <p className="text-sm font-bold text-white">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </p>
                      <p className="text-xs text-slate-500">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recent Update */}
                {campaign.recentUpdates[0] && (
                  <div className="bg-[#111820] rounded p-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <Calendar className="w-3 h-3" />
                      {campaign.recentUpdates[0].date}
                    </div>
                    <p className="text-sm text-slate-300">{campaign.recentUpdates[0].text}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {campaign.actions.slice(0, 3).map((action, i) => (
                    <a
                      key={i}
                      href={action.url || '#'}
                      target={action.url ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#111820] hover:bg-[#1c2a35] text-sm text-slate-300 transition-colors"
                    >
                      {action.name}
                      {action.url && <ExternalLink className="w-3 h-3" />}
                    </a>
                  ))}
                  <button
                    onClick={() => setSelectedCampaign(selectedCampaign === campaign.id ? null : campaign.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-sm text-white transition-colors"
                  >
                    {selectedCampaign === campaign.id ? 'Hide Details' : 'View Details'}
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedCampaign === campaign.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Expanded Details */}
                {selectedCampaign === campaign.id && (
                  <div className="mt-4 pt-4 border-t border-[#1c2a35]">
                    <div className="grid md:grid-cols-2 gap-6">
                      <MilestoneTimeline milestones={campaign.milestones} />
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Recent Updates</h4>
                        <div className="space-y-2">
                          {campaign.recentUpdates.map((update, i) => (
                            <div key={i} className="flex gap-2 text-sm">
                              <span className="text-slate-500 flex-shrink-0">{update.date}</span>
                              <span className="text-slate-300">{update.text}</span>
                            </div>
                          ))}
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-4 mb-2">Partner Organizations</h4>
                        <div className="flex flex-wrap gap-2">
                          {campaign.organizations.map((org, i) => (
                            <span key={i} className="px-2 py-1 bg-[#111820] rounded text-xs text-slate-300">
                              {org}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-6 border-t border-[#1c2a35] bg-[#0a0e14]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Want to start a new campaign?</h3>
            <p className="text-sm text-slate-400">Contact partner organizations to coordinate efforts</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white transition-colors">
            <Share2 className="w-4 h-4" />
            Share Progress
          </button>
        </div>
      </div>
    </div>
  );
}
