import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useWebRTCLeakCheck from '../hooks/useWebRTCLeakCheck';

// Test the IP classification regex directly (extracted from the hook)
const PRIVATE_IP_REGEX = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|fd[0-9a-f]{2}:|fe80:)/i;

describe('useWebRTCLeakCheck', () => {
  let originalRTCPeerConnection;

  beforeEach(() => {
    originalRTCPeerConnection = globalThis.RTCPeerConnection;
  });

  afterEach(() => {
    if (originalRTCPeerConnection) {
      globalThis.RTCPeerConnection = originalRTCPeerConnection;
    } else {
      delete globalThis.RTCPeerConnection;
    }
  });

  it('should initialize with idle status', () => {
    const { result } = renderHook(() => useWebRTCLeakCheck());
    expect(result.current.status).toBe('idle');
    expect(result.current.leakedIPs).toEqual([]);
    expect(result.current.isLeaking).toBeNull();
    expect(typeof result.current.runCheck).toBe('function');
  });

  it('should set unsupported when RTCPeerConnection is not available', async () => {
    delete globalThis.RTCPeerConnection;

    const { result } = renderHook(() => useWebRTCLeakCheck());
    const { act } = await import('@testing-library/react');
    await act(async () => {
      await result.current.runCheck();
    });
    expect(result.current.status).toBe('unsupported');
  });
});

describe('IP Classification (PRIVATE_IP_REGEX)', () => {
  it('should classify 192.168.x.x as private', () => {
    expect(PRIVATE_IP_REGEX.test('192.168.1.100')).toBe(true);
    expect(PRIVATE_IP_REGEX.test('192.168.0.1')).toBe(true);
    expect(PRIVATE_IP_REGEX.test('192.168.255.255')).toBe(true);
  });

  it('should classify 10.x.x.x as private', () => {
    expect(PRIVATE_IP_REGEX.test('10.0.0.1')).toBe(true);
    expect(PRIVATE_IP_REGEX.test('10.255.255.255')).toBe(true);
  });

  it('should classify 172.16-31.x.x as private', () => {
    expect(PRIVATE_IP_REGEX.test('172.16.0.1')).toBe(true);
    expect(PRIVATE_IP_REGEX.test('172.20.10.5')).toBe(true);
    expect(PRIVATE_IP_REGEX.test('172.31.255.255')).toBe(true);
  });

  it('should NOT classify 172.32+ as private', () => {
    expect(PRIVATE_IP_REGEX.test('172.32.0.1')).toBe(false);
    expect(PRIVATE_IP_REGEX.test('172.15.0.1')).toBe(false);
  });

  it('should classify fe80: link-local IPv6 as private', () => {
    expect(PRIVATE_IP_REGEX.test('fe80::')).toBe(true);
  });

  it('should classify fd00: unique local IPv6 as private', () => {
    expect(PRIVATE_IP_REGEX.test('fd00::')).toBe(true);
    expect(PRIVATE_IP_REGEX.test('fdab::')).toBe(true);
  });

  it('should NOT classify public IPs as private', () => {
    expect(PRIVATE_IP_REGEX.test('203.0.113.50')).toBe(false);
    expect(PRIVATE_IP_REGEX.test('8.8.8.8')).toBe(false);
    expect(PRIVATE_IP_REGEX.test('1.1.1.1')).toBe(false);
    expect(PRIVATE_IP_REGEX.test('142.250.80.46')).toBe(false);
  });
});
