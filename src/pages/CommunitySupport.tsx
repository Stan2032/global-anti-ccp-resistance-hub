/**
 * CommunitySupport — Where to find help (emergencies, mental health, legal
 * aid) and ways to help others, each linking to the section of the site
 * that covers it.
 *
 * @module CommunitySupport
 */
import { 
  ChevronRight,
} from 'lucide-react'

/**
 * Where each card leads. Every link names a section's own id, never an
 * element inside it: a link to a closed <details> lands on its summary in
 * every browser, while a link into one relies on the browser opening it.
 */
const WAYS_TO_HELP = [
  { title: 'Volunteer & Donate', desc: 'Organisations that need volunteers, and where to donate', href: '/take-action#volunteer', slug: 'volunteer' },
  { title: 'Report CCP Activity', desc: 'Where to report overseas police stations, surveillance or intimidation', href: '/security#tools', slug: 'report' },
  { title: 'Key Dates & Events', desc: 'Anniversaries and commemorations', href: '/education#key-dates', slug: 'key_dates' },
  { title: 'Survivor Stories', desc: 'Testimony from survivors of CCP persecution', href: '/education#survivor-testimonies', slug: 'survivor_stories' },
];

const WHERE_TO_GET_HELP = [
  { title: 'Emergency Help', desc: 'What to do if you are in danger, who to call, and relocation', href: '/security#guides', slug: 'emergency' },
  { title: 'Mental Health Support', desc: 'Trauma counselling and peer support for people in exile', href: '/take-action#diaspora', slug: 'mental_health' },
  { title: 'Legal Help', desc: 'Legal hotlines, pro-bono contacts and asylum guidance, by country', href: '/security#tools', slug: 'legal' },
];

type LinkCard = (typeof WAYS_TO_HELP)[number];

/*
 * Plain <a>, not <Link>: these go to a section on another page, and an
 * in-app navigation scrolls to the top (ScrollToTop) instead of to the
 * section. A full page load lets the browser find the #fragment.
 */
const LinkCards = ({ cards }: { cards: LinkCard[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {cards.map((item) => (
      <a key={item.title} href={item.href} className="bg-[#111820] border border-[#1c2a35] p-6 hover:border-[#2a9a52] transition-colors block">
        <h3 className="text-white font-semibold mb-2">{item.title}</h3>
        <p className="text-slate-400 text-sm mb-3">{item.desc}</p>
        <span className="text-[#4afa82] font-mono text-sm flex items-center space-x-2">
          <span>$ go --{item.slug}</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      </a>
    ))}
  </div>
);

const CommunitySupport = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Community Support</h1>
        <p className="text-slate-400 mt-2">
          Where to find help, and ways to help others. Each card goes to the part of the site that covers it.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4 font-mono">── support_resources ──</h2>
        <LinkCards cards={WHERE_TO_GET_HELP} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4 font-mono">── ways_to_help ──</h2>
        <LinkCards cards={WAYS_TO_HELP} />
      </div>
    </div>
  )
}

export default CommunitySupport
