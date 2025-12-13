import React from 'react';
import { Users, Building2, TrendingUp } from 'lucide-react';

const Scale = () => {
  return (
    <section id="scale" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Scale and Presence on Twitter/X</h2>
        
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg shadow-sm text-center">
              <Users className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Official Presence</h3>
              <p className="text-sm mt-2">
                Hundreds of diplomatic accounts and state media outlets maintain an official presence on Twitter/X
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm text-center">
              <Building2 className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Covert Networks</h3>
              <p className="text-sm mt-2">
                Hundreds of thousands of inauthentic accounts across major platforms
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Growth Trajectory</h3>
              <p className="text-sm mt-2">
                Significant expansion in recent years with increasing sophistication
              </p>
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4">Official Presence</h3>
          <p>
            The CCP maintains a substantial official presence on Twitter/X through:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Diplomatic accounts</strong>: Chinese embassies, consulates, and individual diplomats 
              maintain hundreds of accounts on Twitter/X, despite the platform being blocked in mainland China. 
              These accounts engage in what has been termed "wolf warrior diplomacy," adopting an assertive 
              and sometimes confrontational tone.
            </li>
            <li>
              <strong>State media</strong>: Major Chinese state media outlets like Xinhua, China Global 
              Television Network (CGTN), People's Daily, and Global Times maintain active accounts with 
              millions of followers. These accounts present themselves as legitimate news sources while 
              promoting CCP narratives.
            </li>
            <li>
              <strong>Government agencies</strong>: Various Chinese government ministries and agencies 
              maintain accounts to promote their activities and perspectives to international audiences.
            </li>
          </ul>
          
          <h3 className="text-2xl font-semibold mb-4 mt-8">Covert Networks</h3>
          <p>
            Beyond its official presence, the CCP operates extensive networks of inauthentic accounts on Twitter/X:
          </p>
          
          <div className="bg-muted p-6 rounded-lg my-6">
            <h4 className="text-xl font-semibold mb-4">Scale</h4>
            <p>
              Known as "Spamouflage" or "Dragonbridge," these networks comprise hundreds of thousands of 
              accounts across major social media platforms. Meta removed nearly 8,000 accounts attributed 
              to this network in Q2 2023 alone, while Google/YouTube has shut down over 100,000 associated 
              accounts in recent years.
            </p>
          </div>
          
          <div className="bg-muted p-6 rounded-lg my-6">
            <h4 className="text-xl font-semibold mb-4">Persistence on Twitter/X</h4>
            <p>
              According to a Washington Post analysis from February 2024, 136 out of 150 accounts identified 
              by Meta as part of Chinese influence operations remained active on Twitter/X. Of 123 accounts 
              specifically identified as part of China-based campaigns, all but 8 remained on the platform.
            </p>
          </div>
          
          <div className="bg-muted p-6 rounded-lg my-6">
            <h4 className="text-xl font-semibold mb-4">Government Links</h4>
            <p>
              In April 2023, the US Department of Justice unsealed a complaint naming 34 individual officers 
              with China's Ministry of Public Security (MPS) as part of the "912 Special Project Working Group," 
              which operates online disinformation campaigns. The operation appears to involve "hundreds" of 
              MPS officers across China.
            </p>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4 mt-8">Growth Trajectory</h3>
          <p>
            The scale of CCP propaganda operations on Twitter/X has grown significantly in recent years:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Meta reported that China-based campaigns have been multiplying, with 6 of 10 networks 
              taken down since 2017 identified in the past year alone.
            </li>
            <li>
              These operations have expanded beyond Chinese-language content to include English, Spanish, 
              and other languages, targeting diverse global audiences.
            </li>
            <li>
              The sophistication of these operations has increased, with better operational security, 
              more convincing personas, and more nuanced messaging.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Scale;

