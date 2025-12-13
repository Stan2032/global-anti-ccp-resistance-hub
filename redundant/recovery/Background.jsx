import React from 'react';

const Background = () => {
  return (
    <section id="background" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Background and Evolution</h2>
        
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h3 className="text-2xl font-semibold mb-4">Historical Context</h3>
          <p>
            Propaganda has been central to the CCP's governance since its founding, with Mao Zedong 
            explicitly laying out the political role of culture in his 1942 "Talks at the Yan'an Forum 
            on Art and Literature." For most of its history, however, the CCP's propaganda efforts were 
            primarily domestically focused, aimed at maintaining party legitimacy and social stability within China.
          </p>
          
          <p>
            The CCP's approach to international propaganda began to shift in the early 2000s as China's 
            economic rise created both opportunities and challenges for its global image. The concept of 
            "telling China's story well" (讲好中国故事) emerged as a guiding principle for the party's 
            external communication strategy, emphasizing the need to project a positive image of China to 
            international audiences.
          </p>
          
          <h3 className="text-2xl font-semibold mb-4 mt-8">The Digital Turn</h3>
          <p>
            The rise of social media presented both challenges and opportunities for CCP propaganda. 
            On one hand, these platforms undermined the party's traditional monopoly on information 
            within China. On the other hand, they offered new channels to reach global audiences directly, 
            bypassing Western media gatekeepers.
          </p>
          
          <p>
            Initially, the CCP's approach to international social media was cautious and primarily focused 
            on establishing an official presence through state media accounts and diplomatic missions. 
            However, this approach began to change significantly after 2016, as Chinese officials observed 
            Russia's success in using social media to influence foreign public opinion and exacerbate societal divisions.
          </p>
          
          <div className="bg-card p-6 rounded-lg my-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">The COVID-19 Watershed</h3>
            <p>
              The COVID-19 pandemic marked a watershed moment in the evolution of CCP propaganda on social media. 
              Facing international criticism over its early handling of the outbreak, Chinese officials adopted 
              a more aggressive posture online. On March 12, 2020, Chinese foreign ministry spokesperson Zhao Lijian 
              tweeted in English, "It might be US army who brought the epidemic to Wuhan," promoting a conspiracy 
              theory that sought to deflect blame for the pandemic.
            </p>
            
            <p className="mt-4">
              This tweet, which was retweeted more than four thousand times, signaled a new phase in China's 
              approach to international propaganda—one characterized by the adoption of "big lie" techniques 
              previously associated with Russian disinformation. Since then, CCP propaganda on Twitter/X has 
              become increasingly sophisticated, pervasive, and confrontational.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            <div className="flex-1 bg-background p-6 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-3">Pre-2016</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Primarily domestic focus</li>
                <li>Limited international engagement</li>
                <li>Positive messaging about China</li>
                <li>Official channels only</li>
              </ul>
            </div>
            
            <div className="flex-1 bg-background p-6 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-3">2016-2020</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Expansion to international platforms</li>
                <li>Learning from Russian techniques</li>
                <li>Growing network of inauthentic accounts</li>
                <li>Defensive messaging</li>
              </ul>
            </div>
            
            <div className="flex-1 bg-background p-6 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-3">Post-2020</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Aggressive "wolf warrior" approach</li>
                <li>Active disinformation campaigns</li>
                <li>Sophisticated network operations</li>
                <li>Offensive messaging targeting critics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Background;

