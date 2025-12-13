import React from 'react'
import { Shield, Globe, Lock, ExternalLink } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Platform': [
      { name: 'About', href: '/about' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Security', href: '/security' },
      { name: 'Privacy', href: '/privacy' },
    ],
    'Resources': [
      { name: 'Digital Security Guide', href: '/security-guide' },
      { name: 'Legal Resources', href: '/legal' },
      { name: 'Emergency Contacts', href: '/emergency' },
      { name: 'Documentation', href: '/docs' },
    ],
    'Community': [
      { name: 'Organizations', href: '/directory' },
      { name: 'Campaigns', href: '/campaigns' },
      { name: 'Support Network', href: '/community' },
      { name: 'Contact Us', href: '/contact' },
    ],
  }

  const securityFeatures = [
    { icon: Lock, text: 'End-to-end encryption' },
    { icon: Shield, text: 'Anonymous access supported' },
    { icon: Globe, text: 'Tor network compatible' },
  ]

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Resistance Hub</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Coordinating global resistance against authoritarian oppression through secure, 
              decentralized communication and resource sharing.
            </p>
            <div className="space-y-2">
              {securityFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.text} className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">{feature.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>© {currentYear} Global Resistance Hub</span>
              <span>•</span>
              <a href="/terms" className="hover:text-primary-600 transition-colors">
                Terms of Service
              </a>
              <span>•</span>
              <a href="/privacy" className="hover:text-primary-600 transition-colors">
                Privacy Policy
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              
              <a
                href="https://github.com/resistance-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <span>Open Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Legal Notice:</strong> This platform is designed to support legitimate 
              resistance against authoritarian oppression. Users are responsible for compliance 
              with local laws. Always prioritize personal safety and legal compliance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
