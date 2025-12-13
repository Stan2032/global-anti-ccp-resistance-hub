import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const narrativesData = [
  {
    id: 1,
    title: "COVID-19 Origins",
    narrative: "COVID-19 originated outside China, possibly in a US military laboratory, and was brought to Wuhan by American soldiers participating in the Military World Games in October 2019.",
    debunk: "Scientific consensus, based on multiple peer-reviewed studies, points to natural origins of SARS-CoV-2, with the virus likely jumping from animals to humans. Genomic analyses have traced the earliest cases to the Huanan Seafood Market in Wuhan. A joint WHO-China study in 2021, despite limitations in access, found no evidence supporting the theory that the virus was introduced to Wuhan by foreign visitors. The timing of the first documented cases also does not align with the Military World Games timeline."
  },
  {
    id: 2,
    title: "Xinjiang and Uyghur Treatment",
    narrative: "Reports of detention camps and human rights abuses in Xinjiang are 'lies fabricated by the United States and the West' to contain China's rise. China is simply conducting vocational education and anti-terrorism efforts in the region.",
    debunk: "Extensive documentation from multiple independent sources confirms the existence of detention facilities and systematic human rights abuses in Xinjiang: Satellite imagery has documented the construction and expansion of detention facilities across the region. Leaked government documents, including the 'China Cables' published by the International Consortium of Investigative Journalists, detail policies for mass detention and surveillance. Testimonies from former detainees consistently describe forced political indoctrination, cultural suppression, and in some cases torture. The UN High Commissioner for Human Rights released a report in 2022 concluding that China's actions in Xinjiang may constitute crimes against humanity."
  },
  {
    id: 3,
    title: "US Human Rights Record",
    narrative: "The United States has a poor human rights record characterized by systemic racism, gun violence, and discrimination against minorities, making it hypocritical for America to criticize human rights in China.",
    debunk: "While the US does face domestic human rights challenges that warrant legitimate criticism, this 'whataboutism' fallacy attempts to deflect legitimate criticism through false equivalence. Human rights are universal standards that apply to all countries, and the existence of problems in one country doesn't negate the responsibility to address human rights violations elsewhere. Unlike in China, US civil society, media, and citizens can freely document, discuss, and work to address human rights issues without government censorship or reprisal."
  },
  {
    id: 4,
    title: "Democracy vs. Chinese Governance",
    narrative: "Western-style democracy is chaotic, inefficient, and failing, while China's governance system delivers stability, economic growth, and effective governance.",
    debunk: "While China has achieved impressive economic growth under its current system, this narrative presents a false dichotomy and overlooks critical factors: China's economic growth has come with significant environmental costs, widening inequality, and demographic challenges that threaten long-term sustainability. Democratic systems, despite their messiness, provide mechanisms for peaceful power transitions, checks on authority, and protection of individual rights that are absent in authoritarian systems. Many of the world's most prosperous, innovative, and stable societies are democracies, demonstrating that democratic governance is compatible with effective governance and economic development. The lack of transparency and accountability in China's system has led to significant policy failures, from the Great Leap Forward to the initial COVID-19 response, that were exacerbated by the inability to acknowledge and correct mistakes."
  }
];

const NarrativeCard = ({ narrative, isOpen, toggleOpen }) => {
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden mb-6">
      <div 
        className="p-6 cursor-pointer flex justify-between items-center"
        onClick={toggleOpen}
      >
        <h3 className="text-xl font-semibold">{narrative.title}</h3>
        <Button variant="ghost" size="icon">
          {isOpen ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {isOpen && (
        <div className="px-6 pb-6">
          <div className="bg-destructive/10 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2 text-destructive">CCP Narrative:</h4>
            <p>{narrative.narrative}</p>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-primary">Factual Debunk:</h4>
            <p>{narrative.debunk}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Narratives = () => {
  const [openNarratives, setOpenNarratives] = useState([1]);
  
  const toggleNarrative = (id) => {
    if (openNarratives.includes(id)) {
      setOpenNarratives(openNarratives.filter(item => item !== id));
    } else {
      setOpenNarratives([...openNarratives, id]);
    }
  };
  
  return (
    <section id="narratives" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Common Narratives and Debunks</h2>
        
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p className="lead mb-8">
            CCP propaganda on Twitter/X promotes several recurring narratives that distort facts and 
            present a biased view of China and the world. Below are some of the most common narratives 
            and factual corrections to these claims.
          </p>
          
          <div className="my-8">
            {narrativesData.map(narrative => (
              <NarrativeCard 
                key={narrative.id}
                narrative={narrative}
                isOpen={openNarratives.includes(narrative.id)}
                toggleOpen={() => toggleNarrative(narrative.id)}
              />
            ))}
          </div>
          
          <div className="bg-muted p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-4">Identifying Propaganda Narratives</h3>
            <p className="mb-4">
              When encountering content on Twitter/X or other platforms, consider these warning signs 
              that may indicate CCP propaganda:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Absolute denial of well-documented human rights issues</li>
              <li>Whataboutism that deflects criticism by pointing to problems in other countries</li>
              <li>Portrayal of all criticism of China as anti-China bias or racism</li>
              <li>Promotion of conspiracy theories about Western countries</li>
              <li>Black-and-white framing that presents complex geopolitical issues as simple moral dichotomies</li>
              <li>Content that closely mirrors official CCP talking points</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Narratives;

