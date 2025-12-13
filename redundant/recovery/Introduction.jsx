import React from 'react';

const Introduction = () => {
  return (
    <section id="introduction" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Introduction</h2>
        
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p>
            In the digital age, information has become a critical domain for geopolitical competition. 
            The Chinese Communist Party (CCP), recognizing this reality, has invested heavily in developing 
            capabilities to shape global narratives and influence public opinion beyond China's borders. 
            Twitter/X, despite being blocked within mainland China, has emerged as a key platform for these efforts.
          </p>
          
          <p>
            This analysis examines the CCP's propaganda operations on Twitter/X, drawing on research from 
            academic institutions, investigative journalism, platform transparency reports, and government 
            disclosures. It aims to provide a comprehensive understanding of how these operations function, 
            their scale and scope, the techniques they employ, and their effectiveness in influencing global discourse.
          </p>
          
          <p>
            Understanding these operations is crucial not only for national security professionals and 
            policymakers but also for ordinary citizens seeking to navigate an increasingly complex 
            information environment. By identifying the tactics and narratives employed by CCP propaganda, 
            this analysis aims to strengthen societal resilience against foreign influence operations.
          </p>
          
          <div className="bg-muted p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-4">Key Findings</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The CCP has built what researchers describe as "the world's largest known online 
                disinformation operation," with hundreds of thousands of accounts across major platforms.
              </li>
              <li>
                Twitter/X has become particularly vulnerable to these operations since Elon Musk's 
                acquisition, with many propaganda accounts remaining active even after being identified 
                and removed from other platforms.
              </li>
              <li>
                CCP propaganda tactics include flooding hashtags with junk content, using AI-generated 
                profile pictures, hijacking dormant accounts, and coordinated harassment of critics.
              </li>
              <li>
                Common propaganda narratives include COVID-19 origin conspiracy theories, denials of 
                human rights abuses in Xinjiang, criticism of US human rights record, and promotion 
                of China's governance model as superior to democracy.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;

