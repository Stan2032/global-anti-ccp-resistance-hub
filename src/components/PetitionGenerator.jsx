import React, { useState } from 'react';

const PetitionGenerator = () => {
  const [step, setStep] = useState(1);
  const [petition, setPetition] = useState({
    type: '',
    target: '',
    targetCustom: '',
    issue: '',
    issueCustom: '',
    demands: [],
    customDemand: '',
    background: '',
    yourName: '',
    yourOrg: '',
  });
  const [generatedPetition, setGeneratedPetition] = useState('');
  const [copied, setCopied] = useState(false);

  const petitionTypes = [
    { id: 'government', name: 'Government Official', icon: '🏛️' },
    { id: 'company', name: 'Corporation/Company', icon: '🏢' },
    { id: 'university', name: 'University/Institution', icon: '🎓' },
    { id: 'international', name: 'International Body', icon: '🌐' },
    { id: 'media', name: 'Media Organization', icon: '📺' },
  ];

  const targetOptions = {
    government: [
      'US Congress',
      'UK Parliament',
      'European Parliament',
      'Canadian Parliament',
      'Australian Parliament',
      'UN Human Rights Council',
      'Other (specify)',
    ],
    company: [
      'Apple',
      'Nike',
      'H&M',
      'Volkswagen',
      'Amazon',
      'Disney',
      'NBA',
      'Other (specify)',
    ],
    university: [
      'Harvard University',
      'MIT',
      'Oxford University',
      'Stanford University',
      'University of Toronto',
      'Other (specify)',
    ],
    international: [
      'United Nations',
      'International Olympic Committee',
      'World Bank',
      'International Criminal Court',
      'World Health Organization',
      'Other (specify)',
    ],
    media: [
      'BBC',
      'CNN',
      'New York Times',
      'Reuters',
      'Associated Press',
      'Other (specify)',
    ],
  };

  const issueOptions = [
    { id: 'uyghur', name: 'Uyghur Genocide', description: 'Mass detention, forced labor, cultural destruction' },
    { id: 'hongkong', name: 'Hong Kong Crackdown', description: 'NSL, political prisoners, press freedom' },
    { id: 'tibet', name: 'Tibetan Oppression', description: 'Religious persecution, cultural destruction' },
    { id: 'taiwan', name: 'Taiwan Sovereignty', description: 'Military threats, diplomatic pressure' },
    { id: 'prisoner', name: 'Political Prisoner', description: 'Specific prisoner case' },
    { id: 'police', name: 'Overseas Police Stations', description: 'Transnational repression' },
    { id: 'forcedlabor', name: 'Forced Labor', description: 'Supply chain complicity' },
    { id: 'confucius', name: 'Confucius Institutes', description: 'Academic freedom, censorship' },
    { id: 'other', name: 'Other Issue', description: 'Specify your own' },
  ];

  const demandOptions = {
    uyghur: [
      'Recognize the Uyghur genocide',
      'Impose Magnitsky sanctions on officials',
      'Ban products made with forced labor',
      'Support independent investigation',
      'Provide asylum to Uyghur refugees',
    ],
    hongkong: [
      'Release all political prisoners',
      'Sanction officials responsible for crackdown',
      'Provide safe haven for Hong Kong refugees',
      'Condemn National Security Law',
      'Support press freedom',
    ],
    tibet: [
      'Support Tibetan self-determination',
      'Condemn religious persecution',
      'Meet with the Dalai Lama',
      'Support Tibetan refugees',
      'Investigate cultural destruction',
    ],
    taiwan: [
      'Support Taiwan\'s international participation',
      'Oppose military threats against Taiwan',
      'Strengthen Taiwan relations',
      'Condemn diplomatic pressure on Taiwan',
      'Support Taiwan\'s democracy',
    ],
    prisoner: [
      'Call for immediate release',
      'Demand access to legal representation',
      'Ensure humane treatment',
      'Grant asylum if released',
      'Raise case in bilateral meetings',
    ],
    police: [
      'Investigate overseas police stations',
      'Shut down illegal operations',
      'Protect diaspora communities',
      'Prosecute those involved',
      'Strengthen laws against transnational repression',
    ],
    forcedlabor: [
      'Audit supply chain for forced labor',
      'Exit Xinjiang operations',
      'Publish supplier list',
      'Support UFLPA enforcement',
      'Compensate victims',
    ],
    confucius: [
      'Close Confucius Institutes',
      'Protect academic freedom',
      'Disclose foreign funding',
      'Support Chinese students\' free speech',
      'Investigate censorship incidents',
    ],
    other: [],
  };

  const generatePetitionText = () => {
    const target = petition.target === 'Other (specify)' ? petition.targetCustom : petition.target;
    const issue = issueOptions.find(i => i.id === petition.issue);
    const issueName = petition.issue === 'other' ? petition.issueCustom : issue?.name;
    
    const demandsText = petition.demands.map((d, i) => `${i + 1}. ${d}`).join('\n');
    
    const text = `PETITION TO ${target.toUpperCase()}

RE: ${issueName}

Dear ${target},

We, the undersigned, write to express our deep concern regarding ${issueName.toLowerCase()} and urge you to take immediate action.

${petition.background || `The Chinese Communist Party's ongoing human rights abuses demand urgent attention from the international community. ${issue?.description || ''}`}

We call upon you to:

${demandsText}

The international community must stand united against these human rights violations. History will judge us by our actions today.

We urge you to act with urgency and moral clarity.

Respectfully,

${petition.yourName || '[Your Name]'}
${petition.yourOrg ? `${petition.yourOrg}` : ''}
[Date]

---
This petition was created using the Global Anti-CCP Resistance Hub
https://stan2032.github.io/global-anti-ccp-resistance-hub/
`;

    setGeneratedPetition(text);
    setStep(4);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPetition);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addDemand = (demand) => {
    if (!petition.demands.includes(demand)) {
      setPetition({...petition, demands: [...petition.demands, demand]});
    }
  };

  const removeDemand = (demand) => {
    setPetition({...petition, demands: petition.demands.filter(d => d !== demand)});
  };

  const addCustomDemand = () => {
    if (petition.customDemand.trim() && !petition.demands.includes(petition.customDemand)) {
      setPetition({
        ...petition, 
        demands: [...petition.demands, petition.customDemand],
        customDemand: ''
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-700/50">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">📝</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Petition Generator</h2>
            <p className="text-slate-400">Create professional petitions for your advocacy campaigns</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Generate customized petitions to send to governments, companies, universities, and 
          international bodies. Our templates are designed for maximum impact.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
              step >= s ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
            }`}>
              {s}
            </div>
            {s < 4 && (
              <div className={`w-16 md:w-24 h-1 mx-2 ${
                step > s ? 'bg-blue-600' : 'bg-slate-700'
              }`}></div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-400">
        <span>Target</span>
        <span>Issue</span>
        <span>Demands</span>
        <span>Generate</span>
      </div>

      {/* Step 1: Select Target Type */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Who is this petition for?</h3>
          
          <div className="grid md:grid-cols-2 gap-3">
            {petitionTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setPetition({...petition, type: type.id, target: ''})}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  petition.type === type.id
                    ? 'bg-blue-900/30 border-blue-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <h4 className="font-medium text-white mt-2">{type.name}</h4>
              </button>
            ))}
          </div>

          {petition.type && (
            <div className="space-y-3">
              <h4 className="font-medium text-white">Select specific target:</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {targetOptions[petition.type]?.map(target => (
                  <button
                    key={target}
                    onClick={() => setPetition({...petition, target})}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                      petition.target === target
                        ? 'bg-blue-900/30 border-blue-500 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {target}
                  </button>
                ))}
              </div>
              
              {petition.target === 'Other (specify)' && (
                <input
                  type="text"
                  placeholder="Enter target name..."
                  value={petition.targetCustom}
                  onChange={(e) => setPetition({...petition, targetCustom: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            disabled={!petition.target || (petition.target === 'Other (specify)' && !petition.targetCustom)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2: Select Issue */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">What issue is this petition about?</h3>
          
          <div className="space-y-2">
            {issueOptions.map(issue => (
              <button
                key={issue.id}
                onClick={() => setPetition({...petition, issue: issue.id, demands: []})}
                className={`w-full p-4 rounded-xl border text-left transition-colors ${
                  petition.issue === issue.id
                    ? 'bg-blue-900/30 border-blue-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <h4 className="font-medium text-white">{issue.name}</h4>
                <p className="text-sm text-slate-400">{issue.description}</p>
              </button>
            ))}
          </div>

          {petition.issue === 'other' && (
            <input
              type="text"
              placeholder="Describe the issue..."
              value={petition.issueCustom}
              onChange={(e) => setPetition({...petition, issueCustom: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!petition.issue || (petition.issue === 'other' && !petition.issueCustom)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Demands */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">What are your demands?</h3>
          <p className="text-sm text-slate-400">Select at least one demand or add your own.</p>
          
          {/* Suggested Demands */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Suggested demands:</h4>
            {demandOptions[petition.issue]?.map(demand => (
              <button
                key={demand}
                onClick={() => petition.demands.includes(demand) ? removeDemand(demand) : addDemand(demand)}
                className={`w-full p-3 rounded-lg border text-left text-sm transition-colors ${
                  petition.demands.includes(demand)
                    ? 'bg-green-900/30 border-green-500 text-green-300'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="mr-2">{petition.demands.includes(demand) ? '✓' : '+'}</span>
                {demand}
              </button>
            ))}
          </div>

          {/* Custom Demand */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Add custom demand:</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter your demand..."
                value={petition.customDemand}
                onChange={(e) => setPetition({...petition, customDemand: e.target.value})}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={addCustomDemand}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected Demands */}
          {petition.demands.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <h4 className="text-sm font-medium text-white mb-2">Selected demands ({petition.demands.length}):</h4>
              <ul className="space-y-1">
                {petition.demands.map((demand, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm text-slate-300">
                    <span>{idx + 1}. {demand}</span>
                    <button 
                      onClick={() => removeDemand(demand)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Optional Fields */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">Optional: Add background context</h4>
            <textarea
              placeholder="Add any specific background information or context..."
              value={petition.background}
              onChange={(e) => setPetition({...petition, background: e.target.value})}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={petition.yourName}
              onChange={(e) => setPetition({...petition, yourName: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Your organization (optional)"
              value={petition.yourOrg}
              onChange={(e) => setPetition({...petition, yourOrg: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={generatePetitionText}
              disabled={petition.demands.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              Generate Petition →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Generated Petition */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Your Petition</h3>
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
            </button>
          </div>
          
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono">
              {generatedPetition}
            </pre>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
            <h4 className="font-medium text-blue-300 mb-2">📤 Next Steps</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Copy the petition and paste into an email or document</li>
              <li>• Collect signatures from supporters</li>
              <li>• Send to the target via email, mail, or social media</li>
              <li>• Share on social media to gather more support</li>
              <li>• Follow up if you don't receive a response</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setPetition({
                  type: '',
                  target: '',
                  targetCustom: '',
                  issue: '',
                  issueCustom: '',
                  demands: [],
                  customDemand: '',
                  background: '',
                  yourName: '',
                  yourOrg: '',
                });
                setGeneratedPetition('');
                setStep(1);
              }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Create New Petition
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              ← Edit Petition
            </button>
          </div>
        </div>
      )}

      {/* Templates */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <h3 className="font-medium text-white mb-3">📚 Petition Tips</h3>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• Be specific and clear about your demands</li>
          <li>• Include verifiable facts and sources</li>
          <li>• Keep it professional and respectful</li>
          <li>• Set a deadline for response if appropriate</li>
          <li>• Follow up with phone calls and social media pressure</li>
        </ul>
      </div>
    </div>
  );
};

export default PetitionGenerator;
