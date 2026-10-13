/**
 * ProfileFacts — where a person is now, their sentence and their
 * nationality, at the top of their profile page.
 *
 * Twelve profile pages kept these facts in their PROFILE objects and never
 * showed them, so a correction made there changed nothing a reader saw
 * (Gao Zhisheng's location was one). Joshua Wong's page never said he is
 * held in Stanley Prison, nor Gui Minhai's that his whereabouts are
 * withheld.
 *
 * @module ProfileFacts
 */
import { MapPin, Scale, Flag, type LucideIcon } from 'lucide-react';

interface ProfileFactsProps {
  location?: string;
  sentence?: string;
  nationality?: string;
}

const ProfileFacts = ({ location, sentence, nationality }: ProfileFactsProps) => {
  const facts: { label: string; value?: string; Icon: LucideIcon }[] = [
    { label: 'Where now', value: location, Icon: MapPin },
    { label: 'Sentence', value: sentence, Icon: Scale },
    { label: 'Nationality', value: nationality, Icon: Flag },
  ];
  const shown = facts.filter(f => f.value);
  if (shown.length === 0) return null;

  return (
    // Stacked on phones, where a second column leaves the facts a few words
    // wide; side by side from the sm breakpoint.
    <dl className="grid gap-y-1 sm:grid-cols-[auto_1fr] sm:gap-x-3 text-sm mb-4">
      {shown.map(({ label, value, Icon }) => (
        <div key={label} className="contents">
          <dt className="flex items-center gap-1.5 self-start text-slate-400">
            <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {label}
          </dt>
          <dd className="text-slate-300 min-w-0 break-words mb-1.5 sm:mb-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default ProfileFacts;
