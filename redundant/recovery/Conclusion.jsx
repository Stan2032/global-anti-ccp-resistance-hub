import React from 'react';
import { ArrowUpCircle } from 'lucide-react';

const Conclusion = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Conclusion</h2>
        
        <div className="max-w-4xl mx-auto prose prose-lg prose-invert">
          <p>
            The CCP's propaganda operations on Twitter/X represent a significant and growing effort 
            to shape global narratives and influence public opinion. While these operations may not 
            be as immediately disruptive as Russian disinformation campaigns, their scale, persistence, 
            and increasing sophistication make them a substantial challenge to information integrity.
          </p>
          
          <p>
            The reduced moderation on Twitter/X since Elon Musk's acquisition has made the platform 
            particularly vulnerable to these influence operations, allowing propaganda accounts to 
            persist even after being identified and removed from other platforms. This highlights 
            the importance of cross-platform coordination and consistent content moderation policies.
          </p>
          
          <p>
            Ultimately, countering CCP propaganda requires a multifaceted approach involving platforms, 
            governments, civil society, and individual users. By understanding the tactics and narratives 
            employed in these campaigns, we can build societal resilience against foreign influence 
            operations while preserving the open exchange of ideas that is essential to democratic discourse.
          </p>
          
          <div className="flex justify-center mt-12">
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-2 px-6 py-3 bg-primary-foreground text-primary rounded-full hover:bg-primary-foreground/90 transition-colors"
            >
              <ArrowUpCircle className="h-5 w-5" />
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Conclusion;

