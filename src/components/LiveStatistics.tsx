// @ts-nocheck — Phase 2 migration: types to be added
import React, { useState, useEffect, useRef } from 'react';
import {
  Link, Building2, ShieldAlert, Landmark, Plane, Newspaper, HeartCrack,
  BarChart3, TrendingUp, Search, AlertTriangle, BookOpen,
} from 'lucide-react';
import statisticsData from '../data/live_statistics.json';

const ICON_MAP = {
  Link, Building2, ShieldAlert, Landmark, Plane, Newspaper, HeartCrack,
};

/**
 * AnimatedCounter — Smoothly animates a number from 0 to a target value.
 * Uses IntersectionObserver to start animation when visible.
 *
 * @param {Object} props
 * @param {number} props.end - Target number to count to
 * @param {number} [props.duration=2000] - Animation duration in ms
 * @param {string} [props.prefix=''] - Text before the number
 * @param {string} [props.suffix=''] - Text after the number
 * @param {number} [props.decimals=0] - Number of decimal places
 * @returns {React.ReactElement} Animated counter display
 */
const AnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const startValue = 0;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (end - startValue) * easeOutQuart;
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  const formatNumber = (num) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <span ref={countRef}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

const LiveStatistics = () => {
  const [lastUpdated] = useState(new Date());

  const statistics = (statisticsData || []).map(stat => ({
    ...stat,
    Icon: ICON_MAP[stat.icon] || null,
    emoji: stat.icon === 'flag-hk' ? '🇭🇰' : null,
  }));

  const colorClasses = {
    red: { bg: 'bg-red-900/30', border: 'border-red-700/50', text: 'text-red-400' },
    cyan: { bg: 'bg-[#111820]', border: 'border-[#1c2a35]', text: 'text-[#22d3ee]' },
    orange: { bg: 'bg-orange-900/30', border: 'border-orange-700/50', text: 'text-orange-400' },
    yellow: { bg: 'bg-yellow-900/30', border: 'border-yellow-700/50', text: 'text-yellow-400' },
    blue: { bg: 'bg-[#111820]', border: 'border-[#1c2a35]', text: 'text-[#22d3ee]' },
    gray: { bg: 'bg-[#111820]/50', border: 'border-[#1c2a35]/50', text: 'text-slate-400' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-red-500 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-red-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white">The Human Cost</h2>
              <p className="text-slate-400">Real-time statistics on CCP repression</p>
            </div>
          </div>
          <div className="sm:text-right text-xs text-slate-400">
            <div>Data compiled from verified sources</div>
            <div>Last updated: {lastUpdated.toLocaleDateString()}</div>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          These numbers represent real people—families torn apart, lives destroyed, voices silenced. 
          Behind every statistic is a human story of suffering and resilience.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statistics.map(stat => {
          const colors = colorClasses[stat.color];
          
          return (
            <div 
              key={stat.id}
              className={`${colors.bg} border ${colors.border} p-4 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.Icon ? <stat.Icon className="w-6 h-6" /> : stat.emoji}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                  {stat.trend}
                </span>
              </div>
              
              <div className={`text-3xl font-bold ${colors.text} mb-1`}>
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                />
              </div>
              
              <h3 className="font-medium text-white text-sm mb-1">{stat.label}</h3>
              <p className="text-xs text-slate-400 mb-2">{stat.description}</p>
              
              <div className="text-xs text-slate-400">
                Source: {stat.source}
              </div>
            </div>
          );
        })}
      </div>

      {/* Context */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
          <h3 className="font-medium text-white mb-2 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Why These Numbers Matter</h3>
          <p className="text-sm text-slate-400">
            Statistics help document the scale of CCP repression. They provide evidence for 
            sanctions, legal cases, and policy changes. Every number represents accountability.
          </p>
        </div>
        
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
          <h3 className="font-medium text-white mb-2 flex items-center gap-2"><Search className="w-5 h-5" /> Data Verification</h3>
          <p className="text-sm text-slate-400">
            All statistics are compiled from reputable sources including government reports, 
            academic research, and established human rights organizations.
          </p>
        </div>
        
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
          <h3 className="font-medium text-white mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Underreported Reality</h3>
          <p className="text-sm text-slate-400">
            These numbers are likely underestimates. China's opacity means many cases go 
            undocumented. The true scale of repression may be significantly higher.
          </p>
        </div>
      </div>

      {/* Sources */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Data Sources</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="https://www.cecc.gov" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Congressional-Executive Commission on China (CECC)
          </a>
          <a href="https://safeguarddefenders.com" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Safeguard Defenders
          </a>
          <a href="https://www.aspi.org.au" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Australian Strategic Policy Institute (ASPI)
          </a>
          <a href="https://hongkongwatch.org" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Hong Kong Watch
          </a>
          <a href="https://cpj.org" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Committee to Protect Journalists (CPJ)
          </a>
          <a href="https://chinatribunal.com" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            China Tribunal
          </a>
        </div>
      </div>
    </div>
  );
};

export default LiveStatistics;
