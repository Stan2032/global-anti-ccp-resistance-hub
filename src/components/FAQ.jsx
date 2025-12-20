import React, { useState } from 'react';

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'basics', name: 'Getting Started' },
    { id: 'safety', name: 'Safety & Security' },
    { id: 'action', name: 'Taking Action' },
    { id: 'understanding', name: 'Understanding the Issues' },
  ];

  const faqs = [
    // Getting Started
    {
      id: 1,
      category: 'basics',
      question: 'What is the Global Anti-CCP Resistance Hub?',
      answer: 'This platform is a comprehensive resource for documenting CCP human rights abuses, coordinating global resistance efforts, and providing tools for activists, researchers, and concerned citizens. We aggregate information from verified sources including Safeguard Defenders, Freedom House, ASPI, and government reports.'
    },
    {
      id: 2,
      category: 'basics',
      question: 'Who created this platform and why?',
      answer: 'This platform was created by concerned individuals who believe in transparency, human rights, and democratic values. Our goal is to make information about CCP abuses accessible and actionable, empowering people worldwide to take meaningful action against authoritarianism.'
    },
    {
      id: 3,
      category: 'basics',
      question: 'Is this platform affiliated with any government or organization?',
      answer: 'No, this is an independent, open-source project. We are not affiliated with any government, political party, or organization. Our data comes from publicly available sources, academic research, and verified human rights organizations.'
    },
    {
      id: 4,
      category: 'basics',
      question: 'How can I contribute to this platform?',
      answer: 'You can contribute by: 1) Sharing verified information about CCP activities, 2) Reporting errors or outdated information, 3) Contributing code via our GitHub repository, 4) Translating content into other languages, 5) Spreading awareness by sharing the platform with others.'
    },

    // Safety & Security
    {
      id: 5,
      category: 'safety',
      question: 'Is it safe to use this platform?',
      answer: 'We take security seriously. This platform does not collect personal data or require registration. However, if you are in China or a country with CCP influence, we strongly recommend using Tor Browser and a trusted VPN. Never access this site on devices that could be monitored.'
    },
    {
      id: 6,
      category: 'safety',
      question: 'What precautions should I take if I\'m in China?',
      answer: 'If you are in China: 1) Use Tor Browser exclusively, 2) Use a reputable VPN as backup, 3) Never use your real identity, 4) Don\'t access from work or monitored devices, 5) Be aware of shoulder surfing, 6) Consider using Tails OS for maximum security. Your safety is paramount.'
    },
    {
      id: 7,
      category: 'safety',
      question: 'Can the CCP track my visits to this site?',
      answer: 'We don\'t collect any tracking data. However, your ISP and potentially your government can see that you visited this domain unless you use Tor or a VPN. In China, this site is likely blocked, so accessing it already requires circumvention tools that provide some protection.'
    },
    {
      id: 8,
      category: 'safety',
      question: 'What should I do if I face harassment or threats?',
      answer: 'If you face harassment: 1) Document everything, 2) Contact Front Line Defenders (+353 1 210 0489) for emergency support, 3) Report to local law enforcement if safe, 4) Contact Safeguard Defenders if you suspect CCP involvement. Never engage with harassers directly.'
    },
    {
      id: 9,
      category: 'safety',
      question: 'Are there emergency contacts for activists in danger?',
      answer: 'Yes. Front Line Defenders provides 24/7 emergency support: +353 1 210 0489. Access Now Digital Security Helpline: help@accessnow.org. Safeguard Defenders specializes in CCP transnational repression cases. These organizations can provide guidance, legal support, and emergency assistance.'
    },

    // Taking Action
    {
      id: 10,
      category: 'action',
      question: 'What can I actually do to help?',
      answer: 'Many things! 1) Contact your elected representatives about CCP human rights abuses, 2) Sign petitions for political prisoners, 3) Boycott companies using Uyghur forced labor, 4) Donate to verified human rights organizations, 5) Share information on social media, 6) Attend protests and awareness events, 7) Support diaspora communities.'
    },
    {
      id: 11,
      category: 'action',
      question: 'Does contacting my representative actually make a difference?',
      answer: 'Yes! Legislators track constituent contacts and respond to sustained pressure. The Uyghur Forced Labor Prevention Act, Magnitsky sanctions, and investigations into overseas police stations all resulted partly from constituent advocacy. Your voice matters more than you think.'
    },
    {
      id: 12,
      category: 'action',
      question: 'Which organizations should I donate to?',
      answer: 'Verified organizations include: Uyghur Human Rights Project (uhrp.org), Hong Kong Watch (hongkongwatch.org), International Campaign for Tibet (savetibet.org), Safeguard Defenders (safeguarddefenders.com), and Freedom House (freedomhouse.org). All have transparent finances and proven track records.'
    },
    {
      id: 13,
      category: 'action',
      question: 'How do I know if a company uses Uyghur forced labor?',
      answer: 'Check the ASPI "Uyghurs for Sale" report which identified 83 brands. Look for supply chains in Xinjiang, especially cotton, polysilicon, and tomatoes. The Coalition to End Forced Labour in the Uyghur Region maintains updated lists. Our Boycott List section provides specific guidance.'
    },
    {
      id: 14,
      category: 'action',
      question: 'Can I report CCP activities I\'ve witnessed?',
      answer: 'Yes! Use our Report CCP Activity feature in the Community section. For overseas police stations or transnational repression, also report to: FBI (US), MI5 (UK), RCMP (Canada), ASIO (Australia), or your local law enforcement. Safeguard Defenders also accepts reports.'
    },

    // Understanding the Issues
    {
      id: 15,
      category: 'understanding',
      question: 'What is happening to the Uyghurs?',
      answer: 'The Uyghurs, a Turkic Muslim minority in Xinjiang, face what multiple governments have declared genocide. Since 2017, 1-3 million have been detained in "re-education" camps. They face forced labor, forced sterilization, family separation, cultural erasure, and religious persecution.'
    },
    {
      id: 16,
      category: 'understanding',
      question: 'What happened to Hong Kong\'s democracy?',
      answer: 'After massive pro-democracy protests in 2019, Beijing imposed the National Security Law in 2020, criminalizing dissent. Most pro-democracy leaders are now imprisoned or exiled. Press freedom has been crushed, with outlets like Apple Daily forced to close. The promised "One Country, Two Systems" is effectively dead.'
    },
    {
      id: 17,
      category: 'understanding',
      question: 'What are overseas police stations?',
      answer: 'These are unofficial CCP-linked facilities operating in 53+ countries, documented by Safeguard Defenders. They monitor, intimidate, and coerce Chinese nationals abroad to return to China, often through threats to family members. Several countries have launched investigations and shut them down.'
    },
    {
      id: 18,
      category: 'understanding',
      question: 'What is transnational repression?',
      answer: 'Transnational repression refers to governments targeting dissidents, activists, and diaspora communities abroad. The CCP is the world\'s leading practitioner, using tactics including surveillance, harassment, threats to family in China, kidnapping, and coerced "voluntary" returns. Freedom House tracks these cases globally.'
    },
    {
      id: 19,
      category: 'understanding',
      question: 'Why should people outside China care?',
      answer: 'CCP influence affects everyone: 1) Overseas police stations operate in your country, 2) Products made with forced labor are in your stores, 3) CCP influence operations target your universities and politicians, 4) Surveillance technology developed in Xinjiang is exported globally, 5) Authoritarian expansion threatens all democracies.'
    },
    {
      id: 20,
      category: 'understanding',
      question: 'Is this anti-Chinese racism?',
      answer: 'Absolutely not. This platform opposes the Chinese Communist Party, not Chinese people. Many of the bravest activists fighting CCP abuses are Chinese citizens and diaspora. We stand in solidarity with Chinese people who also suffer under CCP rule, including the millions detained for their beliefs or ethnicity.'
    },
  ];

  const filteredFaqs = faqs.filter(faq => 
    activeCategory === 'all' || faq.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">❓</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400">Common questions for newcomers and activists</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          {faqs.length} questions answered to help you understand and take action.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.map(faq => (
          <div
            key={faq.id}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <button
              onClick={() => setOpenQuestion(openQuestion === faq.id ? null : faq.id)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
            >
              <span className="font-medium text-white pr-4">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                  openQuestion === faq.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openQuestion === faq.id && (
              <div className="px-5 pb-4 border-t border-slate-700">
                <p className="text-slate-300 pt-4 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">Still have questions?</h3>
        <p className="text-slate-300 text-sm mb-4">
          If you couldn't find the answer you're looking for, check our Education Center for in-depth resources, 
          or explore the Glossary for terminology explanations.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/education" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            Education Center
          </a>
          <a href="/resources" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
            Resources
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
