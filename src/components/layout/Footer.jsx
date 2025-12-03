import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Globe, Heart, ExternalLink, Github } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Directory', href: '/directory' },
        { name: 'Intelligence', href: '/intelligence' },
        { name: 'Campaigns', href: '/campaigns' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Security Guide', href: '/security' },
        { name: 'Education', href: '/education' },
        { name: 'Community', href: '/community' },
        { name: 'Documentation', href: '/docs', external: true },
      ]
    },
    {
      title: 'Campaigns',
      links: [
        { name: 'Free Jimmy Lai', href: '/campaigns/free-jimmy-lai' },
        { name: 'London Embassy', href: '/campaigns/london-embassy' },
        { name: 'Hong Kong Support', href: '/campaigns/hong-kong-support' },
        { name: 'Uyghur Rights', href: '/campaigns/uyghur-rights' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Tor Browser', href: 'https://www.torproject.org/', external: true },
        { name: 'Tails OS', href: 'https://tails.boum.org/', external: true },
        { name: 'Signal Messenger', href: 'https://signal.org/', external: true },
        { name: 'ProtonMail', href: 'https://protonmail.com/', external: true },
      ]
    }
  ]

  const partnerOrganizations = [
    { name: 'Hong Kong Democracy Council', href: 'https://www.hkdc.us/' },
    { name: 'Students for a Free Tibet', href: 'https://studentsforafreetibet.org/' },
    { name: 'World Uyghur Congress', href: 'https://www.uyghurcongress.org/' },
    { name: 'ICIJ', href: 'https://www.icij.org/' },
  ]

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors flex items-center text-sm"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-slate-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Partner Organizations */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Partner Organizations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partnerOrganizations.map((org) => (
              <a
                key={org.name}
                href={org.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors text-sm flex items-center"
              >
                {org.name}
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-blue-400 mr-3" />
            <div className="text-center">
              <h2 className="text-2xl font-bold gradient-text">Global Resistance Hub</h2>
              <p className="text-slate-400 text-sm mt-1">
                Coordinating worldwide resistance against authoritarian oppression
              </p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-slate-300 text-sm leading-relaxed">
              This platform serves as a comprehensive hub for coordinating global resistance against 
              Chinese Communist Party influence operations. We connect resistance movements, provide 
              secure access to leaked intelligence, facilitate community organization, and transform 
              passive awareness into active resistance through education, coordination, and direct action support.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-400 font-medium text-sm">Security Notice</span>
          </div>
          <p className="text-slate-400 text-xs text-center">
            This platform is designed to support legitimate resistance against authoritarian oppression 
            and human rights violations. All activities must comply with applicable laws and ethical standards. 
            Users are responsible for their own security and legal compliance. Always prioritize your personal safety.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <p className="text-slate-400 text-sm">
              © {currentYear} Global Resistance Hub. Built with{' '}
              <Heart className="w-4 h-4 text-red-400 inline mx-1" />
              for freedom and democracy.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Stan2032/global-anti-ccp-resistance-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <div className="flex items-center text-slate-400 text-sm">
              <Globe className="w-4 h-4 mr-1" />
              <span>89 countries reached</span>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-8 text-center">
          <blockquote className="text-slate-300 italic text-sm">
            "The only thing necessary for the triumph of evil is for good people to do nothing."
          </blockquote>
          <cite className="text-slate-500 text-xs mt-1 block">— Edmund Burke</cite>
        </div>
      </div>
    </footer>
  )
}

export default Footer
