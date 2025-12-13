import React, { useState, useEffect } from 'react';
import { 
  Home, ArrowLeft, ArrowRight, Eye, Brain, Shield, 
  Zap, Target, Users, MessageSquare, TrendingUp, 
  AlertTriangle, CheckCircle, Lock, Unlock,
  ChevronLeft, ChevronRight, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const MemoryPalace = () => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [visitedRooms, setVisitedRooms] = useState(new Set([0]));
  const [unlockedTechniques, setUnlockedTechniques] = useState(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  const rooms = [
    {
      id: 0,
      name: "The Entrance Hall",
      theme: "Welcome & Overview",
      color: "bg-gradient-to-br from-blue-500 to-purple-600",
      icon: Home,
      description: "Your journey into the world of propaganda detection begins here",
      techniques: [],
      story: "You stand in a grand digital hall with mirrors on every wall. Each mirror reflects a different version of 'truth' - some clear, some distorted. This is where you'll learn to tell the difference.",
      visualAnchor: "🏛️ A hall of mirrors showing different versions of reality",
      nextRoomHint: "Enter the Emotion Chamber to learn how feelings are weaponized..."
    },
    {
      id: 1,
      name: "The Emotion Chamber",
      theme: "Emotional Manipulation",
      color: "bg-gradient-to-br from-red-500 to-orange-500",
      icon: Zap,
      description: "Where emotions are weaponized to bypass rational thinking",
      techniques: [
        {
          name: "Fear Appeals",
          description: "Creating anxiety to make people accept solutions without thinking",
          example: "CCP: 'Western democracy will destroy your family values'",
          memoryAnchor: "🔥 A room filled with alarm bells and red warning lights",
          counter: "Ask: What specific evidence supports this fear? Who benefits from my anxiety?"
        },
        {
          name: "Anger Amplification", 
          description: "Stoking outrage to prevent calm analysis",
          example: "CCP: 'The West is deliberately trying to humiliate China'",
          memoryAnchor: "⚡ Lightning bolts of rage crackling through the air",
          counter: "Pause when angry. Ask: Is this emotion helping me think clearly?"
        },
        {
          name: "False Hope",
          description: "Promising unrealistic outcomes to gain support",
          example: "CCP: 'Only our system can bring true prosperity to all'",
          memoryAnchor: "🌈 Fake rainbows that disappear when you get close",
          counter: "Question: What's the track record? What are the real costs?"
        }
      ],
      story: "The walls pulse with red heat. Emotional triggers float like sparks in the air. Here you learn that propaganda targets your heart first, your head second.",
      visualAnchor: "🔥 A chamber where emotions burn like fire - beautiful but dangerous",
      nextRoomHint: "Cool down in the Logic Laboratory where reason is twisted..."
    },
    {
      id: 2,
      name: "The Logic Laboratory",
      theme: "Logical Fallacies",
      color: "bg-gradient-to-br from-green-500 to-teal-500",
      icon: Brain,
      description: "Where logical thinking is corrupted and twisted",
      techniques: [
        {
          name: "False Dilemma",
          description: "Presenting only two options when many exist",
          example: "CCP: 'You're either with China's peaceful rise or you support Western aggression'",
          memoryAnchor: "⚖️ Broken scales that only have two weights",
          counter: "Ask: What other options exist? Who says these are the only choices?"
        },
        {
          name: "Whataboutism",
          description: "Deflecting criticism by pointing to others' flaws",
          example: "CCP: 'What about America's human rights violations?'",
          memoryAnchor: "🪞 Mirrors that only reflect other people's problems",
          counter: "Stay focused: 'That's a separate issue. Let's address this one first.'"
        },
        {
          name: "Appeal to Authority",
          description: "Using fake or irrelevant expertise to support claims",
          example: "CCP: 'Leading scientists agree that our COVID response was perfect'",
          memoryAnchor: "👨‍🔬 Lab coats hanging on mannequins with no heads",
          counter: "Check: Are these real experts? Are they qualified in this specific area?"
        }
      ],
      story: "Test tubes bubble with twisted logic. Equations on the walls don't add up. This is where you learn that even 'logical' arguments can be poisoned.",
      visualAnchor: "🧪 A laboratory where logic experiments have gone horribly wrong",
      nextRoomHint: "Enter the Identity Forge where your sense of self is molded..."
    },
    {
      id: 3,
      name: "The Identity Forge",
      theme: "Identity & Belonging",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      icon: Users,
      description: "Where your sense of identity and belonging is shaped",
      techniques: [
        {
          name: "In-Group Favoritism",
          description: "Making you feel special for belonging to the 'right' group",
          example: "CCP: 'True patriots support China's righteous cause'",
          memoryAnchor: "👑 Golden crowns that only fit 'chosen' people",
          counter: "Question: Am I being manipulated through my desire to belong?"
        },
        {
          name: "Us vs Them",
          description: "Creating artificial divisions between groups",
          example: "CCP: 'The West wants to keep Asia divided and weak'",
          memoryAnchor: "⚔️ Battle lines drawn through families and friendships",
          counter: "Look for: What do we have in common? Who benefits from this division?"
        },
        {
          name: "Virtue Signaling",
          description: "Making you prove loyalty through public displays",
          example: "CCP: 'Real Chinese people defend the motherland online'",
          memoryAnchor: "🎭 Masks that change based on who's watching",
          counter: "Ask: Am I acting from genuine belief or social pressure?"
        }
      ],
      story: "Mirrors show different versions of yourself. Flags and symbols shift and change. Here you learn how propaganda shapes who you think you are.",
      visualAnchor: "🏭 A forge where identities are hammered into shape on an anvil",
      nextRoomHint: "Navigate to the Information Maze where truth gets lost..."
    },
    {
      id: 4,
      name: "The Information Maze",
      theme: "Information Control",
      color: "bg-gradient-to-br from-yellow-500 to-amber-500",
      icon: MessageSquare,
      description: "Where information is controlled, filtered, and distorted",
      techniques: [
        {
          name: "Selective Reporting",
          description: "Showing only facts that support your narrative",
          example: "CCP: Reports economic growth but hides debt and environmental costs",
          memoryAnchor: "📰 Newspapers with holes cut out where inconvenient facts should be",
          counter: "Ask: What information is missing? What's the full picture?"
        },
        {
          name: "Flooding the Zone",
          description: "Overwhelming people with so much information they give up",
          example: "CCP: Releases dozens of contradictory COVID origin theories",
          memoryAnchor: "🌊 Tsunami of papers and screens drowning everything",
          counter: "Focus: What are the most credible sources? What do experts agree on?"
        },
        {
          name: "Source Laundering",
          description: "Making propaganda look like independent journalism",
          example: "CCP: Funds 'think tanks' that publish pro-China research",
          memoryAnchor: "🧺 Dirty laundry being washed to look clean",
          counter: "Trace: Who funded this? What are their motivations?"
        }
      ],
      story: "Paths twist and turn. Signs point in all directions. Information flows like water through channels that lead wherever the architects want.",
      visualAnchor: "🌀 A maze where every path leads to a different version of 'truth'",
      nextRoomHint: "Climb to the Influence Observatory to see the bigger picture..."
    },
    {
      id: 5,
      name: "The Influence Observatory",
      theme: "Scale & Networks",
      color: "bg-gradient-to-br from-indigo-500 to-blue-600",
      icon: TrendingUp,
      description: "Where you see the massive scale of influence operations",
      techniques: [
        {
          name: "Astroturfing",
          description: "Creating fake grassroots movements",
          example: "CCP: Thousands of fake accounts supporting Belt and Road Initiative",
          memoryAnchor: "🌱 Plastic grass that looks real from a distance",
          counter: "Check: Are these real people? Do they have authentic histories?"
        },
        {
          name: "Coordinated Inauthentic Behavior",
          description: "Multiple fake accounts acting in perfect synchronization",
          example: "CCP: Bot networks sharing identical posts within minutes",
          memoryAnchor: "🤖 Robot orchestra playing the same song in perfect unison",
          counter: "Look for: Identical timing, similar language patterns, fake profiles"
        },
        {
          name: "Influence Laundering",
          description: "Using respected institutions to spread propaganda",
          example: "CCP: Funding university programs that promote positive China narratives",
          memoryAnchor: "🏛️ Prestigious buildings with hidden puppet strings",
          counter: "Research: Who funds this institution? What are the conditions?"
        }
      ],
      story: "From this high tower, you see the vast network of influence spreading like a web across the digital world. The scale is breathtaking and terrifying.",
      visualAnchor: "🔭 A telescope revealing the invisible web of influence across the globe",
      nextRoomHint: "Descend to the Defense Arsenal to learn protection techniques..."
    },
    {
      id: 6,
      name: "The Defense Arsenal",
      theme: "Protection & Counter-Techniques",
      color: "bg-gradient-to-br from-emerald-500 to-green-600",
      icon: Shield,
      description: "Where you arm yourself with tools to resist manipulation",
      techniques: [
        {
          name: "The Pause Protocol",
          description: "Stop and think before reacting to emotional content",
          example: "When you feel angry or afraid, count to 10 and ask 'Why am I feeling this?'",
          memoryAnchor: "⏸️ A giant pause button that glows when emotions run high",
          counter: "Practice: Pause → Breathe → Question → Verify → Decide"
        },
        {
          name: "Source Triangulation",
          description: "Check multiple independent sources before believing",
          example: "Don't trust one article - find 3 different credible sources",
          memoryAnchor: "📐 A triangle that only forms when you have three solid points",
          counter: "Rule: One source = rumor, Two sources = possible, Three sources = likely"
        },
        {
          name: "The Motivation Question",
          description: "Always ask who benefits from you believing this",
          example: "Who gains power, money, or influence if I accept this narrative?",
          memoryAnchor: "💰 A scale that weighs who profits from your belief",
          counter: "Ask: Cui bono? (Who benefits?) Follow the incentives."
        }
      ],
      story: "Weapons of critical thinking line the walls. Shields of skepticism hang ready. Here you forge the mental armor that will protect you in the information wars.",
      visualAnchor: "⚔️ An armory where critical thinking tools shine like polished weapons",
      nextRoomHint: "Complete your journey in the Mastery Chamber..."
    },
    {
      id: 7,
      name: "The Mastery Chamber",
      theme: "Integration & Mastery",
      color: "bg-gradient-to-br from-gold-500 to-yellow-500",
      icon: Target,
      description: "Where all techniques come together in perfect understanding",
      techniques: [
        {
          name: "Pattern Recognition",
          description: "Instantly spotting propaganda techniques in the wild",
          example: "Seeing emotional manipulation, logical fallacies, and source issues simultaneously",
          memoryAnchor: "🎯 A target where all the rings align perfectly",
          counter: "Trust your trained instincts - if it feels like manipulation, investigate"
        },
        {
          name: "Teaching Others",
          description: "The ultimate test - can you explain it to someone else?",
          example: "Share your knowledge to create a network of propaganda-resistant people",
          memoryAnchor: "🌟 Light that multiplies when shared with others",
          counter: "Teach one person = protect ten people through network effects"
        }
      ],
      story: "Golden light fills this final chamber. All the techniques you've learned swirl together in perfect harmony. You are now a master of propaganda detection.",
      visualAnchor: "👑 A crown of knowledge that makes you immune to manipulation",
      nextRoomHint: "You have completed your journey. Share your wisdom with the world."
    }
  ];

  const navigateToRoom = (roomIndex) => {
    if (roomIndex < 0 || roomIndex >= rooms.length) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentRoom(roomIndex);
      setVisitedRooms(prev => new Set([...prev, roomIndex]));
      setIsTransitioning(false);
    }, 300);
  };

  const unlockTechnique = (techniqueIndex) => {
    const techniqueId = `${currentRoom}-${techniqueIndex}`;
    setUnlockedTechniques(prev => new Set([...prev, techniqueId]));
  };

  const resetJourney = () => {
    setCurrentRoom(0);
    setVisitedRooms(new Set([0]));
    setUnlockedTechniques(new Set());
  };

  const room = rooms[currentRoom];
  const progress = ((visitedRooms.size) / rooms.length) * 100;
  const totalTechniques = rooms.reduce((sum, room) => sum + room.techniques.length, 0);
  const unlockedCount = unlockedTechniques.size;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      
      {/* Header with Progress */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-primary mr-3" />
            <CardTitle className="text-3xl font-bold">Memory Palace: Propaganda Detection Mastery</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Navigate through virtual rooms to build unforgettable mental models for detecting propaganda
          </CardDescription>
          
          <div className="flex items-center justify-center space-x-8 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{visitedRooms.size}/{rooms.length}</div>
              <div className="text-sm text-muted-foreground">Rooms Explored</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{unlockedCount}/{totalTechniques}</div>
              <div className="text-sm text-muted-foreground">Techniques Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
              <div className="text-sm text-muted-foreground">Journey Complete</div>
            </div>
          </div>
          
          <Progress value={progress} className="w-full max-w-md mx-auto mt-4" />
        </CardHeader>
      </Card>

      {/* Main Room Display */}
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <Card className={`${room.color} text-white border-0 shadow-2xl`}>
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <room.icon className="h-12 w-12 mr-4" />
              <div>
                <CardTitle className="text-4xl font-bold">{room.name}</CardTitle>
                <CardDescription className="text-white/80 text-lg mt-2">
                  {room.description}
                </CardDescription>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {room.theme}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Room Story */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold mb-3">🎭 The Story</h3>
              <p className="text-lg leading-relaxed">{room.story}</p>
              <div className="mt-4 text-xl font-semibold">
                {room.visualAnchor}
              </div>
            </div>

            {/* Techniques */}
            {room.techniques.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {room.techniques.map((technique, index) => {
                  const techniqueId = `${currentRoom}-${index}`;
                  const isUnlocked = unlockedTechniques.has(techniqueId);
                  
                  return (
                    <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{technique.name}</CardTitle>
                          {isUnlocked ? (
                            <Unlock className="h-5 w-5 text-green-400" />
                          ) : (
                            <Lock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{technique.description}</p>
                        
                        {!isUnlocked ? (
                          <Button 
                            onClick={() => unlockTechnique(index)}
                            variant="secondary"
                            size="sm"
                            className="w-full"
                          >
                            Unlock Technique
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <div className="bg-red-500/20 p-3 rounded border border-red-400/30">
                              <h5 className="font-semibold text-red-200 mb-1">Example:</h5>
                              <p className="text-sm text-red-100">{technique.example}</p>
                            </div>
                            
                            <div className="bg-blue-500/20 p-3 rounded border border-blue-400/30">
                              <h5 className="font-semibold text-blue-200 mb-1">Memory Anchor:</h5>
                              <p className="text-sm text-blue-100">{technique.memoryAnchor}</p>
                            </div>
                            
                            <div className="bg-green-500/20 p-3 rounded border border-green-400/30">
                              <h5 className="font-semibold text-green-200 mb-1">Counter-Technique:</h5>
                              <p className="text-sm text-green-100">{technique.counter}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Navigation Hint */}
            {room.nextRoomHint && currentRoom < rooms.length - 1 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <p className="text-lg font-medium">{room.nextRoomHint}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigateToRoom(currentRoom - 1)}
              disabled={currentRoom === 0}
              variant="outline"
              size="lg"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous Room
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                onClick={resetJourney}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Restart Journey
              </Button>
              
              <Button
                onClick={() => window.location.href = '#games'}
                variant="secondary"
                size="lg"
              >
                <Target className="h-5 w-5 mr-2" />
                Practice Skills
              </Button>
            </div>

            <Button
              onClick={() => navigateToRoom(currentRoom + 1)}
              disabled={currentRoom === rooms.length - 1}
              size="lg"
            >
              Next Room
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Room Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Palace Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-2">
            {rooms.map((mapRoom, index) => {
              const isVisited = visitedRooms.has(index);
              const isCurrent = currentRoom === index;
              
              return (
                <Button
                  key={index}
                  onClick={() => navigateToRoom(index)}
                  variant={isCurrent ? "default" : isVisited ? "secondary" : "outline"}
                  size="sm"
                  className={`${isCurrent ? 'ring-2 ring-primary' : ''}`}
                >
                  <mapRoom.icon className="h-4 w-4 mr-2" />
                  {mapRoom.name}
                  {isVisited && <CheckCircle className="h-3 w-3 ml-2" />}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Completion Celebration */}
      {visitedRooms.size === rooms.length && (
        <Card className="border-2 border-gold-400 bg-gradient-to-r from-yellow-50 to-gold-50 dark:from-yellow-950/20 dark:to-gold-950/20">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gold-700 dark:text-gold-300 mb-4">
              Congratulations, Propaganda Detection Master!
            </h2>
            <p className="text-lg text-gold-600 dark:text-gold-400 mb-6">
              You have completed your journey through the Memory Palace. You now possess the mental tools 
              to recognize and resist propaganda in all its forms. Share your knowledge to protect others!
            </p>
            <div className="space-x-4">
              <Button size="lg" className="bg-gold-600 hover:bg-gold-700">
                <Users className="h-5 w-5 mr-2" />
                Share Your Mastery
              </Button>
              <Button size="lg" variant="outline">
                <Target className="h-5 w-5 mr-2" />
                Test Your Skills
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemoryPalace;

