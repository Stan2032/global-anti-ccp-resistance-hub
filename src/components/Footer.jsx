import React from 'react';
import { Link } from 'react-router-dom';
import { Siren, Phone, Mail, Lock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Dashboard', path: '/' },
      { name: 'Political Prisoners', path: '/prisoners' },
      { name: 'Take Action', path: '/take-action' },
      { name: 'Education Center', path: '/education' },
      { name: 'Security Center', path: '/security' },
    ],
    resources: [
      { name: 'Resistance Directory', path: '/directory' },
      { name: 'Intelligence Feeds', path: '/intelligence' },
      { name: 'CCP Tactics', path: '/tactics' },
      { name: 'Regional Threats', path: '/threats' },
      { name: 'Data Export', path: '/resources' },
    ],
    organizations: [
      { name: 'Safeguard Defenders', url: 'https://safeguarddefenders.com/' },
      { name: 'Hong Kong Watch', url: 'https://www.hongkongwatch.org/' },
      { name: 'UHRP', url: 'https://uhrp.org/' },
      { name: 'Free Tibet', url: 'https://freetibet.org/' },
      { name: 'Freedom House', url: 'https://freedomhouse.org/' },
    ],
    emergency: [
      { name: 'Front Line Defenders', phone: '+353 1 210 0489' },
      { name: 'Access Now Helpline', email: 'help@accessnow.org' },
    ]
  };

  return (
    <footer className="bg-[#0a0e14] border-t border-[#1c2a35] mt-12">
      {/* ASCII top border */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="font-mono text-[#1c2a35] text-xs py-2 select-none overflow-hidden" aria-hidden="true">
          ╔{'═'.repeat(80)}╗
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Platform Links */}
          <div>
            <h3 className="font-mono text-[#4afa82] font-semibold mb-4 text-sm">
              <span className="text-[#1c2a35] mr-1" aria-hidden="true">│</span>platform
            </h3>
            <ul className="space-y-2">
              {footerLinks.platform.map(link => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-400 hover:text-[#4afa82] text-sm transition-colors font-mono"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-mono text-[#4afa82] font-semibold mb-4 text-sm">
              <span className="text-[#1c2a35] mr-1" aria-hidden="true">│</span>resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map(link => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-400 hover:text-[#4afa82] text-sm transition-colors font-mono"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner Organizations */}
          <div>
            <h3 className="font-mono text-[#4afa82] font-semibold mb-4 text-sm">
              <span className="text-[#1c2a35] mr-1" aria-hidden="true">│</span>organizations
            </h3>
            <ul className="space-y-2">
              {footerLinks.organizations.map(link => (
                <li key={link.url}>
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#4afa82] text-sm transition-colors font-mono"
                  >
                    {link.name} <span className="text-[#1c2a35]">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="font-mono text-red-400 font-semibold mb-4 text-sm flex items-center gap-2">
              <span className="text-red-900" aria-hidden="true">│</span>
              <Siren className="w-4 h-4" /> emergency
            </h3>
            <div className="space-y-3">
              {footerLinks.emergency.map((contact, index) => (
                <div key={index} className="text-sm font-mono">
                  <p className="text-slate-300 font-medium">{contact.name}</p>
                  {contact.phone && (
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-red-400 hover:text-red-300"
                    >
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {contact.phone}</span>
                    </a>
                  )}
                  {contact.email && (
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-[#22d3ee] hover:text-cyan-300"
                    >
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-[#111820] p-4 mb-8 border border-[#1c2a35]">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-[#4afa82]" />
            <div className="text-sm font-mono">
              <p className="text-slate-300 font-medium">security_notice</p>
              <p className="text-slate-400">
                This platform does not collect personal data. For maximum security, use{' '}
                <a href="https://www.torproject.org/" target="_blank" rel="noopener noreferrer" className="text-[#4afa82] hover:text-[#7dffaa]">Tor Browser</a>
                {' '}and a trusted{' '}
                <a href="https://www.privacytools.io/providers/vpn/" target="_blank" rel="noopener noreferrer" className="text-[#4afa82] hover:text-[#7dffaa]">VPN</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1c2a35] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Logo & Version */}
            <div className="flex items-center space-x-3">
              <span className="font-mono text-[#4afa82] text-lg font-bold terminal-glow">[GRH]</span>
              <div>
                <p className="text-white font-mono font-semibold text-sm">resistance_hub</p>
                <p className="text-xs text-slate-500 font-mono">v2.11.0 // open_source</p>
              </div>
            </div>

            {/* Credits */}
            <div className="text-center text-sm text-slate-400 font-mono">
              <p>
                data: {' '}
                <a href="https://safeguarddefenders.com/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#4afa82]">safeguard_defenders</a>{' | '}
                <a href="https://freedomhouse.org/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#4afa82]">freedom_house</a>{' | '}
                <a href="https://www.aspi.org.au/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#4afa82]">ASPI</a>
              </p>
            </div>

            {/* Social & GitHub */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/Stan2032/global-anti-ccp-resistance-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#4afa82] transition-colors"
                title="View on GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://twitter.com/intent/tweet?text=Join%20the%20global%20resistance%20against%20CCP%20authoritarianism&url=https://stan2032.github.io/global-anti-ccp-resistance-hub/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#4afa82] transition-colors"
                title="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Copyright & License */}
          <div className="mt-6 text-center font-mono">
            <p className="text-xs text-slate-500">
              © {currentYear} Global Resistance Network | 
              content: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="hover:text-[#4afa82]">CC BY 4.0</a> | 
              code: <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="hover:text-[#4afa82]">MIT</a>
            </p>
            <p className="mt-2 text-[#1c2a35] text-xs select-none" aria-hidden="true">
              光復香港 • 時代革命 • Free Tibet • Free Uyghurs • Stand with Taiwan
            </p>
            <p className="sr-only">
              Liberate Hong Kong, Revolution of Our Times, Free Tibet, Free Uyghurs, Stand with Taiwan
            </p>
          </div>
        </div>
      </div>

      {/* ASCII bottom border */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="font-mono text-[#1c2a35] text-xs pb-2 select-none overflow-hidden" aria-hidden="true">
          ╚{'═'.repeat(80)}╝
        </div>
      </div>
    </footer>
  );
};

export default Footer;
