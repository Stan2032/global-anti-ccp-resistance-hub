import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Eye, X, ExternalLink } from 'lucide-react'

const SecurityWarning = ({ securityLevel, onClose }) => {
  const getSecurityInfo = () => {
    switch (securityLevel) {
      case 'high':
        return {
          color: 'green',
          icon: Shield,
          title: 'High Security Detected',
          message: 'You appear to be using Tor or a VPN. Your connection is well-protected.',
          recommendations: [
            'Continue using your current security setup',
            'Avoid logging into personal accounts',
            'Clear browser data after each session'
          ]
        }
      case 'medium':
        return {
          color: 'yellow',
          icon: AlertTriangle,
          title: 'Medium Security Level',
          message: 'Your connection may be monitored. Consider enhancing your security.',
          recommendations: [
            'Use a VPN service for better protection',
            'Consider using Tor Browser',
            'Avoid accessing sensitive information'
          ]
        }
      default:
        return {
          color: 'red',
          icon: Eye,
          title: 'Security Risk Detected',
          message: 'Your connection is not secure. Take immediate action to protect yourself.',
          recommendations: [
            'Use Tor Browser immediately',
            'Connect through a VPN',
            'Do not access sensitive content'
          ]
        }
    }
  }

  const securityInfo = getSecurityInfo()
  const Icon = securityInfo.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-slate-800 rounded-lg border-2 ${
          securityInfo.color === 'green' 
            ? 'border-green-500' 
            : securityInfo.color === 'yellow'
            ? 'border-yellow-500'
            : 'border-red-500'
        } max-w-md w-full p-6`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon className={`w-6 h-6 mr-3 ${
              securityInfo.color === 'green' 
                ? 'text-green-400' 
                : securityInfo.color === 'yellow'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`} />
            <h3 className="text-lg font-semibold text-white">
              {securityInfo.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-slate-300 mb-4">
          {securityInfo.message}
        </p>

        {/* Recommendations */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-200 mb-2">
            Security Recommendations:
          </h4>
          <ul className="space-y-1">
            {securityInfo.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-slate-400 flex items-start">
                <span className="w-1 h-1 bg-slate-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Security Resources */}
        <div className="border-t border-slate-700 pt-4">
          <h4 className="text-sm font-medium text-slate-200 mb-2">
            Security Resources:
          </h4>
          <div className="space-y-2">
            <a
              href="https://www.torproject.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Download Tor Browser
            </a>
            <a
              href="https://tails.boum.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Tails Operating System
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              securityInfo.color === 'green'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : securityInfo.color === 'yellow'
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            I Understand
          </button>
          <button
            onClick={() => window.open('/security', '_blank')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Security Guide
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 mt-4 text-center">
          This platform is designed to support legitimate resistance against authoritarian oppression.
          Always prioritize your personal safety and legal compliance.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default SecurityWarning
