import React, { useState } from 'react';
import { Scale, Search, ExternalLink, AlertTriangle, CheckCircle, FileText, Phone, Mail } from 'lucide-react';

const LegalResourcesHub = () => {
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const legalResources = [
    // United States
    {
      country: 'United States',
      region: 'North America',
      topics: ['Asylum', 'Immigration', 'Transnational Repression'],
      resources: [
        {
          title: 'Asylum Application Guide for Chinese Dissidents',
          type: 'Guide',
          topic: 'Asylum',
          description: 'Comprehensive guide on applying for political asylum in the US. Includes eligibility criteria, documentation requirements, and process timeline.',
          organization: 'Human Rights First',
          url: 'https://www.humanrightsfirst.org/resource/asylum-seekers',
          lastUpdated: '2024-11',
          language: 'English, Chinese'
        },
        {
          title: 'Reporting CCP Transnational Repression to FBI',
          type: 'Guide',
          topic: 'Transnational Repression',
          description: 'How to report harassment, intimidation, or threats from CCP agents to US authorities. Includes FBI contact information and what evidence to gather.',
          organization: 'FBI',
          url: 'https://www.fbi.gov/investigate/counterintelligence/transnational-repression',
          lastUpdated: '2024-10',
          language: 'English'
        },
        {
          title: 'Pro Bono Legal Services Directory',
          type: 'Directory',
          topic: 'Immigration',
          description: 'List of organizations providing free legal assistance to asylum seekers and immigrants from China.',
          organization: 'American Immigration Lawyers Association',
          url: 'https://www.ailalawyer.com',
          lastUpdated: '2024-12',
          language: 'English, Spanish, Chinese'
        },
        {
          title: 'Uyghur Forced Labor Prevention Act Guidance',
          type: 'Legal Document',
          topic: 'Immigration',
          description: 'Information on how UFLPA affects immigration cases and asylum applications for Uyghurs.',
          organization: 'US Customs and Border Protection',
          url: 'https://www.cbp.gov/trade/forced-labor/UFLPA',
          lastUpdated: '2024-09',
          language: 'English'
        }
      ],
      emergencyContacts: [
        {
          name: 'FBI Transnational Repression Hotline',
          phone: '1-800-CALL-FBI',
          email: 'tips.fbi.gov',
          description: 'Report CCP harassment or intimidation'
        },
        {
          name: 'Human Rights First Legal Hotline',
          phone: '(202) 547-5692',
          email: 'asylum@humanrightsfirst.org',
          description: 'Free legal consultation for asylum seekers'
        }
      ]
    },

    // Canada
    {
      country: 'Canada',
      region: 'North America',
      topics: ['Asylum', 'Immigration', 'Transnational Repression'],
      resources: [
        {
          title: 'Refugee Claim Process in Canada',
          type: 'Guide',
          topic: 'Asylum',
          description: 'Step-by-step guide to making a refugee claim in Canada, including eligibility and documentation.',
          organization: 'Immigration, Refugees and Citizenship Canada',
          url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees.html',
          lastUpdated: '2024-11',
          language: 'English, French, Chinese'
        },
        {
          title: 'Reporting Foreign Interference to RCMP',
          type: 'Guide',
          topic: 'Transnational Repression',
          description: 'How to report CCP interference and harassment to Royal Canadian Mounted Police.',
          organization: 'RCMP',
          url: 'https://www.rcmp-grc.gc.ca/en/foreign-interference',
          lastUpdated: '2024-10',
          language: 'English, French'
        },
        {
          title: 'Legal Aid for Refugees',
          type: 'Directory',
          topic: 'Immigration',
          description: 'Province-by-province directory of free legal aid services for refugees and asylum seekers.',
          organization: 'Canadian Council for Refugees',
          url: 'https://ccrweb.ca/en/legal-aid',
          lastUpdated: '2024-12',
          language: 'English, French'
        }
      ],
      emergencyContacts: [
        {
          name: 'RCMP National Security Hotline',
          phone: '1-800-420-5805',
          email: 'nsii-insi@rcmp-grc.gc.ca',
          description: 'Report foreign interference'
        }
      ]
    },

    // United Kingdom
    {
      country: 'United Kingdom',
      region: 'Europe',
      topics: ['Asylum', 'Immigration', 'Transnational Repression', 'BN(O) Visa'],
      resources: [
        {
          title: 'BN(O) Visa Route for Hong Kongers',
          type: 'Guide',
          topic: 'BN(O) Visa',
          description: 'Complete guide to British National (Overseas) visa pathway for Hong Kong residents. Includes eligibility, application process, and settlement rights.',
          organization: 'UK Home Office',
          url: 'https://www.gov.uk/british-national-overseas-bno-visa',
          lastUpdated: '2024-12',
          language: 'English, Chinese'
        },
        {
          title: 'Asylum Application Process',
          type: 'Guide',
          topic: 'Asylum',
          description: 'How to apply for asylum in the UK, including screening interview and substantive interview preparation.',
          organization: 'Refugee Council',
          url: 'https://www.refugeecouncil.org.uk/information/refugee-asylum-facts/the-truth-about-asylum/',
          lastUpdated: '2024-11',
          language: 'English, Multiple'
        },
        {
          title: 'Reporting CCP Harassment to Police',
          type: 'Guide',
          topic: 'Transnational Repression',
          description: 'How to report intimidation from CCP agents to UK police and MI5.',
          organization: 'Metropolitan Police',
          url: 'https://www.met.police.uk/advice/advice-and-information/h-harm/hate-crime/',
          lastUpdated: '2024-10',
          language: 'English'
        },
        {
          title: 'Free Immigration Legal Advice',
          type: 'Directory',
          topic: 'Immigration',
          description: 'Directory of organizations providing free immigration legal advice in the UK.',
          organization: 'Immigration Advice Service',
          url: 'https://iasservices.org.uk',
          lastUpdated: '2024-12',
          language: 'English'
        }
      ],
      emergencyContacts: [
        {
          name: 'MI5 Reporting Line',
          phone: '0800 111 4645',
          email: 'https://www.mi5.gov.uk/contact-us',
          description: 'Report foreign interference'
        },
        {
          name: 'Hong Kong Watch Legal Support',
          phone: '+44 20 7193 7073',
          email: 'info@hongkongwatch.org',
          description: 'Legal support for Hong Kongers'
        }
      ]
    },

    // Australia
    {
      country: 'Australia',
      region: 'Asia-Pacific',
      topics: ['Asylum', 'Immigration', 'Transnational Repression', 'Protection Visa'],
      resources: [
        {
          title: 'Protection Visa Application Guide',
          type: 'Guide',
          topic: 'Protection Visa',
          description: 'Guide to applying for protection visa (refugee status) in Australia.',
          organization: 'Department of Home Affairs',
          url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/protection-866',
          lastUpdated: '2024-11',
          language: 'English, Chinese'
        },
        {
          title: 'Reporting Foreign Interference to ASIO',
          type: 'Guide',
          topic: 'Transnational Repression',
          description: 'How to report CCP harassment and intimidation to Australian Security Intelligence Organisation.',
          organization: 'ASIO',
          url: 'https://www.asio.gov.au/report-suspicious-activity.html',
          lastUpdated: '2024-10',
          language: 'English'
        },
        {
          title: 'Refugee Legal Services Directory',
          type: 'Directory',
          topic: 'Immigration',
          description: 'State-by-state directory of free legal services for refugees and asylum seekers.',
          organization: 'Refugee Council of Australia',
          url: 'https://www.refugeecouncil.org.au/get-help/',
          lastUpdated: '2024-12',
          language: 'English'
        }
      ],
      emergencyContacts: [
        {
          name: 'ASIO Hotline',
          phone: '1800 123 400',
          email: 'https://www.asio.gov.au/contact-us',
          description: 'Report foreign interference'
        }
      ]
    },

    // Germany
    {
      country: 'Germany',
      region: 'Europe',
      topics: ['Asylum', 'Immigration'],
      resources: [
        {
          title: 'Asylum Application in Germany',
          type: 'Guide',
          topic: 'Asylum',
          description: 'Complete guide to asylum process in Germany, including BAMF interview preparation.',
          organization: 'Pro Asyl',
          url: 'https://www.proasyl.de/en/',
          lastUpdated: '2024-11',
          language: 'German, English, Chinese'
        },
        {
          title: 'Free Legal Counseling for Refugees',
          type: 'Directory',
          topic: 'Immigration',
          description: 'Directory of organizations providing free legal advice to refugees in Germany.',
          organization: 'Refugee Law Clinics Germany',
          url: 'https://www.rlc-deutschland.de',
          lastUpdated: '2024-12',
          language: 'German, English'
        }
      ],
      emergencyContacts: [
        {
          name: 'Pro Asyl Hotline',
          phone: '+49 69 24 23 14 20',
          email: 'proasyl@proasyl.de',
          description: 'Refugee legal support'
        }
      ]
    },

    // International
    {
      country: 'International',
      region: 'Global',
      topics: ['Asylum', 'Transnational Repression', 'Human Rights'],
      resources: [
        {
          title: 'UNHCR Refugee Status Determination',
          type: 'Guide',
          topic: 'Asylum',
          description: 'International guide to refugee status determination under UNHCR mandate.',
          organization: 'UNHCR',
          url: 'https://www.unhcr.org/refugee-status-determination.html',
          lastUpdated: '2024-11',
          language: 'Multiple'
        },
        {
          title: 'Reporting Transnational Repression',
          type: 'Guide',
          topic: 'Transnational Repression',
          description: 'International guide on documenting and reporting CCP transnational repression to authorities and human rights organizations.',
          organization: 'Freedom House',
          url: 'https://freedomhouse.org/report/transnational-repression',
          lastUpdated: '2024-10',
          language: 'English'
        },
        {
          title: 'International Human Rights Law Resources',
          type: 'Legal Document',
          topic: 'Human Rights',
          description: 'Collection of international human rights law documents relevant to CCP abuses.',
          organization: 'Office of the High Commissioner for Human Rights',
          url: 'https://www.ohchr.org/en/instruments-and-mechanisms',
          lastUpdated: '2024-09',
          language: 'Multiple'
        }
      ],
      emergencyContacts: [
        {
          name: 'UNHCR Emergency Hotline',
          phone: '+41 22 739 8111',
          email: 'hqpr@unhcr.org',
          description: 'International refugee support'
        }
      ]
    }
  ];

  const countries = ['all', ...new Set(legalResources.map(r => r.country))];
  const topics = ['all', 'Asylum', 'Immigration', 'Transnational Repression', 'BN(O) Visa', 'Protection Visa', 'Human Rights'];

  const filteredResources = legalResources.filter(countryResource => {
    const matchesCountry = selectedCountry === 'all' || countryResource.country === selectedCountry;
    const matchesTopic = selectedTopic === 'all' || countryResource.topics.includes(selectedTopic);
    const matchesSearch = searchTerm === '' ||
      countryResource.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      countryResource.resources.some(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCountry && matchesTopic && matchesSearch;
  });

  const getTypeColor = (type) => {
    const colors = {
      'Guide': 'text-[#22d3ee] bg-[#22d3ee]/10 border-[#1c2a35]',
      'Directory': 'text-green-400 bg-green-500/10 border-green-500/30',
      'Legal Document': 'text-[#22d3ee] bg-[#22d3ee]/10 border-[#1c2a35]'
    };
    return colors[type] || 'text-slate-400 bg-[#1c2a35]/20 border-[#1c2a35]/50';
  };

  return (
    <div className="bg-[#111820]/50 backdrop-blur-sm border border-[#1c2a35]/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Scale className="w-8 h-8 text-[#22d3ee]" />
        <div>
          <h2 className="text-2xl font-bold text-white">Legal Resources Hub</h2>
          <p className="text-slate-400 text-sm">Country-specific legal information for asylum, immigration, and protection</p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-400 font-bold mb-2">Important Legal Disclaimer</h3>
            <p className="text-slate-300 text-sm mb-2">
              This information is for general guidance only and does not constitute legal advice. Immigration and asylum laws are complex and change frequently. 
              Always consult with a qualified immigration lawyer for your specific situation.
            </p>
            <p className="text-slate-300 text-sm">
              <strong>If you are in immediate danger,</strong> contact local police and emergency services first.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search by country, topic, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0a0e14]/50 border border-[#1c2a35]/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/50"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Country/Region</label>
            <div className="flex flex-wrap gap-2">
              {countries.slice(0, 7).map(country => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedCountry === country
                      ? 'bg-[#22d3ee] text-[#0a0e14]'
                      : 'bg-[#0a0e14]/50 text-slate-400 hover:bg-[#0a0e14] hover:text-white border border-[#1c2a35]/50'
                  }`}
                >
                  {country === 'all' ? 'All Countries' : country}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Legal Topic</label>
            <div className="flex flex-wrap gap-2">
              {topics.slice(0, 5).map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedTopic === topic
                      ? 'bg-[#22d3ee] text-[#0a0e14]'
                      : 'bg-[#0a0e14]/50 text-slate-400 hover:bg-[#0a0e14] hover:text-white border border-[#1c2a35]/50'
                  }`}
                >
                  {topic === 'all' ? 'All Topics' : topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-[#22d3ee] mb-1">{legalResources.length}</div>
          <div className="text-sm text-slate-400">Countries</div>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-[#22d3ee] mb-1">{legalResources.reduce((acc, c) => acc + c.resources.length, 0)}</div>
          <div className="text-sm text-slate-400">Resources</div>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-green-400 mb-1">{legalResources.reduce((acc, c) => acc + c.emergencyContacts.length, 0)}</div>
          <div className="text-sm text-slate-400">Emergency Contacts</div>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-[#22d3ee] mb-1">{topics.length - 1}</div>
          <div className="text-sm text-slate-400">Topics</div>
        </div>
      </div>

      {/* Country Resources */}
      <div className="space-y-6">
        {filteredResources.map((countryResource, index) => (
          <div key={index} className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl font-bold text-white">{countryResource.country}</h3>
              <span className="px-3 py-1 bg-[#111820] border border-[#1c2a35] rounded-full text-xs text-slate-300">
                {countryResource.region}
              </span>
            </div>

            {/* Resources */}
            <div className="space-y-3 mb-4">
              {countryResource.resources.map((resource, rIndex) => (
                <div key={rIndex} className="bg-[#111820]/50 p-4 border border-[#1c2a35]/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold text-white">{resource.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(resource.type)}`}>
                          {resource.type}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium border text-slate-400 bg-[#111820] border-[#1c2a35]">
                          {resource.topic}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium border text-slate-400 bg-[#111820] border-[#1c2a35]">
                          {resource.language}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-3">{resource.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1c2a35]/50">
                    <div className="text-xs text-slate-500">
                      <span className="font-medium">{resource.organization}</span>
                      <span className="mx-2">•</span>
                      <span>Updated {resource.lastUpdated}</span>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Resource
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Contacts */}
            {countryResource.emergencyContacts.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 p-4">
                <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Emergency Contacts
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {countryResource.emergencyContacts.map((contact, cIndex) => (
                    <div key={cIndex} className="bg-[#111820]/50 rounded p-3">
                      <div className="font-medium text-white text-sm mb-1">{contact.name}</div>
                      <div className="text-xs text-slate-400 mb-2">{contact.description}</div>
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="block text-red-400 text-sm font-mono mb-1">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {contact.phone}</span>
                        </a>
                      )}
                      {contact.email && (
                        <div className="text-[#22d3ee] text-sm font-mono">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <Scale className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No legal resources match your search criteria</p>
        </div>
      )}

      {/* General Advice */}
      <div className="mt-6 bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          General Legal Advice
        </h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• <strong>Document everything:</strong> Keep records of all harassment, threats, or persecution you've experienced.</p>
          <p>• <strong>Seek professional help early:</strong> Immigration law is complex. Consult a qualified lawyer as soon as possible.</p>
          <p>• <strong>Be truthful:</strong> Always provide accurate information in asylum or immigration applications.</p>
          <p>• <strong>Preserve evidence:</strong> Save emails, messages, photos, and any other evidence of persecution.</p>
          <p>• <strong>Know your rights:</strong> Understand your legal rights in your host country.</p>
          <p>• <strong>Report threats:</strong> Always report CCP harassment or intimidation to local authorities.</p>
        </div>
      </div>
    </div>
  );
};

export default LegalResourcesHub;
