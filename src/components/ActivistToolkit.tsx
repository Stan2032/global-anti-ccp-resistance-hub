/**
 * ActivistToolkit — Resources for activists that exist and can be
 * downloaded: today, the letter templates for writing to representatives,
 * as plain-text files.
 *
 * It used to list twenty banners, fact sheets, guides and social media kits
 * with file sizes and Download buttons, none of which was ever produced.
 * The owner chose (Q20, October 2026) to list a resource only once its file
 * exists. The letters already existed as text in ContactRepresentatives, so
 * they come first.
 *
 * Each download is a data: URL with a download attribute, so it works with
 * JavaScript off, the way readers on Tor Browser's Safest setting use the site.
 *
 * @module ActivistToolkit
 */
import { Download, FileText, Wrench } from 'lucide-react';
import { LETTER_TOPICS, letterAsText } from '../data/letterTemplates';

const fileName = (id: string) => `letter-to-representative-${id}.txt`;
const dataUrl = (text: string) => `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;

const ActivistToolkit = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-green-500">
      <div className="flex items-center mb-4">
        <Wrench className="w-8 h-8 text-green-400 mr-3" aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-bold text-white">Activist Toolkit</h2>
          <p className="text-slate-400">
            {LETTER_TOPICS.length} letter templates, ready to download
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-300">
        Plain-text letters to send to your elected representatives. Fill in the parts in [brackets]
        before sending. The same letters can be read and copied in full
        under <a href="#representatives" className="text-[#4afa82] hover:underline">Contact your representative</a>.
      </p>
    </div>

    {/* Letters */}
    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Letter templates to download">
      {LETTER_TOPICS.map((topic) => (
        <li
          key={topic.id}
          className="bg-[#111820]/50 border border-[#1c2a35] p-4 hover:border-green-600/50 transition-colors flex flex-col"
        >
          <div className="flex items-start justify-between mb-3">
            <FileText className="w-8 h-8 text-slate-400" aria-hidden="true" />
            <span className="text-xs px-2 py-1 bg-[#111820] text-slate-300">TXT</span>
          </div>
          <h3 className="font-bold text-white mb-3">Letter to a representative: {topic.name}</h3>
          <a
            href={dataUrl(letterAsText(topic.id))}
            download={fileName(topic.id)}
            className="mt-auto w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download the {topic.name} letter</span>
          </a>
        </li>
      ))}
    </ul>

    {/* Request Resources */}
    <div className="bg-[#111820]/50 border border-[#1c2a35] p-6 text-center">
      <h3 className="text-lg font-bold text-white mb-2">Need Something Specific?</h3>
      <p className="text-sm text-slate-400 mb-4">
        Banners, fact sheets and guides are listed here once they exist. Tell us what would help your advocacy.
      </p>
      <a
        href="https://github.com/Stan2032/global-anti-ccp-resistance-hub/issues/new"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-2 bg-[#111820] hover:bg-[#1c2a35] text-white text-sm font-medium transition-colors"
      >
        Request a Resource on GitHub
      </a>
    </div>

    {/* Usage Guidelines */}
    <div className="bg-[#111820] border border-[#1c2a35] p-4">
      <h3 className="font-medium text-white mb-2">Usage Guidelines</h3>
      <ul className="text-sm text-slate-300 space-y-1">
        <li>• All resources are free for non-commercial human rights advocacy</li>
        <li>• Please credit the Global Resistance Hub when possible</li>
        <li>• Do not modify resources in ways that misrepresent the facts</li>
        <li>• Share widely to maximize impact</li>
      </ul>
    </div>
  </div>
);

export default ActivistToolkit;
