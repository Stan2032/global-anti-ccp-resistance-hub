import React from 'react';
import { BarChart3, Globe, Users, AlertTriangle } from 'lucide-react';

const Influence = () => {
  return (
    <section id="influence" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Influence and Effectiveness</h2>
        
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg shadow-sm text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Measuring Impact</h3>
              <p className="text-sm mt-2">
                Limited viral reach but effective at muddying discourse
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Platform Vulnerabilities</h3>
              <p className="text-sm mt-2">
                Twitter/X particularly vulnerable since Musk's acquisition
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm text-center">
              <Users className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Target Audiences</h3>
              <p className="text-sm mt-2">
                International elites, Chinese diaspora, Western public, Global South
              </p>
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4">Measuring Impact</h3>
          <p>
            Assessing the effectiveness of CCP propaganda on Twitter/X presents significant 
            methodological challenges. However, several observations can be made:
          </p>
          
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Limited viral reach</strong>: Most content from CCP propaganda networks 
              receives relatively little engagement, with few posts going viral organically. 
              According to Meta, these networks "had almost no engagement on our platform."
            </li>
            <li>
              <strong>Muddying the waters</strong>: Rather than changing minds, the primary effect 
              appears to be creating confusion and uncertainty around facts. As Kieran Green of 
              Exovera notes, "The object is not necessarily to change hearts and minds but to muddy 
              the discourse to the degree that it's impossible to form an anti-China narrative."
            </li>
            <li>
              <strong>Silencing critics</strong>: Targeted harassment campaigns have had a demonstrable 
              effect on individuals critical of China, creating what one victim described as a "sense of fear" 
              that may discourage others from speaking out.
            </li>
          </ul>
          
          <div className="bg-card p-6 rounded-lg my-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Platform Vulnerabilities</h3>
            <p>
              Twitter/X has become particularly vulnerable to CCP propaganda since Elon Musk's 
              acquisition of the platform in 2022:
            </p>
            
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li>
                The platform has been largely absent from industry coordination efforts, no longer 
                sending representatives to biweekly meetings where companies share notes on fake account networks.
              </li>
              <li>
                Significant reductions in content moderation staff have reduced the platform's capacity 
                to identify and remove coordinated inauthentic behavior.
              </li>
              <li>
                This allows propaganda to spread from Twitter/X back to other platforms, undermining 
                the effectiveness of content moderation elsewhere.
              </li>
            </ul>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4">Target Audiences</h3>
          <p>
            CCP propaganda on Twitter/X appears to target several distinct audiences:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-2">International Elites</h4>
              <p className="text-sm">
                Official accounts often aim to influence policymakers, journalists, and other 
                opinion leaders in foreign countries.
              </p>
            </div>
            
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Chinese Diaspora</h4>
              <p className="text-sm">
                Some propaganda efforts target overseas Chinese communities, seeking to maintain 
                their loyalty to the party and discourage criticism.
              </p>
            </div>
            
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-2">General Western Public</h4>
              <p className="text-sm">
                Broader disinformation campaigns aim to shape public opinion in Western countries, 
                particularly on issues related to China's human rights record and international standing.
              </p>
            </div>
            
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Global South</h4>
              <p className="text-sm">
                Increasingly, CCP propaganda targets audiences in Africa, Latin America, and parts of Asia, 
                presenting China as a more reliable partner than Western countries.
              </p>
            </div>
          </div>
          
          <div className="bg-destructive/10 p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-4 text-destructive">Case Study: Twitter/X After Musk</h3>
            <p>
              The acquisition of Twitter by Elon Musk in October 2022 created new opportunities for 
              CCP propaganda. According to a Washington Post investigation, accounts previously identified 
              as part of Chinese influence operations by Meta remained active on Twitter/X even after 
              being removed from Facebook and Instagram.
            </p>
            <p className="mt-4">
              The investigation found that 136 out of 150 accounts identified by Meta as part of Chinese 
              influence operations remained active on Twitter/X. Of 123 accounts specifically identified 
              as part of China-based campaigns, all but 8 remained on the platform.
            </p>
            <p className="mt-4">
              This persistence can be attributed to reduced content moderation resources and Twitter/X's 
              withdrawal from industry coordination efforts to combat disinformation. The platform no longer 
              sends representatives to biweekly meetings where companies share notes on fake account networks.
            </p>
          </div>
          
          <div className="flex items-center justify-center my-8">
            <Globe className="h-16 w-16 text-primary mr-4" />
            <p className="italic text-lg">
              "The object is not necessarily to change hearts and minds but to muddy the discourse 
              to the degree that it's impossible to form an anti-China narrative."
              <br />
              <span className="text-sm not-italic">— Kieran Green, Exovera</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Influence;

