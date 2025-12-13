import React from 'react';
import { UserCheck, MessageSquare, Target, FileText } from 'lucide-react';

const Techniques = () => {
  return (
    <section id="techniques" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Propaganda Techniques and Tactics</h2>
        
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <UserCheck className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Account Creation</h3>
              <p className="text-sm mt-2">
                AI-generated profile pictures, hijacked accounts, and coordinated posting schedules
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <MessageSquare className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Content Strategies</h3>
              <p className="text-sm mt-2">
                Flooding, astroturfing, visual propaganda, and targeted harassment
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Narrative Themes</h3>
              <p className="text-sm mt-2">
                Delegitimizing the West, denying human rights abuses, promoting China's governance model
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <FileText className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Evolution of Tactics</h3>
              <p className="text-sm mt-2">
                From domestic focus to global influence, increasingly sophisticated techniques
              </p>
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4">Account Creation and Management</h3>
          <p>
            CCP propaganda networks employ several techniques to create and manage inauthentic accounts:
          </p>
          
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>AI-generated profile pictures</strong>: Many accounts use artificially generated 
              images of non-existent people, created using StyleGAN or similar technologies. These images 
              can be identified by consistent eye placement, blurred edges around hair, teeth at strange 
              angles, and other artifacts.
            </li>
            <li>
              <strong>Hijacked accounts</strong>: Some propaganda accounts appear to be legitimate accounts 
              that were previously abandoned or sold. For example, accounts that previously posted in Turkish, 
              English, or German suddenly begin posting Chinese-language content after long periods of inactivity.
            </li>
            <li>
              <strong>Coordinated posting schedules</strong>: Activity patterns often align with Beijing 
              working hours, showing "bursts of activity in the mid-morning and early afternoon, Beijing time, 
              with breaks for lunch and supper."
            </li>
          </ul>
          
          <div className="bg-card p-6 rounded-lg my-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Content Strategies</h3>
            <p>
              CCP propaganda employs several distinct content strategies on Twitter/X:
            </p>
            
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li>
                <strong>Flooding</strong>: Unlike Russian disinformation, which often aims to make specific 
                narratives go viral, Chinese operations frequently use a "flooding" approach, overwhelming 
                conversations with high volumes of content to dilute legitimate messages. For example, when 
                human rights activists promoted the hashtag #GenocideGames during the 2022 Winter Olympics, 
                Spamouflage accounts began using the same hashtag with unrelated content to reduce its effectiveness.
              </li>
              <li>
                <strong>Astroturfing</strong>: Creating the appearance of grassroots support through coordinated 
                actions. Some accounts create original content while others amplify through likes, shares, and 
                comments to help them reach a wider audience.
              </li>
              <li>
                <strong>Visual propaganda</strong>: The use of inflammatory cartoons, memes, and other visual 
                content to ridicule critics of China. These visuals are particularly effective because they can 
                be easily translated into multiple languages at low cost and have higher engagement rates than text.
              </li>
              <li>
                <strong>Targeted harassment</strong>: Coordinated campaigns against specific individuals critical 
                of China. For example, journalist Jiayang Fan faced more than 12,000 tweets with the hashtag 
                #TraitorJiayangFan after covering pro-democracy protests in Hong Kong.
              </li>
            </ul>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4">Narrative Themes</h3>
          <p>
            CCP propaganda on Twitter/X focuses on several recurring narrative themes:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Delegitimizing the West</h4>
              <p className="text-sm">
                Highlighting social problems in Western countries, particularly the United States, 
                to portray them as hypocritical and declining powers.
              </p>
            </div>
            
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Denying Human Rights Abuses</h4>
              <p className="text-sm">
                Consistently denying allegations of human rights violations in Xinjiang, Tibet, 
                Hong Kong, and elsewhere, characterizing them as "lies fabricated by the United States and the West."
              </p>
            </div>
            
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Promoting China's Governance Model</h4>
              <p className="text-sm">
                Presenting China's political system as more efficient, stable, and successful than Western democracies.
              </p>
            </div>
            
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Exploiting Divisive Issues</h4>
              <p className="text-sm">
                Amplifying content related to racial tensions, gun violence, and other divisive 
                issues in the United States to exacerbate societal divisions.
              </p>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg my-8 shadow-sm">
            <h4 className="text-xl font-semibold mb-4">Case Study: COVID-19 Conspiracy Theories</h4>
            <p>
              One of the most prominent examples of CCP propaganda on Twitter/X involved promoting 
              conspiracy theories about the origins of COVID-19. After initial criticism of China's 
              handling of the outbreak, Chinese officials and state media began suggesting that the 
              virus originated outside China, possibly in a US military laboratory, and was brought 
              to Wuhan by American soldiers participating in the Military World Games in October 2019.
            </p>
            <p className="mt-4">
              This narrative was amplified by both official accounts and the covert Spamouflage network, 
              despite lacking scientific evidence. The campaign represented a significant shift in CCP 
              propaganda tactics, adopting more aggressive disinformation techniques previously associated 
              with Russian operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Techniques;

