import React, { useState } from 'react';
import { Brain, AlertTriangle, CheckCircle, Search, ExternalLink, TrendingUp, Eye } from 'lucide-react';
import GlobalDisclaimer from './ui/GlobalDisclaimer';

const AIDisinfoDetector = () => {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Common CCP propaganda patterns and keywords
  const propagandaPatterns = [
    {
      category: 'Denial',
      keywords: ['no genocide', 'fabricated', 'lies', 'fake news', 'western propaganda', 'made up', 'false accusations'],
      weight: 0.8
    },
    {
      category: 'Whataboutism',
      keywords: ['what about', 'hypocrisy', 'double standard', 'western countries', 'united states', 'colonialism'],
      weight: 0.7
    },
    {
      category: 'Deflection',
      keywords: ['internal affairs', 'sovereignty', 'interference', 'domestic issue', 'none of your business'],
      weight: 0.75
    },
    {
      category: 'Euphemism',
      keywords: ['vocational training', 'education center', 'deradicalization', 'counter-terrorism', 'stability maintenance'],
      weight: 0.85
    },
    {
      category: 'Victim Blaming',
      keywords: ['separatist', 'terrorist', 'extremist', 'three evils', 'splittist', 'anti-China forces'],
      weight: 0.8
    },
    {
      category: 'False Equivalence',
      keywords: ['both sides', 'all countries', 'everyone does it', 'not unique', 'common practice'],
      weight: 0.6
    }
  ];

  const analyzeText = () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const lowerText = inputText.toLowerCase();
      let totalScore = 0;
      let detectedPatterns = [];
      let flaggedKeywords = [];

      // Check for propaganda patterns
      propagandaPatterns.forEach(pattern => {
        const foundKeywords = pattern.keywords.filter(keyword => 
          lowerText.includes(keyword.toLowerCase())
        );

        if (foundKeywords.length > 0) {
          const patternScore = (foundKeywords.length / pattern.keywords.length) * pattern.weight;
          totalScore += patternScore;
          
          detectedPatterns.push({
            category: pattern.category,
            score: patternScore,
            foundKeywords: foundKeywords
          });

          flaggedKeywords.push(...foundKeywords);
        }
      });

      // Calculate final risk score (0-100)
      const riskScore = Math.min(Math.round(totalScore * 50), 100);

      // Determine risk level
      let riskLevel, riskColor, riskDescription;
      if (riskScore >= 70) {
        riskLevel = 'High Risk';
        riskColor = 'red';
        riskDescription = 'This text shows strong indicators of CCP propaganda or disinformation';
      } else if (riskScore >= 40) {
        riskLevel = 'Medium Risk';
        riskColor = 'yellow';
        riskDescription = 'This text contains some propaganda patterns. Verify with multiple sources';
      } else if (riskScore >= 20) {
        riskLevel = 'Low Risk';
        riskColor = 'blue';
        riskDescription = 'Minor propaganda indicators detected. Exercise normal caution';
      } else {
        riskLevel = 'Minimal Risk';
        riskColor = 'green';
        riskDescription = 'No significant propaganda patterns detected';
      }

      setAnalysisResult({
        riskScore,
        riskLevel,
        riskColor,
        riskDescription,
        detectedPatterns,
        flaggedKeywords: [...new Set(flaggedKeywords)],
        wordCount: inputText.split(/\s+/).length
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  const exampleTexts = [
    {
      title: 'CCP Propaganda Example',
      text: 'The vocational training centers in Xinjiang are helping to combat the three evils of terrorism, separatism, and extremism. Western propaganda about so-called genocide is completely fabricated. This is China\'s internal affair and interference in our sovereignty will not be tolerated.',
      expectedRisk: 'High'
    },
    {
      title: 'Neutral Reporting Example',
      text: 'The UN report documented concerns about human rights in Xinjiang, citing testimonies from former detainees. China has denied these allegations, stating the facilities are vocational training centers. International observers have called for independent verification.',
      expectedRisk: 'Low-Medium'
    }
  ];

  const getRiskColorClass = (color) => {
    const colors = {
      red: 'text-red-400 bg-red-500/10 border-red-500/30',
      yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      green: 'text-green-400 bg-green-500/10 border-green-500/30'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-[#111820]/50 backdrop-blur-sm border border-[#1c2a35]/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-cyan-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">AI Disinformation Detector</h2>
          <p className="text-slate-400 text-sm">Analyze text for CCP propaganda patterns and disinformation</p>
        </div>
      </div>

      {/* Information Banner */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 mb-6">
        <h3 className="text-cyan-400 font-bold mb-2">How It Works</h3>
        <p className="text-slate-300 text-sm mb-2">
          This tool analyzes text for common CCP propaganda patterns including denial, whataboutism, deflection, euphemisms, and victim blaming. 
          It provides a risk score based on detected patterns.
        </p>
        <GlobalDisclaimer type="verify" compact />
      </div>

      {/* Input Area */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">Paste text to analyze:</label>
        <textarea
          aria-label="Paste text to analyze:"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste article text, social media post, or any content you want to analyze for propaganda patterns..."
          className="w-full h-40 p-4 bg-[#0a0e14]/50 border border-[#1c2a35]/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-slate-500">
            {inputText.split(/\s+/).filter(w => w).length} words
          </span>
          <button
            onClick={analyzeText}
            disabled={!inputText.trim() || isAnalyzing}
            className={`flex items-center gap-2 px-6 py-2 font-medium transition-colors ${
              inputText.trim() && !isAnalyzing
                ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Analyze Text
              </>
            )}
          </button>
        </div>
      </div>

      {/* Example Texts */}
      {!analysisResult && (
        <div className="mb-6">
          <h3 className="text-white font-bold mb-3">Try Example Texts:</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {exampleTexts.map((example, index) => (
              <div key={index} className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{example.title}</h4>
                  <span className="text-xs text-slate-500">Expected: {example.expectedRisk}</span>
                </div>
                <p className="text-sm text-slate-400 mb-3 line-clamp-3">{example.text}</p>
                <button
                  onClick={() => setInputText(example.text)}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Load Example
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Risk Score */}
          <div className={`border p-6 ${getRiskColorClass(analysisResult.riskColor)}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">{analysisResult.riskLevel}</h3>
                <p className="text-sm opacity-90">{analysisResult.riskDescription}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{analysisResult.riskScore}</div>
                <div className="text-sm opacity-75">Risk Score</div>
              </div>
            </div>
            
            {/* Risk Score Bar */}
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  analysisResult.riskScore >= 70 ? 'bg-red-500' :
                  analysisResult.riskScore >= 40 ? 'bg-yellow-500' :
                  analysisResult.riskScore >= 20 ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{ width: `${analysisResult.riskScore}%` }}
              ></div>
            </div>
          </div>

          {/* Detected Patterns */}
          {analysisResult.detectedPatterns.length > 0 && (
            <div className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Detected Propaganda Patterns
              </h3>
              <div className="space-y-3">
                {analysisResult.detectedPatterns.map((pattern, index) => (
                  <div key={index} className="p-4 bg-[#111820]/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{pattern.category}</h4>
                      <span className="text-sm text-slate-400">
                        Confidence: {Math.round(pattern.score * 100)}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pattern.foundKeywords.map((keyword, kIndex) => (
                        <span key={kIndex} className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400">
                          "{keyword}"
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flagged Keywords */}
          {analysisResult.flaggedKeywords.length > 0 && (
            <div className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
              <h3 className="text-white font-bold mb-3">Flagged Keywords/Phrases</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.flaggedKeywords.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 bg-[#111820] border border-[#1c2a35] rounded-full text-sm text-slate-300">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-blue-500/10 border border-blue-500/30 p-5">
            <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Recommendations
            </h3>
            <div className="space-y-2 text-sm text-slate-300">
              {analysisResult.riskScore >= 70 && (
                <>
                  <p>• <strong>High propaganda indicators:</strong> Treat this content with extreme skepticism</p>
                  <p>• Cross-reference claims with independent, credible sources</p>
                  <p>• Look for primary sources and original documents</p>
                  <p>• Check if the source has a history of spreading CCP narratives</p>
                </>
              )}
              {analysisResult.riskScore >= 40 && analysisResult.riskScore < 70 && (
                <>
                  <p>• <strong>Moderate propaganda indicators:</strong> Verify all claims independently</p>
                  <p>• Compare with reporting from multiple international sources</p>
                  <p>• Be aware of potential bias in framing and language</p>
                </>
              )}
              {analysisResult.riskScore < 40 && (
                <>
                  <p>• <strong>Low propaganda indicators:</strong> Content appears relatively neutral</p>
                  <p>• Still verify key facts with credible sources</p>
                  <p>• Consider the source's overall track record</p>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setInputText('');
                setAnalysisResult(null);
              }}
              className="flex-1 py-3 bg-slate-700 hover:bg-[#1c2a35] text-white font-medium transition-colors"
            >
              Analyze New Text
            </button>
          </div>
        </div>
      )}

      {/* Propaganda Patterns Reference */}
      <div className="mt-6 bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
        <h3 className="text-white font-bold mb-4">Common CCP Propaganda Patterns</h3>
        <div className="space-y-3">
          {propagandaPatterns.map((pattern, index) => (
            <div key={index} className="p-3 bg-[#111820]/50">
              <h4 className="font-bold text-white mb-2">{pattern.category}</h4>
              <div className="flex flex-wrap gap-2">
                {pattern.keywords.slice(0, 5).map((keyword, kIndex) => (
                  <span key={kIndex} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-400">
                    {keyword}
                  </span>
                ))}
                {pattern.keywords.length > 5 && (
                  <span className="px-2 py-1 text-xs text-slate-500">
                    +{pattern.keywords.length - 5} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-6 bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
        <h3 className="text-white font-bold mb-3">Learn More About CCP Propaganda</h3>
        <div className="space-y-2">
          <a
            href="https://freedomhouse.org/report/special-report/2021/beijings-global-megaphone"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820]/50 hover:bg-[#111820] transition-colors text-sm text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            Freedom House - Beijing's Global Megaphone
          </a>
          <a
            href="https://www.aspi.org.au/report/party-speak"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820]/50 hover:bg-[#111820] transition-colors text-sm text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            ASPI - Party Speak: CCP Propaganda Language
          </a>
          <a
            href="https://www.ned.org/sharp-power-rising-authoritarian-influence-forum/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820]/50 hover:bg-[#111820] transition-colors text-sm text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            NED - Sharp Power and Authoritarian Influence
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6">
        <GlobalDisclaimer type="verify" />
      </div>
    </div>
  );
};

export default AIDisinfoDetector;
