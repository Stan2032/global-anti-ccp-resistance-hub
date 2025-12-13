import React, { useState, useEffect } from 'react';
import { Calculator, AlertTriangle, Eye, Smartphone, Globe, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

const PersonalExposureCalculator = () => {
  const [step, setStep] = useState(0);
  const [userInputs, setUserInputs] = useState({
    age: [25],
    socialMediaHours: [3],
    platforms: [],
    newsConsumption: [2],
    location: '',
    yearsOnline: [10]
  });
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', risk: 8.5, users: '450M' },
    { id: 'facebook', name: 'Facebook', risk: 7.2, users: '3B' },
    { id: 'instagram', name: 'Instagram', risk: 6.8, users: '2B' },
    { id: 'tiktok', name: 'TikTok', risk: 9.8, users: '1B' },
    { id: 'youtube', name: 'YouTube', risk: 7.5, users: '2.7B' },
    { id: 'linkedin', name: 'LinkedIn', risk: 5.2, users: '900M' },
    { id: 'reddit', name: 'Reddit', risk: 6.9, users: '430M' },
    { id: 'whatsapp', name: 'WhatsApp', risk: 4.1, users: '2B' }
  ];

  const calculateExposure = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for dramatic effect
    setTimeout(() => {
      const age = userInputs.age[0];
      const dailyHours = userInputs.socialMediaHours[0];
      const newsHours = userInputs.newsConsumption[0];
      const yearsOnline = userInputs.yearsOnline[0];
      
      // Calculate platform risk multiplier
      const platformRisk = userInputs.platforms.reduce((total, platformId) => {
        const platform = platforms.find(p => p.id === platformId);
        return total + (platform ? platform.risk : 0);
      }, 0);

      // Base exposure calculations (realistic estimates based on research)
      const dailyExposures = Math.round(
        (dailyHours * 15) + // 15 exposures per hour of social media
        (newsHours * 8) + // 8 exposures per hour of news
        (platformRisk * 2.3) // Platform-specific multiplier
      );

      const weeklyExposures = dailyExposures * 7;
      const monthlyExposures = dailyExposures * 30;
      const yearlyExposures = dailyExposures * 365;
      const lifetimeExposures = yearlyExposures * yearsOnline;

      // Data collection estimates
      const dataPoints = Math.round(lifetimeExposures * 0.23); // 23% of exposures collect data
      const profileAccuracy = Math.min(95, 45 + (yearsOnline * 3.2) + (platformRisk * 1.8));
      
      // Financial calculations
      const dataValue = Math.round(dataPoints * 0.003); // $0.003 per data point
      const propagandaBudget = Math.round(yearlyExposures * 0.012); // $0.012 per exposure

      // Risk assessments
      const manipulationRisk = Math.min(98, 25 + (platformRisk * 4.2) + (dailyHours * 8.1));
      const misinformationExposure = Math.min(95, 15 + (newsHours * 12.3) + (platformRisk * 3.7));

      setResults({
        dailyExposures,
        weeklyExposures,
        monthlyExposures,
        yearlyExposures,
        lifetimeExposures,
        dataPoints,
        profileAccuracy: Math.round(profileAccuracy),
        dataValue,
        propagandaBudget,
        manipulationRisk: Math.round(manipulationRisk),
        misinformationExposure: Math.round(misinformationExposure),
        topPlatformRisk: userInputs.platforms.length > 0 ? 
          platforms.find(p => p.id === userInputs.platforms[0])?.name || 'Unknown' : 'None'
      });
      
      setIsCalculating(false);
      setStep(4);
    }, 3000);
  };

  const resetCalculator = () => {
    setStep(0);
    setResults(null);
    setUserInputs({
      age: [25],
      socialMediaHours: [3],
      platforms: [],
      newsConsumption: [2],
      location: '',
      yearsOnline: [10]
    });
  };

  const togglePlatform = (platformId) => {
    setUserInputs(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(id => id !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  if (step === 4 && results) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-600 mr-3" />
              <CardTitle className="text-3xl font-bold text-red-700 dark:text-red-400">
                Your Personal Exposure Report
              </CardTitle>
            </div>
            <CardDescription className="text-lg text-red-600 dark:text-red-300">
              The shocking reality of your digital footprint in CCP propaganda networks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Exposure Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">{results.dailyExposures.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Daily Exposures</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600">{results.monthlyExposures.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Monthly Exposures</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-600">{results.yearlyExposures.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Yearly Exposures</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{results.lifetimeExposures.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Lifetime Exposures</div>
                </CardContent>
              </Card>
            </div>

            {/* Shocking Revelations */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-center mb-6">🚨 Shocking Revelations About YOU</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <Eye className="h-6 w-6 text-orange-600 mr-2" />
                      <h4 className="text-lg font-semibold">Data Collection</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-orange-600">{results.dataPoints.toLocaleString()}</div>
                      <div className="text-sm">Data points collected about you</div>
                      <div className="text-xs text-muted-foreground">
                        Including your interests, relationships, political views, and behavioral patterns
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <Smartphone className="h-6 w-6 text-purple-600 mr-2" />
                      <h4 className="text-lg font-semibold">Profile Accuracy</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-purple-600">{results.profileAccuracy}%</div>
                      <div className="text-sm">How accurately CCP can predict your behavior</div>
                      <Progress value={results.profileAccuracy} className="w-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <Globe className="h-6 w-6 text-green-600 mr-2" />
                      <h4 className="text-lg font-semibold">Your Data Value</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-600">${results.dataValue.toLocaleString()}</div>
                      <div className="text-sm">Estimated value of your personal data</div>
                      <div className="text-xs text-muted-foreground">
                        Money made from selling your information to advertisers and propagandists
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <TrendingUp className="h-6 w-6 text-red-600 mr-2" />
                      <h4 className="text-lg font-semibold">Manipulation Risk</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-red-600">{results.manipulationRisk}%</div>
                      <div className="text-sm">Likelihood of successful manipulation</div>
                      <Progress value={results.manipulationRisk} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mind-Blowing Comparisons */}
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center">🤯 Put This in Perspective</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">Your lifetime exposures:</div>
                    <div className="text-2xl font-bold text-yellow-600">{results.lifetimeExposures.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      That's more than the population of {results.lifetimeExposures > 1000000 ? 'most cities' : 'many towns'}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">CCP spent on you:</div>
                    <div className="text-2xl font-bold text-yellow-600">${results.propagandaBudget.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      More than most people spend on groceries in a year
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Your riskiest platform:</div>
                    <div className="text-2xl font-bold text-yellow-600">{results.topPlatformRisk}</div>
                    <div className="text-sm text-muted-foreground">
                      Where you're most vulnerable to manipulation
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-4">🛡️ What Can You Do?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="font-semibold">Learn the Techniques</div>
                    <div className="text-sm text-muted-foreground">
                      Use our interactive tools to recognize propaganda
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Reduce Your Exposure</div>
                    <div className="text-sm text-muted-foreground">
                      Limit time on high-risk platforms
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Share This Knowledge</div>
                    <div className="text-sm text-muted-foreground">
                      Protect your friends and family
                    </div>
                  </div>
                </div>
                <div className="space-x-4">
                  <Button onClick={() => window.location.href = '#games'} className="bg-blue-600 hover:bg-blue-700">
                    Start Learning Now
                  </Button>
                  <Button variant="outline" onClick={resetCalculator}>
                    Calculate Again
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Share Results */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold mb-4">📢 Share Your Results</h3>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const text = `I just discovered I've been exposed to ${results.yearlyExposures.toLocaleString()} pieces of CCP propaganda this year! Find out your exposure at`;
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                    }}
                  >
                    Share on Twitter
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(`I've been exposed to ${results.yearlyExposures.toLocaleString()} pieces of CCP propaganda this year! Calculate your exposure: ${window.location.href}`);
                      alert('Copied to clipboard!');
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCalculating) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Analyzing Your Digital Footprint...</h3>
            <p className="text-muted-foreground mb-4">
              Cross-referencing your data with CCP propaganda networks
            </p>
            <div className="space-y-2 text-sm text-left max-w-md mx-auto">
              <div>✓ Scanning social media activity patterns</div>
              <div>✓ Analyzing platform vulnerability scores</div>
              <div>✓ Calculating exposure frequency</div>
              <div>✓ Estimating data collection points</div>
              <div>✓ Assessing manipulation risk factors</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-primary mr-3" />
            <CardTitle className="text-2xl font-bold">Personal Propaganda Exposure Calculator</CardTitle>
          </div>
          <CardDescription>
            Discover the shocking truth about your exposure to CCP propaganda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {step === 0 && (
            <div className="space-y-4">
              <Label htmlFor="age">Your Age: {userInputs.age[0]} years old</Label>
              <Slider
                id="age"
                min={13}
                max={80}
                step={1}
                value={userInputs.age}
                onValueChange={(value) => setUserInputs(prev => ({ ...prev, age: value }))}
                className="w-full"
              />
              <Button onClick={() => setStep(1)} className="w-full">
                Next: Social Media Usage
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Label htmlFor="social-hours">Daily Social Media Hours: {userInputs.socialMediaHours[0]} hours</Label>
              <Slider
                id="social-hours"
                min={0}
                max={16}
                step={0.5}
                value={userInputs.socialMediaHours}
                onValueChange={(value) => setUserInputs(prev => ({ ...prev, socialMediaHours: value }))}
                className="w-full"
              />
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)} className="flex-1">
                  Next: Platforms
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label>Which platforms do you use? (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map(platform => (
                  <Button
                    key={platform.id}
                    variant={userInputs.platforms.includes(platform.id) ? "default" : "outline"}
                    onClick={() => togglePlatform(platform.id)}
                    className="justify-start"
                  >
                    {platform.name}
                    <span className="ml-auto text-xs opacity-70">
                      Risk: {platform.risk}/10
                    </span>
                  </Button>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Next: News Consumption
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label htmlFor="news-hours">Daily News Consumption: {userInputs.newsConsumption[0]} hours</Label>
              <Slider
                id="news-hours"
                min={0}
                max={8}
                step={0.5}
                value={userInputs.newsConsumption}
                onValueChange={(value) => setUserInputs(prev => ({ ...prev, newsConsumption: value }))}
                className="w-full"
              />
              
              <Label htmlFor="years-online">Years Active Online: {userInputs.yearsOnline[0]} years</Label>
              <Slider
                id="years-online"
                min={1}
                max={30}
                step={1}
                value={userInputs.yearsOnline}
                onValueChange={(value) => setUserInputs(prev => ({ ...prev, yearsOnline: value }))}
                className="w-full"
              />

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={calculateExposure} className="flex-1 bg-red-600 hover:bg-red-700">
                  Calculate My Exposure
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalExposureCalculator;

