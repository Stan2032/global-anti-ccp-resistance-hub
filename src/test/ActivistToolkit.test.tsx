import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import ActivistToolkit from '../components/ActivistToolkit';
import { LETTER_TEMPLATES, LETTER_TOPICS, letterAsText } from '../data/letterTemplates';

/*
 * The toolkit listed twenty banners, fact sheets, guides and social media
 * kits with file sizes and Download buttons, and none of the files existed
 * (Q20). The owner chose to list a resource only once its file exists, so it
 * now offers the letter templates, which did exist, as plain-text files.
 */
const downloads = () => screen.getAllByRole('link', { name: /^Download the .+ letter$/ });

const decode = (href: string) => decodeURIComponent(href.replace(/^data:text\/plain;charset=utf-8,/, ''));

describe('ActivistToolkit', () => {
  it('renders the header with title', () => {
    render(<ActivistToolkit />);
    expect(screen.getByText('Activist Toolkit')).toBeTruthy();
    expect(screen.getByText(`${LETTER_TOPICS.length} letter templates, ready to download`)).toBeTruthy();
  });

  it('offers one download per letter template', () => {
    render(<ActivistToolkit />);
    expect(downloads()).toHaveLength(LETTER_TOPICS.length);
    expect(LETTER_TOPICS.length).toBeGreaterThan(0);
  });

  it('each download is the letter itself, as a plain-text file that needs no JavaScript', () => {
    render(<ActivistToolkit />);
    const links = downloads();
    LETTER_TOPICS.forEach((topic, i) => {
      const link = links[i];
      expect(link.getAttribute('download')).toBe(`letter-to-representative-${topic.id}.txt`);
      const href = link.getAttribute('href')!;
      expect(href.startsWith('data:text/plain;charset=utf-8,')).toBe(true);
      const text = decode(href);
      expect(text).toBe(letterAsText(topic.id));
      expect(text).toContain(LETTER_TEMPLATES[topic.id].subject);
      expect(text).toContain(LETTER_TEMPLATES[topic.id].body);
    });
  });

  it('lists nothing that cannot be downloaded', () => {
    const { container } = render(<ActivistToolkit />);
    expect(screen.queryByText('Not available yet')).toBeNull();
    expect(container.querySelectorAll('a[href="#"]')).toHaveLength(0);
    for (const gone of ['Free Jimmy Lai Banner', 'Uyghur Genocide Fact Sheet', 'Social Media Calendar']) {
      expect(screen.queryByText(gone), gone).toBeNull();
    }
    // No invented file sizes.
    expect(container.textContent).not.toMatch(/\b\d+(\.\d+)?\s?(KB|MB)\b/);
  });

  it('points to the letters in full on the same page', () => {
    render(<ActivistToolkit />);
    const link = screen.getByRole('link', { name: 'Contact your representative' });
    expect(link.getAttribute('href')).toBe('#representatives');
  });

  it('renders usage guidelines', () => {
    render(<ActivistToolkit />);
    expect(screen.getByText('Usage Guidelines')).toBeTruthy();
    expect(screen.getByText(/free for non-commercial/)).toBeTruthy();
  });

  it('renders request resource section', () => {
    render(<ActivistToolkit />);
    expect(screen.getByText('Need Something Specific?')).toBeTruthy();
    const request = screen.getByText('Request a Resource on GitHub').closest('a')!;
    expect(request.getAttribute('href')).toBe('https://github.com/Stan2032/global-anti-ccp-resistance-hub/issues/new');
    expect(request.getAttribute('rel')).toContain('noopener');
  });
});
