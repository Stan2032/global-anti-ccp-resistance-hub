import React, { useState, useEffect } from 'react';
import { 
  Home, Info, History, BarChart3, Wrench, Target, 
  MessageSquare, TrendingUp, Shield, CheckCircle,
  Calculator, Brain, ChevronLeft, ChevronRight,
  Menu, X, Share2, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HorizontalNav = ({ activeSection, onSectionChange, completedSections = new Set() }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const sections = [
    { 
      id: 'hero', 
      name: 'Welcome', 
      icon: Home, 
      color: 'bg-blue-500', 
      description: 'Start your journey',
      category: 'intro'
    },
    { 
      id: 'introduction', 
      name: 'Overview', 
      icon: Info, 
      color: 'bg-indigo-500', 
      description: 'Understanding the threat',
      category: 'intro'
    },
    { 
      id: 'background', 
      name: 'History', 
      icon: History, 
      color: 'bg-purple-500', 
      description: 'Evolution of propaganda',
      category: 'learn'
    },
    { 
      id: 'calculator', 
      name: 'Your Exposure', 
      icon: Calculator, 
      color: 'bg-red-500', 
      description: 'Personal impact calculator',
      category: 'interactive',
      featured: true
    },
    { 
      id: 'memory-palace', 
      name: 'Memory Palace', 
      icon: Brain, 
      color: 'bg-purple-600', 
      description: 'Learn through spatial memory',
      category: 'interactive',
      featured: true
    },
    { 
      id: 'sharing', 
      name: 'Viral Content', 
      icon: Share2, 
      color: 'bg-orange-500', 
      description: 'Create shareable awareness',
      category: 'interactive',
      featured: true
    },
    { 
      id: 'stats', 
      name: 'Live Stats', 
      icon: Activity, 
      color: 'bg-green-500', 
      description: 'Real-time global impact',
      category: 'interactive',
      featured: true
    },
    { 
      id: 'interactive', 
      name: 'Timeline', 
      icon: BarChart3, 
      color: 'bg-green-500', 
      description: 'Interactive analysis',
      category: 'interactive'
    },
    { 
      id: 'scale', 
      name: 'Scale', 
      icon: TrendingUp, 
      color: 'bg-orange-500', 
      description: 'Massive global reach',
      category: 'learn'
    },
    { 
      id: 'techniques', 
      name: 'Techniques', 
      icon: Wrench, 
      color: 'bg-yellow-500', 
      description: 'How they manipulate',
      category: 'learn'
    },
    { 
      id: 'games', 
      name: 'Practice', 
      icon: Target, 
      color: 'bg-pink-500', 
      description: 'Interactive learning tools',
      category: 'interactive'
    },
    { 
      id: 'narratives', 
      name: 'Narratives', 
      icon: MessageSquare, 
      color: 'bg-cyan-500', 
      description: 'Common lies & debunks',
      category: 'learn'
    },
    { 
      id: 'influence', 
      name: 'Impact', 
      icon: TrendingUp, 
      color: 'bg-emerald-500', 
      description: 'Global influence effects',
      category: 'learn'
    },
    { 
      id: 'countermeasures', 
      name: 'Defense', 
      icon: Shield, 
      color: 'bg-teal-500', 
      description: 'How to protect yourself',
      category: 'action'
    }
  ];

  const checkScrollButtons = () => {
    const container = document.getElementById('horizontal-nav-container');
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = document.getElementById('horizontal-nav-container');
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  const scrollNav = (direction) => {
    const container = document.getElementById('horizontal-nav-container');
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToActive = () => {
    const container = document.getElementById('horizontal-nav-container');
    const activeElement = document.querySelector(`[data-section="${activeSection}"]`);
    if (container && activeElement) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      const scrollLeft = elementRect.left - containerRect.left + container.scrollLeft - (containerRect.width / 2) + (elementRect.width / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToActive();
  }, [activeSection]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'intro': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'learn': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'interactive': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'action': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm"
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <Card className="absolute top-16 right-4 left-4 max-h-[80vh] overflow-y-auto">
            <div className="p-4 space-y-2">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                const isCompleted = completedSections.has(section.id);
                
                return (
                  <Button
                    key={section.id}
                    onClick={() => {
                      onSectionChange(section.id);
                      setIsMenuOpen(false);
                    }}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${isActive ? section.color + ' text-white' : ''}`}
                  >
                    <section.icon className="h-4 w-4 mr-3" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{section.name}</div>
                      <div className="text-xs opacity-70">{section.description}</div>
                    </div>
                    {section.featured && <Badge variant="secondary" className="ml-2">NEW</Badge>}
                    {isCompleted && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Desktop Horizontal Navigation */}
      <div className="hidden lg:block sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b shadow-sm">
        <div className="relative">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <Button
              onClick={() => scrollNav('left')}
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Navigation Container */}
          <div
            id="horizontal-nav-container"
            className="flex overflow-x-auto scrollbar-hide py-4 px-12 space-x-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              const isCompleted = completedSections.has(section.id);
              
              return (
                <div
                  key={section.id}
                  data-section={section.id}
                  className="flex-shrink-0"
                >
                  <Button
                    onClick={() => onSectionChange(section.id)}
                    variant="ghost"
                    className={`
                      relative h-auto p-4 min-w-[140px] flex-col space-y-2 transition-all duration-200
                      ${isActive 
                        ? `${section.color} text-white shadow-lg scale-105 transform` 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-102'
                      }
                    `}
                  >
                    {/* Icon and Badge Container */}
                    <div className="relative">
                      <section.icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                      {section.featured && (
                        <Badge 
                          variant="secondary" 
                          className="absolute -top-2 -right-2 text-xs px-1 py-0 bg-red-500 text-white"
                        >
                          NEW
                        </Badge>
                      )}
                      {isCompleted && (
                        <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full" />
                      )}
                    </div>

                    {/* Section Name */}
                    <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                      {section.name}
                    </div>

                    {/* Description */}
                    <div className={`text-xs text-center leading-tight ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      {section.description}
                    </div>

                    {/* Category Badge */}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${isActive ? 'border-white/30 text-white/70' : getCategoryColor(section.category)}`}
                    >
                      {section.category}
                    </Badge>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <Button
              onClick={() => scrollNav('right')}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default HorizontalNav;

