import React, { useState } from 'react';
import { Clock, BarChart3, Calculator, AlertTriangle, History, TrendingUp, Globe, Brain, Share2, Activity } from 'lucide-react';
import InteractiveTimeline from '../interactive/InteractiveTimeline';
import PersonalExposureCalculator from '../interactive/PersonalExposureCalculator';
import MemoryPalace from '../interactive/MemoryPalace';
import ShareableContent from '../viral/ShareableContent';
import RealTimeStats from '../viral/RealTimeStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Interactive = () => {
  const [activeView, setActiveView] = useState('overview');

  if (activeView === 'timeline') {
    return (
      <section id="interactive" className="section-spacing bg-muted/30">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setActiveView('overview')}
              className="mb-4"
            >
              ← Back to Interactive Overview
            </Button>
          </div>
          <InteractiveTimeline />
        </div>
      </section>
    );
  }

  if (activeView === 'sharing') {
    return (
      <section id="interactive" className="section-spacing bg-muted/30">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setActiveView('overview')}
              className="mb-4"
            >
              ← Back to Interactive Overview
            </Button>
          </div>
          <ShareableContent />
        </div>
      </section>
    );
  }

  if (activeView === 'stats') {
    return (
      <section id="interactive" className="section-spacing bg-muted/30">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setActiveView('overview')}
              className="mb-4"
            >
              ← Back to Interactive Overview
            </Button>
          </div>
          <RealTimeStats />
        </div>
      </section>
    );
  }

  if (activeView === 'memory-palace') {
    return (
      <section id="interactive" className="section-spacing bg-muted/30">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setActiveView('overview')}
              className="mb-4"
            >
              ← Back to Interactive Overview
            </Button>
          </div>
          <MemoryPalace />
        </div>
      </section>
    );
  }

  return (
    <section id="interactive" className="section-spacing bg-muted/30">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold">Interactive Analysis</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
            Explore the evolution of CCP propaganda through interactive visualizations and data-driven analysis. 
            Understand how tactics have changed over time and discover your personal exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-12">
          
          {/* Personal Exposure Calculator - Featured */}
          <Card className="card-hover animate-slide-up border-red-200 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
              🔥 NEW
            </div>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Calculator className="h-6 w-6 text-red-600 mr-2" />
                <CardTitle className="text-xl">Personal Exposure Calculator</CardTitle>
              </div>
              <CardDescription>
                <div className="flex items-center text-red-600 dark:text-red-400 font-medium">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Shocking Personal Results
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Discover the shocking truth about YOUR personal exposure to CCP propaganda.</strong> 
                Calculate how many times you've been targeted, how much your data is worth, 
                and your vulnerability to manipulation.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground mb-4 bg-white/50 dark:bg-black/20 p-3 rounded">
                <div>🎯 Analyze your social media usage patterns</div>
                <div>💰 Calculate your personal data value</div>
                <div>⚠️ Assess your manipulation risk score</div>
                <div>🛡️ Get personalized protection recommendations</div>
              </div>
              <Button 
                onClick={() => setActiveView('calculator')} 
                className="w-full bg-red-600 hover:bg-red-700 interactive-element text-white font-semibold"
              >
                Calculate My Exposure
                <Calculator className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Memory Palace System - Featured */}
          <Card className="card-hover animate-slide-up border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
              🧠 NEW
            </div>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Brain className="h-6 w-6 text-purple-600 mr-2" />
                <CardTitle className="text-xl">Memory Palace System</CardTitle>
              </div>
              <CardDescription>
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium">
                  <Brain className="h-4 w-4 mr-1" />
                  Unforgettable Learning
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Navigate through virtual rooms to build unforgettable mental models.</strong> 
                Use spatial memory techniques to master propaganda detection through immersive storytelling 
                and visual anchors that stick in your mind forever.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground mb-4 bg-white/50 dark:bg-black/20 p-3 rounded">
                <div>🏛️ 8 themed rooms with unique stories</div>
                <div>🎭 Visual anchors for each technique</div>
                <div>🧠 Spatial memory for permanent retention</div>
                <div>🎯 Progressive skill unlocking system</div>
              </div>
              <Button 
                onClick={() => setActiveView('memory-palace')} 
                className="w-full bg-purple-600 hover:bg-purple-700 interactive-element text-white font-semibold"
              >
                Enter Memory Palace
                <Brain className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Timeline Analysis */}
          <Card className="card-hover animate-slide-up">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Clock className="h-6 w-6 text-primary mr-2" />
                <CardTitle className="text-xl">CCP Propaganda Evolution Timeline</CardTitle>
              </div>
              <CardDescription>
                Interactive Historical Analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Explore how Chinese Communist Party propaganda has evolved from domestic control 
                to global influence operations over the past 75 years.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground mb-4 bg-muted/50 p-3 rounded">
                <div>📅 75+ years of propaganda evolution</div>
                <div>🔍 Filter by categories and time periods</div>
                <div>📊 Detailed analysis of each milestone</div>
                <div>🖱️ Interactive navigation and exploration</div>
              </div>
              <Button 
                onClick={() => setActiveView('timeline')} 
                className="w-full interactive-element"
              >
                Explore Timeline
                <Clock className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Viral Sharing Generator - Featured */}
          <Card className="card-hover animate-slide-up border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-bold">
              🔥 VIRAL
            </div>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Share2 className="h-6 w-6 text-orange-600 mr-2" />
                <CardTitle className="text-xl">Viral Content Generator</CardTitle>
              </div>
              <CardDescription>
                <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium">
                  <Share2 className="h-4 w-4 mr-1" />
                  Spread Awareness
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Create shareable content that goes viral.</strong> 
                Generate shocking statistics, personal impact stories, and visual content 
                optimized for maximum social media engagement and awareness spread.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground mb-4 bg-white/50 dark:bg-black/20 p-3 rounded">
                <div>🚨 Shocking personal statistics</div>
                <div>📱 Social media optimized content</div>
                <div>🎨 Downloadable viral images</div>
                <div>🔥 Pre-written viral templates</div>
              </div>
              <Button 
                onClick={() => setActiveView('sharing')} 
                className="w-full bg-orange-600 hover:bg-orange-700 interactive-element text-white font-semibold"
              >
                Create Viral Content
                <Share2 className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Real-Time Global Stats - Featured */}
          <Card className="card-hover animate-slide-up border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
              📊 LIVE
            </div>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Activity className="h-6 w-6 text-green-600 mr-2" />
                <CardTitle className="text-xl">Global Impact Dashboard</CardTitle>
              </div>
              <CardDescription>
                <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                  <Activity className="h-4 w-4 mr-1" />
                  Real-Time Stats
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>See the global fight against propaganda in real-time.</strong> 
                Live statistics, user activity, milestone progress, and social proof 
                showing the worldwide movement building propaganda resistance.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground mb-4 bg-white/50 dark:bg-black/20 p-3 rounded">
                <div>🌍 Live global user activity</div>
                <div>📈 Real-time milestone tracking</div>
                <div>👥 Social proof and engagement</div>
                <div>🎯 Impact measurement metrics</div>
              </div>
              <Button 
                onClick={() => setActiveView('stats')} 
                className="w-full bg-green-600 hover:bg-green-700 interactive-element text-white font-semibold"
              >
                View Live Dashboard
                <Activity className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Shocking Statistics Preview */}
        <Card className="mb-8 animate-slide-up border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🚨 Did You Know?</CardTitle>
            <CardDescription>Shocking facts about CCP propaganda reach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="text-3xl font-bold text-yellow-600">$10B+</div>
                <div className="text-sm text-muted-foreground">Annual propaganda budget</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-orange-600">4.8B</div>
                <div className="text-sm text-muted-foreground">People reached daily</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-red-600">1.4B</div>
                <div className="text-sm text-muted-foreground">Fake accounts removed in 2023</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-muted-foreground">Operations across 12 time zones</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evolution Patterns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="card-hover animate-slide-up">
            <CardHeader>
              <div className="flex items-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary mr-2" />
                <CardTitle>Evolution Patterns</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                CCP propaganda has evolved from simple domestic control to sophisticated 
                global influence operations using cutting-edge technology.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">Domestic Focus</span>
                  <span className="text-sm text-muted-foreground">1949-1980s</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">International Expansion</span>
                  <span className="text-sm text-muted-foreground">1990s-2010s</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                  <span className="font-medium">Digital Warfare</span>
                  <span className="text-sm font-medium">2016-Present</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover animate-slide-up">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Globe className="h-6 w-6 text-primary mr-2" />
                <CardTitle>Global Reach</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Modern CCP propaganda operations span multiple platforms, languages, 
                and target audiences worldwide.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">Active Platforms</span>
                  <span className="text-lg font-bold text-primary">50+</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">Languages</span>
                  <span className="text-lg font-bold text-primary">40+</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">Countries Targeted</span>
                  <span className="text-lg font-bold text-primary">100+</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover animate-slide-up">
            <CardHeader>
              <div className="flex items-center mb-2">
                <History className="h-6 w-6 text-primary mr-2" />
                <CardTitle>Key Milestones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Critical moments that shaped the development of CCP propaganda 
                from domestic tool to global influence operation.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">First Crisis Response</span>
                  <span className="text-sm text-muted-foreground">Tiananmen 1989</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">Digital Expansion</span>
                  <span className="text-sm text-muted-foreground">Social Media 2016</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                  <span className="font-medium">AI Integration</span>
                  <span className="text-sm font-medium">Bot Networks 2023</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Understanding Guide */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-center">Understanding the Interactive Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Calculator className="h-4 w-4 mr-2 text-red-600" />
                  How to Use the Personal Calculator
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Answer questions about your digital habits honestly</li>
                  <li>• Review your shocking personal exposure statistics</li>
                  <li>• Understand your vulnerability and data value</li>
                  <li>• Get personalized recommendations for protection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  How to Use the Timeline
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Click on timeline points to explore specific periods</li>
                  <li>• Use category filters to focus on particular aspects</li>
                  <li>• Navigate with arrow buttons or click directly on events</li>
                  <li>• Pay attention to the shift from domestic to international focus</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">💡 Pro Tip</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Start with the Personal Exposure Calculator to understand your individual risk, 
                then explore the timeline to see how these techniques evolved over time. 
                This combination provides both personal relevance and historical context.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Interactive;

