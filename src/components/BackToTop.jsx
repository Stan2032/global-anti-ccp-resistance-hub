import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTop — floating button that appears after scrolling down.
 * Smoothly scrolls the user back to the top of the page.
 */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-4 left-4 z-40 bg-[#111820] hover:bg-[#1c2a35] text-slate-400 hover:text-[#4afa82] p-3 border border-[#1c2a35] hover:border-[#4afa82] shadow-lg transition-colors"
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};

export default BackToTop;
