import React from 'react';
import { AlertTriangle, Info, Shield } from 'lucide-react';

/**
 * GlobalDisclaimer - Reusable disclaimer component to replace redundant disclaimers across the site
 * 
 * Types:
 * - verify: "Always verify information from multiple sources"
 * - sensitive: "Verify organizations before sharing sensitive information"
 * - changing: "Information may change; verify current status"
 * - security: "Take security precautions when accessing sensitive content"
 */

const disclaimerContent = {
  verify: {
    icon: Info,
    title: 'Verification Notice',
    text: 'Always verify information from multiple independent sources before acting on it.',
    color: 'blue',
  },
  sensitive: {
    icon: Shield,
    title: 'Security Notice',
    text: 'Verify organizations independently before sharing sensitive information or making donations.',
    color: 'yellow',
  },
  changing: {
    icon: AlertTriangle,
    title: 'Information Notice',
    text: 'Situations may change. Always verify current information before making decisions.',
    color: 'amber',
  },
  security: {
    icon: Shield,
    title: 'Security Reminder',
    text: 'Take appropriate security precautions when accessing or sharing sensitive content.',
    color: 'red',
  },
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-900/20',
    border: 'border-blue-700/50',
    icon: 'text-blue-400',
    title: 'text-blue-300',
    text: 'text-slate-300',
  },
  yellow: {
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-700/50',
    icon: 'text-yellow-400',
    title: 'text-yellow-300',
    text: 'text-slate-300',
  },
  amber: {
    bg: 'bg-amber-900/20',
    border: 'border-amber-700/50',
    icon: 'text-amber-400',
    title: 'text-amber-300',
    text: 'text-slate-300',
  },
  red: {
    bg: 'bg-red-900/20',
    border: 'border-red-700/50',
    icon: 'text-red-400',
    title: 'text-red-300',
    text: 'text-slate-300',
  },
};

const GlobalDisclaimer = ({ type = 'verify', compact = false, className = '' }) => {
  const content = disclaimerContent[type] || disclaimerContent.verify;
  const colors = colorClasses[content.color];
  const Icon = content.icon;

  if (compact) {
    return (
      <p className={`text-sm ${colors.text} ${className}`}>
        <Icon className={`inline w-4 h-4 mr-1 ${colors.icon}`} />
        {content.text}
      </p>
    );
  }

  return (
    <div className={`${colors.bg} border ${colors.border} p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
        <div>
          <h4 className={`font-semibold ${colors.title} mb-1`}>{content.title}</h4>
          <p className={`text-sm ${colors.text}`}>{content.text}</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalDisclaimer;
