import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Shield, ExternalLink, X } from 'lucide-react'

/**
 * SecurityWarning - Displays general security guidance for users
 * 
 * NOTE: This component does NOT detect VPN/Tor usage. It provides
 * honest security recommendations without claiming to know the
 * user's connection status. Any actual security detection would
 * require server-side IP analysis (see C2 in AGENT_ROADMAP.md).
 * 
 * @param {Function} onClose - callback to dismiss the warning
 */
const SecurityWarning = ({ onClose }) => {
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
        className="bg-slate-800 rounded-lg border-2 border-yellow-500 max-w-md w-full p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Shield className="w-6 h-6 mr-3 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">
              Security Reminder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Honest message */}
        <p className="text-slate-300 mb-4">
          This platform contains sensitive information about human rights abuses. 
          We cannot verify your connection security from the browser. Please take 
          steps to protect yourself.
        </p>

        {/* Recommendations */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-200 mb-2">
            Security Recommendations:
          </h4>
          <ul className="space-y-1">
            <li className="text-sm text-slate-400 flex items-start">
              <span className="w-1 h-1 bg-slate-500 rounded-full mt-2 mr-2 flex-shrink-0" />
              Use Tor Browser or a reputable VPN service
            </li>
            <li className="text-sm text-slate-400 flex items-start">
              <span className="w-1 h-1 bg-slate-500 rounded-full mt-2 mr-2 flex-shrink-0" />
              Avoid logging into personal accounts while browsing
            </li>
            <li className="text-sm text-slate-400 flex items-start">
              <span className="w-1 h-1 bg-slate-500 rounded-full mt-2 mr-2 flex-shrink-0" />
              Clear browser data after each session
            </li>
            <li className="text-sm text-slate-400 flex items-start">
              <span className="w-1 h-1 bg-slate-500 rounded-full mt-2 mr-2 flex-shrink-0" />
              Use end-to-end encrypted messaging for sensitive communications
            </li>
          </ul>
        </div>

        {/* Honest disclaimer */}
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300">
              This platform cannot detect whether you are using a VPN or Tor. 
              We provide these recommendations as general security guidance. 
              You are responsible for your own operational security.
            </p>
          </div>
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
              href="https://tails.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Tails Operating System
            </a>
            <a
              href="https://ssd.eff.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              EFF Surveillance Self-Defense
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
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
          This platform supports legitimate resistance against authoritarian oppression.
          Always prioritize your personal safety and legal compliance.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default SecurityWarning
