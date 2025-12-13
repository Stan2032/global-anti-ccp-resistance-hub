import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const timelineData = [
  {
    year: 1949,
    title: "CCP Founded Propaganda System",
    description: "Mao Zedong establishes centralized propaganda apparatus focused on domestic control and party legitimacy.",
    category: "Foundation",
    impact: "Domestic",
    details: "The Chinese Communist Party established the Central Propaganda Department to control information flow and maintain party legitimacy. Early propaganda focused on revolutionary themes and class struggle.",
    keyEvents: [
      "Central Propaganda Department established",
      "State-controlled media system created",
      "Revolutionary propaganda campaigns launched"
    ]
  },
  {
    year: 1966,
    title: "Cultural Revolution Propaganda",
    description: "Massive domestic propaganda campaign using mass media, posters, and public demonstrations.",
    category: "Domestic Campaign",
    impact: "Domestic",
    details: "The Cultural Revolution demonstrated the CCP's ability to mobilize massive propaganda campaigns. Red Guards spread Mao's ideology through posters, rallies, and public denunciations.",
    keyEvents: [
      "Red Guard propaganda networks activated",
      "Mass production of propaganda posters",
      "Public struggle sessions organized"
    ]
  },
  {
    year: 1989,
    title: "Tiananmen Square Information Control",
    description: "First major test of CCP's ability to control narrative around international crisis.",
    category: "Crisis Management",
    impact: "International",
    details: "The CCP's response to Tiananmen Square protests marked its first major attempt to control international narrative. Domestic censorship was coupled with limited international messaging.",
    keyEvents: [
      "Domestic media blackout implemented",
      "International journalists restricted",
      "Alternative narrative promoted abroad"
    ]
  },
  {
    year: 2008,
    title: "Olympics Soft Power Push",
    description: "Beijing Olympics used as platform for positive international messaging and image building.",
    category: "Soft Power",
    impact: "International",
    details: "The 2008 Beijing Olympics marked China's first major soft power campaign, showcasing economic development and cultural heritage to improve international image.",
    keyEvents: [
      "Massive international media campaign",
      "Cultural showcases and ceremonies",
      "Positive economic narrative promoted"
    ]
  },
  {
    year: 2012,
    title: "Xi Jinping's 'Telling China's Story'",
    description: "New leadership emphasizes need to shape international narrative about China's rise.",
    category: "Strategic Shift",
    impact: "International",
    details: "Xi Jinping introduced the concept of 'telling China's story well' (讲好中国故事), marking a shift toward more proactive international propaganda efforts.",
    keyEvents: [
      "'Telling China's story' doctrine announced",
      "International media expansion begins",
      "Confucius Institutes expanded globally"
    ]
  },
  {
    year: 2016,
    title: "Social Media Expansion",
    description: "CCP begins systematic use of Western social media platforms for international influence.",
    category: "Digital Expansion",
    impact: "International",
    details: "Despite blocking these platforms domestically, the CCP began using Twitter, Facebook, and YouTube for international propaganda, learning from Russian techniques.",
    keyEvents: [
      "Official accounts created on Western platforms",
      "Coordinated messaging campaigns launched",
      "Bot networks begin operations"
    ]
  },
  {
    year: 2019,
    title: "Hong Kong Protests Response",
    description: "Large-scale disinformation campaign targeting Hong Kong democracy movement.",
    category: "Crisis Response",
    impact: "International",
    details: "The Hong Kong protests triggered the CCP's first major international disinformation campaign, using both official channels and covert networks to discredit protesters.",
    keyEvents: [
      "Protesters labeled as 'rioters' and 'terrorists'",
      "Coordinated bot campaigns launched",
      "Western support characterized as foreign interference"
    ]
  },
  {
    year: 2020,
    title: "COVID-19 Disinformation Campaign",
    description: "Aggressive campaign to deflect blame for pandemic origins, including conspiracy theories.",
    category: "Crisis Response",
    impact: "Global",
    details: "The COVID-19 pandemic marked the CCP's adoption of 'big lie' techniques, promoting conspiracy theories about US military origins while denying Chinese responsibility.",
    keyEvents: [
      "Zhao Lijian promotes US military lab theory",
      "Massive bot networks activated globally",
      "Scientific evidence systematically denied"
    ]
  },
  {
    year: 2021,
    title: "Wolf Warrior Diplomacy Peak",
    description: "Aggressive, confrontational diplomatic messaging becomes standard practice.",
    category: "Diplomatic Strategy",
    impact: "Global",
    details: "Named after Chinese action movies, 'Wolf Warrior diplomacy' represented a shift from defensive to offensive messaging, with diplomats actively attacking critics.",
    keyEvents: [
      "Diplomatic accounts adopt aggressive tone",
      "Critics systematically attacked online",
      "Boycotts and economic pressure threatened"
    ]
  },
  {
    year: 2022,
    title: "Ukraine War Propaganda",
    description: "CCP amplifies Russian disinformation while maintaining official neutrality.",
    category: "Geopolitical",
    impact: "Global",
    details: "During Russia's invasion of Ukraine, CCP propaganda networks amplified Russian disinformation while officially claiming neutrality, testing coordination with other authoritarian regimes.",
    keyEvents: [
      "Russian narratives amplified on Chinese platforms",
      "NATO and US blamed for conflict",
      "Chinese 'neutrality' promoted as moral superiority"
    ]
  },
  {
    year: 2023,
    title: "AI-Enhanced Operations",
    description: "Integration of artificial intelligence to create more sophisticated propaganda content.",
    category: "Technological Evolution",
    impact: "Global",
    details: "The CCP began integrating AI tools to create more convincing fake accounts, generate content at scale, and target specific demographics with tailored messaging.",
    keyEvents: [
      "AI-generated profile pictures deployed",
      "Automated content generation scaled up",
      "Targeted demographic messaging refined"
    ]
  },
  {
    year: 2024,
    title: "Platform Vulnerability Exploitation",
    description: "Taking advantage of reduced content moderation on platforms like Twitter/X.",
    category: "Platform Exploitation",
    impact: "Global",
    details: "Following changes in content moderation policies on major platforms, CCP propaganda operations expanded their presence and influence, particularly on Twitter/X.",
    keyEvents: [
      "Massive account networks remain active",
      "Cross-platform coordination disrupted",
      "New narrative testing and refinement"
    ]
  }
];

const InteractiveTimeline = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ['All', 'Foundation', 'Domestic Campaign', 'Crisis Management', 'Soft Power', 'Strategic Shift', 'Digital Expansion', 'Crisis Response', 'Diplomatic Strategy', 'Geopolitical', 'Technological Evolution', 'Platform Exploitation'];

  const filteredData = filterCategory === 'All' 
    ? timelineData 
    : timelineData.filter(item => item.category === filterCategory);

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(filteredData.length - 1, currentIndex + 1));
  };

  const currentItem = filteredData[currentIndex];

  return (
    <div className="bg-card p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="mb-8">
        <h3 className="text-3xl font-bold mb-4">CCP Propaganda Evolution Timeline</h3>
        <p className="text-muted-foreground mb-6">
          Explore how Chinese Communist Party propaganda has evolved from domestic control 
          to global influence operations over the past 75 years.
        </p>
        
        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Filter by Category:</label>
          <select 
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentIndex(0);
            }}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Timeline Display */}
      <div className="space-y-8">
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            onClick={handlePrevious} 
            disabled={currentIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} of {filteredData.length}
            </div>
            <div className="text-2xl font-bold">{currentItem?.year}</div>
          </div>
          
          <Button 
            onClick={handleNext} 
            disabled={currentIndex === filteredData.length - 1}
            variant="outline"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Current Event Display */}
        <div className="border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <h4 className="text-2xl font-bold">{currentItem?.title}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`px-2 py-1 rounded text-xs ${
                    currentItem?.category === 'Foundation' ? 'bg-blue-100 text-blue-800' :
                    currentItem?.category === 'Crisis Response' ? 'bg-red-100 text-red-800' :
                    currentItem?.category === 'Soft Power' ? 'bg-green-100 text-green-800' :
                    currentItem?.category === 'Digital Expansion' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentItem?.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    currentItem?.impact === 'Domestic' ? 'bg-yellow-100 text-yellow-800' :
                    currentItem?.impact === 'International' ? 'bg-orange-100 text-orange-800' :
                    'bg-pink-100 text-pink-800'
                  }`}>
                    {currentItem?.impact} Impact
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-lg mb-4">{currentItem?.description}</p>
          
          <div className="bg-muted p-4 rounded-lg mb-4">
            <h5 className="font-semibold mb-2">Detailed Analysis:</h5>
            <p className="text-sm">{currentItem?.details}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-semibold mb-3 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Key Events:
            </h5>
            <ul className="space-y-1">
              {currentItem?.keyEvents.map((event, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {event}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline Progress Bar */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted transform -translate-y-1/2"></div>
          <div className="relative flex justify-between">
            {filteredData.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-4 h-4 rounded-full border-2 transition-colors ${
                  index === currentIndex 
                    ? 'bg-primary border-primary' 
                    : index < currentIndex 
                    ? 'bg-primary/50 border-primary/50' 
                    : 'bg-background border-muted-foreground'
                }`}
                title={`${item.year}: ${item.title}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {filteredData.map((item, index) => (
              <div key={index} className="text-xs text-center" style={{width: '16px'}}>
                {index % 2 === 0 && <div className="text-muted-foreground">{item.year}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">75+</div>
            <div className="text-sm text-blue-800">Years of Evolution</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">2016</div>
            <div className="text-sm text-red-800">Digital Expansion Began</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">Global</div>
            <div className="text-sm text-green-800">Current Reach</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTimeline;

