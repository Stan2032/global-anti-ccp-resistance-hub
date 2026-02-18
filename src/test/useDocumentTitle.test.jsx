import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

function wrapper({ initialEntries }) {
  return ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
}

describe('useDocumentTitle', () => {
  afterEach(() => {
    document.title = '';
  });

  it('sets the title for the dashboard route', () => {
    renderHook(() => useDocumentTitle(), {
      wrapper: wrapper({ initialEntries: ['/'] }),
    });
    expect(document.title).toBe('Dashboard | Global Anti-CCP Resistance Hub');
  });

  it('sets the title for the intelligence route', () => {
    renderHook(() => useDocumentTitle(), {
      wrapper: wrapper({ initialEntries: ['/intelligence'] }),
    });
    expect(document.title).toBe('Intelligence Feeds | Global Anti-CCP Resistance Hub');
  });

  it('sets the title for the prisoners route', () => {
    renderHook(() => useDocumentTitle(), {
      wrapper: wrapper({ initialEntries: ['/prisoners'] }),
    });
    expect(document.title).toBe('Political Prisoners | Global Anti-CCP Resistance Hub');
  });

  it('falls back to the base title for unknown routes', () => {
    renderHook(() => useDocumentTitle(), {
      wrapper: wrapper({ initialEntries: ['/nonexistent'] }),
    });
    expect(document.title).toBe('Global Anti-CCP Resistance Hub');
  });
});
