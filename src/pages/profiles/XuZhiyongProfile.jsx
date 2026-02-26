import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart, Book
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against BBC, Reuters, AP, HRW, Amnesty International,
// and other Tier 1/2 sources. Zero CCP state media cited.

const PROFILE = {
  name: 'Xu Zhiyong',
  chineseName: '许志永',
  birthDate: 'March 2, 1973',
  birthPlace: 'Minyi County, Shandong Province, China',
  nationality: 'Chinese',
  status: 'IMPRISONED',
  currentLocation: 'Prison, China',
  sentence: '14 years for "subversion of state power"',
  occupation: 'Legal Scholar & Civil Rights Advocate',
};

const TIMELINE = [
  {
    date: '1973-03-02',
    year: '1973',
    title: 'Born in Minyi County, Shandong Province',
    detail: 'Born in rural Shandong Province. Went on to earn a PhD in Law from Peking University, one of China\'s most prestigious institutions.',
    category: 'life',
  },
  {
    date: '2003',
    year: '2003',
    title: 'Co-founded the Open Constitution Initiative (Gongmeng)',
    detail: 'Co-founded the Open Constitution Initiative (公盟, Gongmeng), a legal research and civil rights organization that provided legal aid and policy recommendations. Gongmeng advocated for rule of law, equal education access for migrant children, and government transparency.',
    category: 'activism',
  },
  {
    date: '2003',
    year: '2003',
    title: 'Elected to Beijing\'s Haidian District People\'s Congress',
    detail: 'Elected as an independent candidate to the Haidian District People\'s Congress in Beijing, demonstrating his belief in working within the system for reform.',
    category: 'activism',
  },
  {
    date: '2009-07',
    year: '2009',
    title: 'Gongmeng forcibly shut down by authorities',
    detail: 'Authorities shut down the Open Constitution Initiative, accusing it of tax evasion. Xu was detained for a month. The closure was widely viewed as politically motivated retaliation for the organization\'s legal advocacy work.',
    category: 'persecution',
    sourceUrl: 'https://www.hrw.org/news/2009/07/17/china-legal-rights-group-shut-down',
  },
  {
    date: '2012',
    year: '2012',
    title: 'Launched the New Citizens Movement',
    detail: 'Founded the New Citizens Movement (新公民运动), which called for government transparency, equal education rights, and officials to publicly disclose their assets. The movement was explicitly non-confrontational, emphasizing civic responsibility and rule of law over revolution.',
    category: 'activism',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-25845810',
  },
  {
    date: '2013-07-16',
    year: '2013',
    title: 'Arrested for "gathering a crowd to disturb public order"',
    detail: 'Detained by Beijing police after organizing small-scale gatherings calling for officials to disclose their assets. Charged with "gathering a crowd to disturb public order" — a vague charge routinely used against activists.',
    category: 'persecution',
    sourceUrl: 'https://www.amnesty.org/en/documents/asa17/001/2014/en/',
  },
  {
    date: '2014-01-26',
    year: '2014',
    title: 'Sentenced to 4 years in prison',
    detail: 'Convicted and sentenced to 4 years in prison for "gathering a crowd to disturb public order." Foreign diplomats were denied access to the courtroom. The EU, US, and human rights organizations condemned the verdict.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-25845810',
  },
  {
    date: '2017-07',
    year: '2017',
    title: 'Released after serving full sentence',
    detail: 'Released from prison after serving his entire 4-year sentence. Continued to write and advocate for civil rights despite heavy surveillance.',
    category: 'life',
  },
  {
    date: '2020-02-15',
    year: '2020',
    title: 'Arrested again while in hiding in Guangzhou',
    detail: 'Arrested by police in Guangzhou, where he had been in hiding. He was detained alongside fellow activist Ding Jiaxi. The arrests came during the early days of the COVID-19 outbreak, when Xu had published an open letter calling on Xi Jinping to resign over the government\'s handling of the crisis.',
    category: 'persecution',
    sourceUrl: 'https://www.reuters.com/article/us-china-rights-idUSKBN20G0DH',
  },
  {
    date: '2023-04-10',
    year: '2023',
    title: 'Sentenced to 14 years for "subversion of state power"',
    detail: 'After more than three years in detention, Xu Zhiyong was sentenced to 14 years in prison for "subversion of state power" by the Linshu County People\'s Court in Shandong Province. Co-defendant Ding Jiaxi received 12 years. The trial was held in secret. Human rights organizations condemned the sentences as "a travesty of justice."',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-65226498',
  },
  {
    date: '2024-10-04',
    year: '2024',
    title: 'Began hunger strike to protest inhumane prison treatment',
    detail: 'Xu Zhiyong began a hunger strike on October 4 at Lunan Prison in Shandong Province to protest inhumane treatment. He lost 5-6 kg in less than a month. During a family visit, a forced-feeding tube was observed. He was referred to only as "Prisoner No. 003." He promised to suspend the strike in late October, but his health remained a critical concern. Over 40 human rights organizations issued a joint statement in November demanding his release.',
    category: 'persecution',
    sourceUrl: 'https://www.hrw.org/news/2024/11/20/concerns-grow-health-detained-chinese-lawyer',
  },
];

const CHARGES = [
  {
    charge: '"Gathering a crowd to disturb public order" (2013)',
    law: 'Article 291, Criminal Law of the PRC',
    filed: 'July 2013',
    verdict: 'GUILTY — January 26, 2014',
    sentence: '4 years imprisonment (served in full)',
    detail: 'Convicted for organizing small gatherings of citizens who held signs calling for government officials to disclose their assets — a form of peaceful protest. The "crowd" consisted of a handful of people holding banners in public spaces. Amnesty International declared him a prisoner of conscience.',
  },
  {
    charge: '"Subversion of state power" (2020)',
    law: 'Article 105, Criminal Law of the PRC',
    filed: 'February 2020',
    verdict: 'GUILTY — April 10, 2023',
    sentence: '14 years imprisonment',
    detail: 'Convicted of "subversion of state power" after more than three years in pre-trial detention. The prosecution centered on his leadership of the New Citizens Movement and his continued advocacy for rule of law, government transparency, and civic participation. The charge of "subversion" was applied to activities that consisted entirely of peaceful writing, advocacy, and organizing. Co-defendant Ding Jiaxi was sentenced to 12 years on the same charge.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Xu Zhiyong attempted to subvert state power through an organized campaign"',
    reality: 'The New Citizens Movement was explicitly non-violent and non-confrontational. It called for rule of law, official asset disclosure, and equal education rights — policies that are mainstream in any democracy. Xu repeatedly emphasized working within the system rather than overthrowing it. His writings called for constitutional governance, not revolution. The "subversion" charge was applied to peaceful civic organizing.',
    sourceUrl: 'https://www.hrw.org/news/2023/04/10/china-14-years-prison-prominent-rights-advocate',
  },
  {
    claim: '"The trial was conducted in accordance with Chinese law"',
    reality: 'Xu Zhiyong was held in pre-trial detention for over three years — far exceeding legal limits. His lawyers reported being denied access. The trial was held in secret at a county-level court in Shandong, far from Beijing where the alleged crimes occurred. Diplomats and journalists were denied access. The conviction rate in Chinese courts exceeds 99%, making "trial" largely a formality.',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-65226498',
  },
  {
    claim: '"Xu Zhiyong and Ding Jiaxi were treated humanely during detention"',
    reality: 'Reports from lawyers and family members indicate that both men were subjected to "residential surveillance at a designated location" (RSDL) — a form of secret detention that the UN has characterized as enforced disappearance. During RSDL, detainees are held incommunicado with no access to lawyers or family, and credible allegations of torture and mistreatment in RSDL have been extensively documented.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2023/04/china-sentencing-of-xu-zhiyong-and-ding-jiaxi/',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'Human Rights Watch',
    response: 'HRW called the sentences "a travesty of justice" and stated that Xu Zhiyong and Ding Jiaxi were "punished for peacefully promoting human rights." HRW China Director Sophie Richardson called it "a signal that China\'s government considers peaceful calls for accountability to be an existential threat."',
    sourceUrl: 'https://www.hrw.org/news/2023/04/10/china-14-years-prison-prominent-rights-advocate',
  },
  {
    entity: 'Amnesty International',
    response: 'Condemned the sentencing as "a devastating blow to the China human rights movement." Amnesty declared both men prisoners of conscience and called for their immediate and unconditional release.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2023/04/china-sentencing-of-xu-zhiyong-and-ding-jiaxi/',
  },
  {
    entity: 'United States',
    response: 'The US State Department condemned the sentences and called for the release of Xu Zhiyong and Ding Jiaxi, stating that they were "unjustly detained for exercising their fundamental freedoms."',
  },
  {
    entity: 'European Union',
    response: 'The EU called on China to release Xu Zhiyong and Ding Jiaxi, expressing "grave concern" about the deterioration of human rights in China under Xi Jinping.',
  },
  {
    entity: 'United Kingdom',
    response: 'The UK Foreign Office expressed concern over the convictions and called on China to uphold its international human rights obligations.',
  },
  {
    entity: 'Front Line Defenders',
    response: 'Condemned the sentences and called for the immediate release of both men. Noted that the convictions formed part of a broader crackdown on human rights defenders in China.',
    sourceUrl: 'https://www.frontlinedefenders.org/en/case/xu-zhiyong-detained',
  },
];

const SOURCES = [
  { name: 'BBC — 2023 Sentencing', url: 'https://www.bbc.com/news/world-asia-china-65226498', tier: 1 },
  { name: 'BBC — 2014 Sentencing', url: 'https://www.bbc.com/news/world-asia-china-25845810', tier: 1 },
  { name: 'Reuters — 2020 Arrest', url: 'https://www.reuters.com/article/us-china-rights-idUSKBN20G0DH', tier: 1 },
  { name: 'Human Rights Watch — 2023', url: 'https://www.hrw.org/news/2023/04/10/china-14-years-prison-prominent-rights-advocate', tier: 1 },
  { name: 'Amnesty International — 2023', url: 'https://www.amnesty.org/en/latest/news/2023/04/china-sentencing-of-xu-zhiyong-and-ding-jiaxi/', tier: 1 },
  { name: 'Amnesty International — 2014', url: 'https://www.amnesty.org/en/documents/asa17/001/2014/en/', tier: 1 },
  { name: 'HRW — Gongmeng closure', url: 'https://www.hrw.org/news/2009/07/17/china-legal-rights-group-shut-down', tier: 1 },
  { name: 'Front Line Defenders', url: 'https://www.frontlinedefenders.org/en/case/xu-zhiyong-detained', tier: 2 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  activism: { bg: 'bg-emerald-900/60', text: 'text-emerald-200', label: 'Activism' },
  persecution: { bg: 'bg-red-900/60', text: 'text-red-200', label: 'Persecution' },
  international: { bg: 'bg-cyan-900/60', text: 'text-cyan-200', label: 'International' },
};

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────

const TimelineEvent = ({ event, isExpanded, onToggle }) => {
  const cat = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.life;
  return (
    <div className={`border border-[#1c2a35] overflow-hidden ${cat.bg}`} aria-label={`Timeline event: ${event.title}`}>
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">{event.year}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${cat.bg} ${cat.text} border border-white/10`}>{cat.label}</span>
          <span className="text-sm font-medium text-white truncate">{event.title}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>
      {isExpanded && (
        <div className="px-4 pb-3 border-t border-white/5">
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{event.detail}</p>
          {event.sourceUrl && (
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-2">
              <ExternalLink className="w-3 h-3" /> Source
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────

export default function XuZhiyongProfile() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  const toggleEvent = (idx) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const expandAll = () => setExpandedEvents(new Set(TIMELINE.map((_, i) => i)));
  const collapseAll = () => setExpandedEvents(new Set());

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'charges', label: 'Charges & Legal Status', icon: Scale },
    { id: 'narratives', label: 'CCP Narratives', icon: AlertTriangle },
    { id: 'response', label: 'International Response', icon: Globe },
    { id: 'sources', label: 'Sources', icon: BookOpen },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlobalDisclaimer />

      {/* Back link */}
      <Link to="/profiles" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Profiles
      </Link>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-emerald-500 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-emerald-900/60 border-2 border-emerald-600 flex items-center justify-center flex-shrink-0">
            <Scale className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-emerald-400">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">IMPRISONED</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                NEW CITIZENS MOVEMENT FOUNDER
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-900/60 text-purple-300 border border-purple-700">
                PRISONER OF CONSCIENCE
              </span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-emerald-400 font-bold text-lg">14</div>
                <div className="text-slate-400 text-xs">Years sentenced</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-emerald-400 font-bold text-lg">20+</div>
                <div className="text-slate-400 text-xs">Years of advocacy</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-emerald-400 font-bold text-lg">3+</div>
                <div className="text-slate-400 text-xs">Years pre-trial</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-emerald-400 font-bold text-lg">0</div>
                <div className="text-slate-400 text-xs">Acts of violence</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              A Peking University PhD and legal scholar sentenced to 14 years for peacefully advocating government transparency and rule of law.
            </p>
          </div>
        </div>
      </div>

      {/* ─── CONTEXT ────────────────────────────────────────── */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
        <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> The New Citizens Movement
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          The New Citizens Movement called for government officials to publicly disclose their assets, for equal
          education access for children of migrant workers, and for greater government transparency — moderate
          reforms that are standard in democracies worldwide. The movement explicitly rejected violence and
          revolution, instead advocating civic participation and rule of law. For this, its founders received
          sentences of 12 to 14 years.
        </p>
      </div>

      {/* ─── TABS ───────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-1 bg-[#111820]/50 p-1 border border-[#1c2a35]" role="tablist" aria-label="Profile sections">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#111820]'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ─── TAB PANELS ─────────────────────────────────────── */}
      <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={activeTab}>
        {/* TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-400" /> Timeline — {TIMELINE.length} Events</h2>
              <div className="flex gap-2">
                <button onClick={expandAll} className="text-xs text-emerald-400 hover:text-emerald-300">Expand all</button>
                <span className="text-slate-600">|</span>
                <button onClick={collapseAll} className="text-xs text-slate-400 hover:text-white">Collapse all</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
                <span key={key} className={`text-xs px-2 py-0.5 rounded-full ${val.bg} ${val.text} border border-white/10`}>{val.label}</span>
              ))}
            </div>
            <div className="space-y-2">
              {TIMELINE.map((event, idx) => (
                <TimelineEvent key={idx} event={event} isExpanded={expandedEvents.has(idx)} onToggle={() => toggleEvent(idx)} />
              ))}
            </div>
          </div>
        )}

        {/* CHARGES & LEGAL STATUS */}
        {activeTab === 'charges' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-emerald-400" /> Charges &amp; Legal Status</h2>

            <div className="bg-emerald-900/20 border border-emerald-700/50 p-4">
              <h3 className="text-sm font-semibold text-emerald-300 mb-2">Current Legal Situation</h3>
              <p className="text-sm text-slate-300">
                Xu Zhiyong is serving a 14-year prison sentence for &quot;subversion of state power.&quot; His
                co-defendant Ding Jiaxi received 12 years on the same charge. Both men were held in pre-trial
                detention for over three years before sentencing. Their cases represent the most severe sentences
                imposed on civil rights advocates in China in recent years.
              </p>
            </div>

            {CHARGES.map((c, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-white">{c.charge}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full font-semibold bg-red-900/60 text-red-300">GUILTY</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div><span className="text-slate-400">Law:</span> <span className="text-slate-200">{c.law}</span></div>
                  <div><span className="text-slate-400">Filed:</span> <span className="text-slate-200">{c.filed}</span></div>
                  <div><span className="text-slate-400">Sentence:</span> <span className="text-red-400 font-semibold">{c.sentence}</span></div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>
        )}

        {/* CCP NARRATIVE ANALYSIS */}
        {activeTab === 'narratives' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-emerald-400" /> CCP Narrative Analysis</h2>
            <p className="text-sm text-slate-400">
              The CCP convicted Xu Zhiyong of &quot;subversion of state power&quot; for organizing peaceful civic
              activities. Each claim below is analyzed against independently verifiable facts.
              Zero CCP state media are cited as evidence.
            </p>
            {CCP_NARRATIVES.map((n, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] overflow-hidden">
                <div className="bg-red-900/30 px-5 py-3 border-b border-red-700/30">
                  <h3 className="text-sm font-semibold text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> CCP Claim #{i + 1}
                  </h3>
                  <p className="text-sm text-red-200 mt-1 italic">{n.claim}</p>
                </div>
                <div className="bg-emerald-900/20 px-5 py-3">
                  <h3 className="text-sm font-semibold text-emerald-300 mb-1">Reality (sourced)</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{n.reality}</p>
                  {n.sourceUrl && (
                    <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-2">
                      <ExternalLink className="w-3 h-3" /> Source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INTERNATIONAL RESPONSE */}
        {activeTab === 'response' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-400" /> International Response</h2>

            {INTERNATIONAL_RESPONSES.map((r, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">{r.entity}</h3>
                </div>
                <p className="text-sm text-slate-300">{r.response}</p>
                {r.sourceUrl && (
                  <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-2">
                    <ExternalLink className="w-3 h-3" /> Source
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SOURCES */}
        {activeTab === 'sources' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-emerald-400" /> Sources</h2>
            <p className="text-sm text-slate-400 mb-2">
              All information verified against independent sources. <strong className="text-slate-300">Zero CCP state media cited.</strong> Tier 1 =
              established international news/human rights organizations; Tier 2 = credible independent outlets.
            </p>
            <div className="space-y-2">
              {SOURCES.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between bg-[#111820] border border-[#1c2a35] px-4 py-3 hover:bg-[#111820] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.tier === 1 ? 'bg-emerald-900/60 text-emerald-300' : 'bg-blue-900/60 text-blue-300'}`}>
                      Tier {s.tier}
                    </span>
                    <span className="text-sm text-white">{s.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </a>
              ))}
            </div>
            <div className="bg-red-900/20 border border-red-700/30 p-4 mt-4">
              <h3 className="text-sm font-semibold text-red-300 mb-1">Excluded Sources</h3>
              <p className="text-sm text-slate-400">
                Xinhua, People&#39;s Daily, CGTN, Global Times, China Daily, and all CCP-controlled media were deliberately excluded
                as sources. CCP state media coverage of this case is referenced only as evidence of the regime&#39;s narrative strategy, not as credible reporting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
