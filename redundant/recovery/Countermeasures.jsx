import React from 'react';
import { ShieldCheck, Building, User } from 'lucide-react';

const Countermeasures = () => {
  return (
    <section id="countermeasures" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Countermeasures and Recommendations</h2>
        
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p className="lead mb-8">
            Countering CCP propaganda requires a multifaceted approach involving platforms, 
            governments, civil society, and individual users. By understanding the tactics and 
            narratives employed in these campaigns, we can build societal resilience against 
            foreign influence operations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Platforms</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Restore cross-platform coordination</li>
                <li>Improve detection capabilities</li>
                <li>Increase transparency</li>
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Governments</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Support independent research</li>
                <li>Apply diplomatic pressure</li>
                <li>Avoid overreaction</li>
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Individuals</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Develop media literacy</li>
                <li>Check account characteristics</li>
                <li>Verify before sharing</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4">For Platforms</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Restore cross-platform coordination</strong>: Twitter/X should rejoin industry 
              efforts to share information about influence operations, allowing for more effective 
              identification and removal of propaganda networks.
            </li>
            <li>
              <strong>Improve detection capabilities</strong>: Platforms should invest in better tools 
              to identify AI-generated profile pictures, coordinated posting patterns, and other 
              indicators of inauthentic behavior.
            </li>
            <li>
              <strong>Increase transparency</strong>: Greater transparency about state-linked accounts 
              and influence operations would help users better evaluate the information they encounter.
            </li>
          </ul>
          
          <h3 className="text-2xl font-semibold mb-4 mt-8">For Governments</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Support independent research</strong>: Governments should fund independent research 
              into foreign influence operations while respecting academic freedom and avoiding politicization.
            </li>
            <li>
              <strong>Diplomatic pressure</strong>: Diplomatic channels should be used to raise concerns 
              about state-sponsored disinformation and establish norms against such activities.
            </li>
            <li>
              <strong>Avoid overreaction</strong>: Responses should be proportionate and avoid undermining 
              democratic values like free speech or stigmatizing legitimate diaspora voices.
            </li>
          </ul>
          
          <div className="bg-muted p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-4">For Individuals</h3>
            <p className="mb-4">
              Individual users can protect themselves from manipulation by developing critical 
              information consumption habits:
            </p>
            
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Develop media literacy</strong>: Learning to identify propaganda techniques 
                and verify information from multiple sources is crucial for resilience against disinformation.
              </li>
              <li>
                <strong>Check account characteristics</strong>: Be skeptical of accounts with AI-generated 
                profile pictures, recently created accounts with few followers, or those that post at 
                unusual hours for their purported location.
              </li>
              <li>
                <strong>Verify before sharing</strong>: Before amplifying content about contentious issues, 
                verify the information through trusted sources and consider whether it might be part of a 
                coordinated campaign.
              </li>
            </ul>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4">Red Flags: How to Spot Potential Propaganda Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Profile Characteristics</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>AI-generated profile pictures (look for consistent eye placement, blurred edges)</li>
                <li>Generic or randomly generated usernames</li>
                <li>Recently created accounts with few followers but high activity</li>
                <li>Bio that seems generic or contains nationalist slogans</li>
                <li>Posting patterns that align with Beijing working hours</li>
              </ul>
            </div>
            
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Content Patterns</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Exclusively political content with no personal posts</li>
                <li>Identical posts across multiple accounts</li>
                <li>Excessive use of the same hashtags</li>
                <li>Poor English with grammatical errors suggesting machine translation</li>
                <li>Narratives that closely align with official CCP positions</li>
                <li>Aggressive attacks on critics of China</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-4 text-primary">Building Resilience</h3>
            <p>
              The most effective defense against propaganda is a well-informed public with strong 
              critical thinking skills. Educational initiatives that teach media literacy, critical 
              thinking, and source evaluation can help build societal resilience against all forms 
              of disinformation, not just those originating from China.
            </p>
            <p className="mt-4">
              By understanding the tactics and narratives employed in CCP propaganda campaigns, 
              individuals can better protect themselves from manipulation while preserving the open 
              exchange of ideas that is essential to democratic discourse.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Countermeasures;

