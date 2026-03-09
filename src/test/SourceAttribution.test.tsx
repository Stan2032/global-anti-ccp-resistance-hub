import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SourceAttribution, { SourcesList, InlineSource } from '../components/ui/SourceAttribution';

describe('SourceAttribution', () => {
  const mockSource = {
    name: 'Amnesty International',
    url: 'https://www.amnesty.org/',
    type: 'NGO Report',
    verified: true,
    date: '2024-01-15'
  };

  it('should render nothing when source is null', () => {
    const { container } = render(<SourceAttribution source={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when source has no URL', () => {
    const { container } = render(<SourceAttribution source={{ name: 'Test' }} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the source name', () => {
    render(<SourceAttribution source={mockSource} />);
    expect(screen.getByText('Amnesty International')).toBeTruthy();
  });

  it('should render a link to the source URL', () => {
    render(<SourceAttribution source={mockSource} />);
    const link = screen.getByText('View Source').closest('a');
    expect(link.getAttribute('href')).toBe('https://www.amnesty.org/');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render the source type badge', () => {
    render(<SourceAttribution source={mockSource} />);
    expect(screen.getByText('NGO Report')).toBeTruthy();
  });

  it('should render compact version when compact prop is true', () => {
    render(<SourceAttribution source={mockSource} compact />);
    const link = screen.getByText('Amnesty International').closest('a');
    expect(link.getAttribute('href')).toBe('https://www.amnesty.org/');
  });

  it('should show verified indicator for verified sources', () => {
    const { container } = render(<SourceAttribution source={mockSource} />);
    // Verified sources should show a green checkmark (title="Verified Source")
    expect(container.querySelector('[title="Verified Source"]')).toBeTruthy();
  });

  it('should show unverified indicator for unverified sources', () => {
    const unverifiedSource = { ...mockSource, verified: false };
    const { container } = render(<SourceAttribution source={unverifiedSource} />);
    expect(container.querySelector('[title="Unverified Source"]')).toBeTruthy();
  });
});

describe('SourcesList', () => {
  const mockSources = [
    { name: 'Source A', url: 'https://a.com/', type: 'News Report', verified: true },
    { name: 'Source B', url: 'https://b.com/', type: 'NGO Report', verified: true }
  ];

  it('should render nothing when sources array is empty', () => {
    const { container } = render(<SourcesList sources={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when sources is null', () => {
    const { container } = render(<SourcesList sources={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the title with source count', () => {
    render(<SourcesList sources={mockSources} />);
    expect(screen.getByText('Sources')).toBeTruthy();
    expect(screen.getByText('(2)')).toBeTruthy();
  });

  it('should render all sources', () => {
    render(<SourcesList sources={mockSources} />);
    expect(screen.getByText('Source A')).toBeTruthy();
    expect(screen.getByText('Source B')).toBeTruthy();
  });
});

describe('InlineSource', () => {
  it('should render nothing when source is null', () => {
    const { container } = render(<InlineSource source={null} number={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the citation number', () => {
    const source = { name: 'Test', url: 'https://test.com/' };
    render(<InlineSource source={source} number={3} />);
    expect(screen.getByText('[3]')).toBeTruthy();
  });

  it('should render a link to the source', () => {
    const source = { name: 'Test', url: 'https://test.com/' };
    render(<InlineSource source={source} number={1} />);
    const link = screen.getByText('[1]').closest('a');
    expect(link.getAttribute('href')).toBe('https://test.com/');
  });
});
