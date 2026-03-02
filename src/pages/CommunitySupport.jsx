import { useState } from 'react'
import { 
  ChevronRight,
} from 'lucide-react'

const CommunitySupport = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Community Support Network</h1>
        <p className="text-slate-400 mt-2">
          Mutual aid network connecting activists with volunteers and resources.
          Key community features have been integrated into our main pages:
        </p>
      </div>

      {/* Quick Links to Redistributed Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Volunteer & Donate', desc: 'Sign up to volunteer or support activists financially', page: '/take-action', section: 'Volunteer & Diaspora Support' },
          { title: 'Report CCP Activity', desc: 'Report overseas police stations, surveillance, or intimidation', page: '/security', section: 'Security → Tools tab' },
          { title: 'Key Dates & Events', desc: 'Calendar of important resistance dates and commemorations', page: '/education', section: 'Education → Learn tab' },
          { title: 'Survivor Stories', desc: 'Read testimonies from survivors of CCP persecution', page: '/education', section: 'Education → Learn tab' },
        ].map((item, idx) => (
          <a key={idx} href={item.page} className="bg-[#111820] border border-[#1c2a35] p-6 hover:border-[#2a9a52] transition-colors block">
            <h3 className="text-white font-semibold mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm mb-3">{item.desc}</p>
            <span className="text-[#4afa82] font-mono text-sm flex items-center space-x-2">
              <span>$ go --{item.section.toLowerCase().replace(/[^a-z0-9]+/g, '_')}</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </a>
        ))}
      </div>

      {/* Support Resources */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 font-mono">── support_resources ──</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Emergency Relocation Guide', desc: 'Step-by-step guide for activists needing to leave dangerous areas safely' },
            { title: 'Trauma Support Resources', desc: 'Mental health resources and support groups for activists dealing with trauma' },
            { title: 'Legal Support Directory', desc: 'Directory of lawyers and legal organizations providing pro-bono support' },
            { title: 'Fundraising Toolkit', desc: 'Tools and strategies for fundraising to support activists in need' },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#111820] border border-[#1c2a35] p-6 hover:border-[#2a9a52] transition-colors">
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommunitySupport
