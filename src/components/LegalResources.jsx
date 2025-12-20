import { useState } from 'react';

const LegalResources = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);

  const legalFrameworks = [
    {
      id: 1,
      name: 'Uyghur Forced Labor Prevention Act (UFLPA)',
      category: 'sanctions',
      jurisdiction: '🇺🇸 United States',
      year: 2021,
      status: 'ACTIVE',
      summary: 'Presumes all goods from Xinjiang are made with forced labor and bans their import.',
      details: `The UFLPA creates a rebuttable presumption that goods mined, produced, or manufactured wholly or in part in Xinjiang, or by entities on the UFLPA Entity List, are made with forced labor and therefore prohibited from entry into the United States.

Key provisions:
• Rebuttable presumption applies to all goods from Xinjiang
• Creates UFLPA Entity List of companies using forced labor
• Requires clear and convincing evidence to rebut presumption
• Customs and Border Protection enforces at ports of entry
• Applies to cotton, polysilicon, tomatoes, and other products`,
      enforcement: 'US Customs and Border Protection (CBP)',
      url: 'https://www.cbp.gov/trade/forced-labor/UFLPA'
    },
    {
      id: 2,
      name: 'Global Magnitsky Human Rights Accountability Act',
      category: 'sanctions',
      jurisdiction: '🇺🇸 United States',
      year: 2016,
      status: 'ACTIVE',
      summary: 'Authorizes sanctions against foreign individuals responsible for human rights violations.',
      details: `The Global Magnitsky Act allows the US government to sanction foreign government officials implicated in human rights abuses or corruption anywhere in the world.

Key provisions:
• Asset freezes and visa bans on designated individuals
• Applies to human rights abusers and corrupt officials globally
• President can waive sanctions for national security reasons
• Treasury Department maintains sanctions list
• Used to sanction CCP officials for Xinjiang, Hong Kong, Tibet abuses`,
      enforcement: 'US Treasury Department OFAC',
      url: 'https://home.treasury.gov/policy-issues/financial-sanctions/sanctions-programs-and-country-information/global-magnitsky-sanctions'
    },
    {
      id: 3,
      name: 'Hong Kong Human Rights and Democracy Act',
      category: 'sanctions',
      jurisdiction: '🇺🇸 United States',
      year: 2019,
      status: 'ACTIVE',
      summary: 'Requires annual certification of Hong Kong autonomy and sanctions for human rights abuses.',
      details: `This act requires the US State Department to annually certify whether Hong Kong remains sufficiently autonomous from mainland China to justify its special trade status.

Key provisions:
• Annual certification of Hong Kong autonomy
• Sanctions on officials responsible for undermining autonomy
• Visa restrictions for those involved in abductions
• Requires reports on Hong Kong press freedom
• Hong Kong lost special status in 2020 after NSL passage`,
      enforcement: 'US State Department, Treasury Department',
      url: 'https://www.congress.gov/bill/116th-congress/senate-bill/1838'
    },
    {
      id: 4,
      name: 'UK Magnitsky Sanctions Regime',
      category: 'sanctions',
      jurisdiction: '🇬🇧 United Kingdom',
      year: 2020,
      status: 'ACTIVE',
      summary: 'UK framework for sanctioning human rights abusers globally.',
      details: `The UK Global Human Rights Sanctions Regulations 2020 allow the UK to impose asset freezes and travel bans on individuals involved in serious human rights violations.

Key provisions:
• Asset freezes on designated individuals
• Travel bans preventing entry to UK
• Applies to human rights violators globally
• Used to sanction CCP officials for Xinjiang abuses
• Coordinated with US, EU, and Canada sanctions`,
      enforcement: 'UK Foreign Office, HM Treasury',
      url: 'https://www.gov.uk/government/collections/uk-sanctions-on-russia'
    },
    {
      id: 5,
      name: 'EU Human Rights Sanctions Regime',
      category: 'sanctions',
      jurisdiction: '🇪🇺 European Union',
      year: 2020,
      status: 'ACTIVE',
      summary: 'EU framework for targeting human rights abusers worldwide.',
      details: `The EU Global Human Rights Sanctions Regime allows the EU to target individuals, entities, and bodies responsible for serious human rights violations and abuses worldwide.

Key provisions:
• Asset freezes and travel bans
• Applies regardless of where violations occur
• First used to sanction CCP officials in March 2021
• China retaliated with counter-sanctions on EU officials
• Requires unanimous EU member state agreement`,
      enforcement: 'European External Action Service',
      url: 'https://www.consilium.europa.eu/en/policies/sanctions/'
    },
    {
      id: 6,
      name: 'UN Convention on Genocide',
      category: 'international',
      jurisdiction: '🇺🇳 United Nations',
      year: 1948,
      status: 'ACTIVE',
      summary: 'Defines genocide and obligates states to prevent and punish it.',
      details: `The Convention on the Prevention and Punishment of the Crime of Genocide defines genocide and creates obligations for signatory states.

Definition of genocide (Article II):
• Killing members of a group
• Causing serious bodily or mental harm
• Deliberately inflicting conditions to destroy the group
• Imposing measures to prevent births
• Forcibly transferring children

China is a signatory but has not ratified the convention. Multiple governments and parliaments have declared the Uyghur situation a genocide.`,
      enforcement: 'International Court of Justice',
      url: 'https://www.un.org/en/genocideprevention/genocide-convention.shtml'
    },
    {
      id: 7,
      name: 'Universal Declaration of Human Rights',
      category: 'international',
      jurisdiction: '🇺🇳 United Nations',
      year: 1948,
      status: 'ACTIVE',
      summary: 'Foundational document establishing universal human rights standards.',
      details: `The UDHR sets out fundamental human rights to be universally protected. China voted in favor of its adoption in 1948.

Relevant articles frequently violated by CCP:
• Article 3: Right to life, liberty, security
• Article 5: Freedom from torture
• Article 9: Freedom from arbitrary detention
• Article 13: Freedom of movement
• Article 18: Freedom of thought, conscience, religion
• Article 19: Freedom of opinion and expression
• Article 20: Freedom of peaceful assembly`,
      enforcement: 'UN Human Rights Council',
      url: 'https://www.un.org/en/about-us/universal-declaration-of-human-rights'
    },
    {
      id: 8,
      name: 'International Covenant on Civil and Political Rights',
      category: 'international',
      jurisdiction: '🇺🇳 United Nations',
      year: 1966,
      status: 'SIGNED (not ratified by China)',
      summary: 'Binding treaty on civil and political rights that China signed but never ratified.',
      details: `The ICCPR is a multilateral treaty that commits states to respect civil and political rights. China signed in 1998 but has never ratified it.

Key provisions:
• Right to life
• Freedom from torture
• Freedom from arbitrary detention
• Right to fair trial
• Freedom of thought, conscience, religion
• Freedom of expression
• Freedom of assembly
• Right to participate in government

China's failure to ratify means it is not legally bound by the treaty.`,
      enforcement: 'UN Human Rights Committee',
      url: 'https://www.ohchr.org/en/instruments-mechanisms/instruments/international-covenant-civil-and-political-rights'
    },
    {
      id: 9,
      name: 'Canada Justice for Victims of Corrupt Foreign Officials Act',
      category: 'sanctions',
      jurisdiction: '🇨🇦 Canada',
      year: 2017,
      status: 'ACTIVE',
      summary: 'Canada\'s Magnitsky-style sanctions law.',
      details: `Canada's Magnitsky law allows the government to impose sanctions on foreign nationals responsible for gross violations of human rights or significant corruption.

Key provisions:
• Asset freezes and dealings prohibitions
• Inadmissibility to Canada
• Used to sanction CCP officials for Xinjiang abuses
• Coordinated with allies
• Parliament can recommend designations`,
      enforcement: 'Global Affairs Canada',
      url: 'https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/victims_corrupt-victimes_corrompus.aspx'
    },
    {
      id: 10,
      name: 'Australia Autonomous Sanctions Act',
      category: 'sanctions',
      jurisdiction: '🇦🇺 Australia',
      year: 2011,
      status: 'ACTIVE',
      summary: 'Framework for Australian autonomous sanctions including Magnitsky-style provisions.',
      details: `Australia's sanctions framework was amended in 2021 to include Magnitsky-style provisions targeting human rights abusers.

Key provisions:
• Asset freezes and travel bans
• Can target individuals for human rights abuses
• Minister for Foreign Affairs makes designations
• Coordinated with Five Eyes partners
• Used for various human rights situations`,
      enforcement: 'Department of Foreign Affairs and Trade',
      url: 'https://www.dfat.gov.au/international-relations/security/sanctions'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Frameworks', icon: '⚖️' },
    { id: 'sanctions', name: 'Sanctions Laws', icon: '🚫' },
    { id: 'international', name: 'International Law', icon: '🌐' },
  ];

  const filteredFrameworks = selectedCategory === 'all'
    ? legalFrameworks
    : legalFrameworks.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">⚖️ Legal Frameworks & Resources</h2>
        <p className="text-slate-300">
          International laws, sanctions regimes, and legal tools for holding the CCP accountable for human rights abuses.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">10</p>
          <p className="text-sm text-slate-400">Legal Frameworks</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">6</p>
          <p className="text-sm text-slate-400">Jurisdictions</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">50+</p>
          <p className="text-sm text-slate-400">Officials Sanctioned</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">9</p>
          <p className="text-sm text-slate-400">Active Laws</p>
        </div>
      </div>

      {/* Frameworks List */}
      <div className="space-y-4">
        {filteredFrameworks.map((framework) => (
          <div
            key={framework.id}
            className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div
              className="p-6 cursor-pointer hover:bg-slate-700/50 transition-colors"
              onClick={() => setExpandedItem(expandedItem === framework.id ? null : framework.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{framework.jurisdiction}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      framework.status === 'ACTIVE' ? 'bg-green-600' : 'bg-yellow-600'
                    }`}>
                      {framework.status}
                    </span>
                    <span className="text-xs text-slate-500">{framework.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{framework.name}</h3>
                  <p className="text-slate-400 mt-2">{framework.summary}</p>
                </div>
                <span className="text-slate-400 text-2xl">
                  {expandedItem === framework.id ? '−' : '+'}
                </span>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedItem === framework.id && (
              <div className="px-6 pb-6 border-t border-slate-700 pt-4">
                <div className="prose prose-invert max-w-none">
                  {framework.details.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-slate-300 mb-4 whitespace-pre-line">{paragraph}</p>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    <span className="font-semibold">Enforcement:</span> {framework.enforcement}
                  </div>
                  <a
                    href={framework.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Official Source →
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* How to Use Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">📋 How to Use These Laws</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-2">For Advocacy</h4>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Cite specific laws when writing to representatives</li>
              <li>• Reference sanctions when calling for accountability</li>
              <li>• Use legal frameworks to support petition campaigns</li>
              <li>• Quote international law in media statements</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">For Reporting</h4>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Report forced labor goods to CBP under UFLPA</li>
              <li>• Submit evidence to sanctions authorities</li>
              <li>• Document violations for UN mechanisms</li>
              <li>• Support legal cases with documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalResources;
