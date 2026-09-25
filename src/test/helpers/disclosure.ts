/**
 * Assertions for sections built on DisclosureSection (native <details>).
 *
 * These sections replaced React-state tab bars and view toggles. A tab bar
 * rendered one panel at a time, so its tests clicked a tab and then looked
 * for the panel. A <details> section keeps every panel in the document from
 * the first render, so the useful assertions are different: each title is a
 * real <summary>, the panel content is present without any interaction, and
 * nothing of the old tab widget is left behind.
 */
import { screen, within } from '@testing-library/react';
import { expect } from 'vitest';

/** The <details> element whose <summary> carries exactly this title. */
export function disclosureFor(title: string): HTMLDetailsElement {
  const summaries = screen
    .getAllByText(title)
    .map((el) => el.closest('summary'))
    .filter((el): el is HTMLElement => el !== null);
  expect(summaries, `exactly one <summary> titled "${title}"`).toHaveLength(1);
  const details = summaries[0].parentElement;
  expect(details?.tagName, `"${title}" <summary> sits in a <details>`).toBe('DETAILS');
  return details as HTMLDetailsElement;
}

/** Queries scoped to the content of the section with this title. */
export function inSection(title: string) {
  return within(disclosureFor(title));
}

/** Every title is a native disclosure section and no tab widget remains. */
export function expectDisclosureSections(titles: readonly string[]): void {
  for (const title of titles) disclosureFor(title);
  expect(screen.queryAllByRole('tab')).toHaveLength(0);
  expect(screen.queryAllByRole('tablist')).toHaveLength(0);
}
