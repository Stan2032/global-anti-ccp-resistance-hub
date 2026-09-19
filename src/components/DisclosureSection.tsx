/**
 * A collapsible section built on native <details>/<summary>.
 *
 * ## Why native, and not the tab/expand pattern used elsewhere
 *
 * Every other disclosure in this app is driven by React state. That works
 * for readers with JavaScript and fails completely for readers without it:
 * the closed panels are never rendered, and clicking the control does
 * nothing. This site tells readers in China to use Tor Browser on Safer or
 * Safest, which disables JavaScript, so those readers get a control that
 * looks interactive and is not.
 *
 * <details> is the browser's own disclosure widget. It opens and closes with
 * no JavaScript at all, it is keyboard operable and announced correctly by
 * screen readers for free, and browsers expand it to reveal a find-in-page
 * match. The content is in the pre-rendered HTML either way, so nothing is
 * hidden from a reader, a crawler or a text-mode browser — it is only folded
 * up until asked for.
 *
 * Deliberately uncontrolled: `open` is set once as the initial attribute and
 * the browser owns it thereafter. There is no state to desynchronise during
 * hydration.
 *
 * @module DisclosureSection
 */
import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface DisclosureSectionProps {
  /** Short label for the row — this is what a reader scans. */
  title: string;
  /** One line saying what the section is for, shown next to the title. */
  description?: string;
  /** Open on first render. Reserve for the few sections worth the space. */
  defaultOpen?: boolean;
  /** Anchor target, so a section can be linked to directly. */
  id?: string;
  children: ReactNode;
}

export function DisclosureSection({
  title,
  description,
  defaultOpen = false,
  id,
  children,
}: DisclosureSectionProps) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group bg-[#111820]/50 border border-[#1c2a35] [&[open]]:bg-[#111820]"
    >
      <summary
        className="flex items-start gap-3 p-4 cursor-pointer list-none
                   hover:bg-[#1c2a35]/60 focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-[#4afa82] [&::-webkit-details-marker]:hidden"
      >
        <ChevronRight
          className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#4afa82] transition-transform
                     group-open:rotate-90"
          aria-hidden="true"
        />
        <span className="min-w-0">
          <span className="block font-semibold text-white">{title}</span>
          {description && (
            <span className="block text-sm text-slate-400 mt-0.5">{description}</span>
          )}
        </span>
      </summary>
      <div className="px-4 pb-4 sm:px-6 sm:pb-6 border-t border-[#1c2a35] pt-4">
        {children}
      </div>
    </details>
  );
}

export default DisclosureSection;
