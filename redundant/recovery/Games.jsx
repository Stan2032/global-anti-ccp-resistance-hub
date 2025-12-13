import React, { useState } from 'react';
import { Gamepad2, Target, Search, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SpotTheBot from '../games/SpotTheBot';
import NarrativeDetective from '../games/NarrativeDetective';
import PropagandaTechniques from '../games/PropagandaTechniques';

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'spot-the-bot',
      title: 'Spot the Bot',
      description: 'Learn to identify fake accounts used in CCP propaganda campaigns by analyzing profile characteristics, posting patterns, and content.',
      icon: Target,
      difficulty: 'Beginner',
      duration: '10-15 minutes',
      skills: ['Account Analysis', 'Pattern Recognition', 'Bot Detection'],
      component: SpotTheBot
    },
    {
      id: 'narrative-detective',
      title: 'Narrative Detective',
      description: 'Trace how propaganda narratives evolve over time by arranging timeline events in chronological order.',
      icon: Search,
      difficulty: 'Intermediate',
      duration: '15-20 minutes',
      skills: ['Timeline Analysis', 'Narrative Tracking', 'Critical Thinking'],
      component: NarrativeDetective
    },
    {
      id: 'propaganda-techniques',
      title: 'Propaganda Techniques',
      description: 'Master the identification of 50+ propaganda techniques used in CCP messaging through interactive learning and quizzes.',
      icon: Brain,
      difficulty: 'Advanced',
      duration: '20-30 minutes',
      skills: ['Technique Recognition', 'Logical Fallacies', 'Media Literacy'],
      component: PropagandaTechniques
    }
  ];

  if (activeGame) {
    const GameComponent = games.find(g => g.id === activeGame)?.component;
    return (
      <section id="games" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button 
              onClick={() => setActiveGame(null)}
              variant="outline"
              className="mb-4"
            >
              ← Back to Games Menu
            </Button>
          </div>
          {GameComponent && <GameComponent />}
        </div>
      </section>
    );
  }

  return (
    <section id="games" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold">Interactive Learning Tools</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Master the art of propaganda detection through hands-on interactive experiences. 
            These tools are based on real CCP propaganda techniques and campaigns, designed 
            to build your media literacy skills progressively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <div key={game.id} className="bg-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{game.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs ${
                          game.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          game.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {game.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">{game.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-2">Skills You'll Learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {game.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setActiveGame(game.id)}
                    className="w-full"
                  >
                    Start Game
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-muted p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-center">Why Interactive Learning?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Active Learning</h4>
              <p className="text-sm text-muted-foreground">
                Hands-on practice is more effective than passive reading for developing 
                critical thinking skills and pattern recognition.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Real Examples</h4>
              <p className="text-sm text-muted-foreground">
                All games use authentic CCP propaganda examples and techniques, 
                providing practical experience with actual disinformation tactics.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Progressive Difficulty</h4>
              <p className="text-sm text-muted-foreground">
                Start with basic concepts and gradually advance to complex propaganda 
                analysis, building expertise step by step.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-4xl mx-auto">
            <h4 className="font-bold text-yellow-800 mb-2">Educational Purpose</h4>
            <p className="text-sm text-yellow-700">
              These games are designed for educational purposes to help people recognize and 
              resist propaganda techniques. Understanding how manipulation works is the first 
              step in building resilience against it. All examples are based on documented 
              cases and academic research.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Games;

