import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-8 text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About This Report</h3>
            <p className="text-sm">
              This website presents a comprehensive analysis of CCP propaganda on Twitter/X,
              examining its scale, techniques, influence, and effects based on extensive research.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#introduction" className="hover:underline">Introduction</a></li>
              <li><a href="#background" className="hover:underline">Background</a></li>
              <li><a href="#scale" className="hover:underline">Scale & Presence</a></li>
              <li><a href="#techniques" className="hover:underline">Techniques</a></li>
              <li><a href="#narratives" className="hover:underline">Narratives & Debunks</a></li>
              <li><a href="#influence" className="hover:underline">Influence</a></li>
              <li><a href="#countermeasures" className="hover:underline">Countermeasures</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
            <p className="text-sm">
              This analysis is based on research from academic studies, investigative journalism, 
              and platform disclosures. The information is provided for educational purposes.
            </p>
          </div>
        </div>
        
        <div className="border-t border-secondary-foreground/20 mt-8 pt-6 text-center text-sm">
          <p>&copy; {currentYear} The Digital Dragon: CCP Propaganda Analysis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

