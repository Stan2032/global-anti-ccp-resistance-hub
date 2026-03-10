import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to test the logger module; import it after mocking
describe('Logger Utility', () => {
  let logger: typeof import('../utils/logger').logger;

  beforeEach(async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    // Dynamic import to get fresh module
    const mod = await import('../utils/logger');
    logger = mod.logger;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exports a logger object with 4 level methods', () => {
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('logger.error calls console.error with context prefix', () => {
    logger.error('test', 'something failed', { code: 42 });
    expect(console.error).toHaveBeenCalledWith('[test]', 'something failed', { code: 42 });
  });

  it('logger.warn calls console.warn with context prefix', () => {
    logger.warn('feed', 'timeout after 10s');
    expect(console.warn).toHaveBeenCalledWith('[feed]', 'timeout after 10s');
  });

  it('logger.error works with Error objects', () => {
    const err = new Error('Test error');
    logger.error('clipboard', 'Failed to copy:', err);
    expect(console.error).toHaveBeenCalledWith('[clipboard]', 'Failed to copy:', err);
  });

  it('logger.warn works with multiple arguments', () => {
    logger.warn('encryption', 'Encryption failed', 'fallback used', { encrypted: false });
    expect(console.warn).toHaveBeenCalledWith(
      '[encryption]',
      'Encryption failed',
      'fallback used',
      { encrypted: false }
    );
  });

  it('logger.error accepts empty additional arguments', () => {
    logger.error('boundary', 'Error caught');
    expect(console.error).toHaveBeenCalledWith('[boundary]', 'Error caught');
  });

  it('context prefix is formatted correctly with brackets', () => {
    logger.error('my-component', 'msg');
    const call = (console.error as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toBe('[my-component]');
  });

  it('all four logger methods are callable without throwing', () => {
    expect(() => logger.error('ctx', 'msg')).not.toThrow();
    expect(() => logger.warn('ctx', 'msg')).not.toThrow();
    expect(() => logger.info('ctx', 'msg')).not.toThrow();
    expect(() => logger.debug('ctx', 'msg')).not.toThrow();
  });
});
