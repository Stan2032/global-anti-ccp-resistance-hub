import React from 'react';
import { ArrowDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToContent = () => {
    document.getElementById('introduction').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-b from-primary to-primary/80 text-primary-foreground py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          The Digital Dragon
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-8">
          Interactive Analysis of CCP Propaganda on Twitter/X
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 opacity-90">
          Master propaganda detection through interactive games, explore timeline visualizations, 
          and understand the scale, techniques, and effects of Chinese Communist Party's 
          influence operations on social media platforms.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="bg-primary-foreground/10 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">🛠️ Interactive Tools</span>
          </div>
          <div className="bg-primary-foreground/10 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">📊 Timeline Analysis</span>
          </div>
          <div className="bg-primary-foreground/10 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">🔍 Real Examples</span>
          </div>
          <div className="bg-primary-foreground/10 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">🛡️ Detection Training</span>
          </div>
        </div>
        <Button 
          onClick={scrollToContent} 
          size="lg" 
          variant="outline" 
          className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
        >
          Explore the Analysis <ArrowDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;

