import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer';

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

describe('Footer', () => {
  describe('structure', () => {
    it('renders a semantic footer element', () => {
      const { container } = renderFooter();
      expect(container.querySelector('footer')).toBeTruthy();
    });

    it('renders all four section headings', () => {
      renderFooter();
      expect(screen.getByText('platform')).toBeTruthy();
      expect(screen.getByText('resources')).toBeTruthy();
      expect(screen.getByText('organizations')).toBeTruthy();
      expect(screen.getByText(/emergency/)).toBeTruthy();
    });
  });

  describe('platform links', () => {
    it('renders Dashboard link', () => {
      renderFooter();
      const link = screen.getByRole('link', { name: 'Dashboard' });
      expect(link.getAttribute('href')).toBe('/');
    });

    it('renders Political Prisoners link', () => {
      renderFooter();
      const link = screen.getByRole('link', { name: 'Political Prisoners' });
      expect(link.getAttribute('href')).toBe('/prisoners');
    });

    it('renders all five platform links', () => {
      renderFooter();
      const platformLinks = ['Dashboard', 'Political Prisoners', 'Take Action', 'Education Center', 'Security Center'];
      for (const name of platformLinks) {
        expect(screen.getByRole('link', { name })).toBeTruthy();
      }
    });
  });

  describe('resource links', () => {
    it('renders all five resource links', () => {
      renderFooter();
      const resourceLinks = ['Resistance Directory', 'Intelligence Feeds', 'Profiles', 'Community', 'Data Sources'];
      for (const name of resourceLinks) {
        expect(screen.getByRole('link', { name })).toBeTruthy();
      }
    });
  });

  describe('organization links', () => {
    it('renders external organization links with target _blank', () => {
      renderFooter();
      const orgNames = ['Safeguard Defenders', 'Hong Kong Watch', 'UHRP', 'Free Tibet', 'Freedom House'];
      for (const name of orgNames) {
        const link = screen.getByRole('link', { name: new RegExp(name) });
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toContain('noopener');
      }
    });

    it('links to HTTPS URLs for organizations', () => {
      renderFooter();
      const link = screen.getByRole('link', { name: /Safeguard Defenders/ });
      expect(link.getAttribute('href')).toMatch(/^https:\/\//);
    });
  });

  describe('emergency contacts', () => {
    it('renders Front Line Defenders phone number', () => {
      renderFooter();
      expect(screen.getByText('Front Line Defenders')).toBeTruthy();
      const phoneLink = screen.getByRole('link', { name: /\+353/ });
      expect(phoneLink.getAttribute('href')).toBe('tel:+353 1 210 0489');
    });

    it('renders Access Now helpline email', () => {
      renderFooter();
      expect(screen.getByText('Access Now Helpline')).toBeTruthy();
      const emailLink = screen.getByRole('link', { name: /help@accessnow\.org/ });
      expect(emailLink.getAttribute('href')).toBe('mailto:help@accessnow.org');
    });
  });

  describe('security notice', () => {
    it('renders security notice text', () => {
      renderFooter();
      expect(screen.getByText('security_notice')).toBeTruthy();
      expect(screen.getByText(/does not collect personal data/)).toBeTruthy();
    });

    it('links to Tor Browser', () => {
      renderFooter();
      const torLink = screen.getByRole('link', { name: 'Tor Browser' });
      expect(torLink.getAttribute('href')).toBe('https://www.torproject.org/');
      expect(torLink.getAttribute('target')).toBe('_blank');
    });

    it('links to VPN resources', () => {
      renderFooter();
      const vpnLink = screen.getByRole('link', { name: 'VPN' });
      expect(vpnLink.getAttribute('href')).toMatch(/privacytools\.io/);
    });
  });

  describe('bottom bar', () => {
    it('renders version info', () => {
      renderFooter();
      expect(screen.getByText(/v2\.11\.0/)).toBeTruthy();
    });

    it('renders GitHub link', () => {
      renderFooter();
      const githubLink = screen.getByTitle('View on GitHub');
      expect(githubLink.getAttribute('href')).toContain('github.com');
      expect(githubLink.getAttribute('target')).toBe('_blank');
    });

    it('renders share on Twitter link', () => {
      renderFooter();
      const twitterLink = screen.getByTitle('Share on Twitter');
      expect(twitterLink.getAttribute('href')).toContain('twitter.com/intent/tweet');
    });

    it('renders copyright with current year', () => {
      renderFooter();
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeTruthy();
    });

    it('renders CC BY 4.0 license link', () => {
      renderFooter();
      const ccLink = screen.getByRole('link', { name: 'CC BY 4.0' });
      expect(ccLink.getAttribute('href')).toContain('creativecommons.org');
    });

    it('renders MIT license link', () => {
      renderFooter();
      const mitLink = screen.getByRole('link', { name: 'MIT' });
      expect(mitLink.getAttribute('href')).toContain('opensource.org');
    });

    it('includes solidarity text for screen readers', () => {
      renderFooter();
      expect(screen.getByText(/Liberate Hong Kong/)).toBeTruthy();
      // "Free Tibet" appears in both org links and solidarity text
      expect(screen.getAllByText(/Free Tibet/).length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('accessibility', () => {
    it('has aria-hidden on decorative ASCII borders', () => {
      const { container } = renderFooter();
      const decorative = container.querySelectorAll('[aria-hidden="true"]');
      expect(decorative.length).toBeGreaterThanOrEqual(3); // top border, bottom border, solidarity text, section pipes
    });

    it('provides screen-reader text for solidarity slogans', () => {
      const { container } = renderFooter();
      const srOnly = container.querySelector('.sr-only');
      expect(srOnly).toBeTruthy();
      expect(srOnly.textContent).toContain('Liberate Hong Kong');
    });
  });
});
