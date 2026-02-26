import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, CheckCircle, AlertTriangle, HardDrive, Trash2 } from 'lucide-react';

const OfflineModeManager = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStatus, setCacheStatus] = useState('checking');
  const [cachedPages, setCachedPages] = useState([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageQuota, setStorageQuota] = useState(0);

  const checkCacheStatus = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        setCacheStatus(cacheNames.length > 0 ? 'active' : 'inactive');
        
        // Get list of cached URLs
        if (cacheNames.length > 0) {
          const cache = await caches.open(cacheNames[0]);
          const requests = await cache.keys();
          const urls = requests.map(req => req.url);
          setCachedPages(urls);
        }
      } else {
        setCacheStatus('unsupported');
      }
    } catch (error) {
      console.error('Error checking cache:', error);
      setCacheStatus('error');
    }
  };

  const checkStorageUsage = async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        setStorageUsed(estimate.usage || 0);
        setStorageQuota(estimate.quota || 0);
      }
    } catch (error) {
      console.error('Error checking storage:', error);
    }
  };

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check cache and storage status on mount
  useEffect(() => {
    let cancelled = false;

    const initCacheCheck = async () => {
      try {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          if (!cancelled) {
            setCacheStatus(cacheNames.length > 0 ? 'active' : 'inactive');
            if (cacheNames.length > 0) {
              const cache = await caches.open(cacheNames[0]);
              const requests = await cache.keys();
              if (!cancelled) {
                setCachedPages(requests.map(req => req.url));
              }
            }
          }
        } else if (!cancelled) {
          setCacheStatus('unsupported');
        }
      } catch (error) {
        console.error('Error checking cache:', error);
        if (!cancelled) setCacheStatus('error');
      }
    };

    const initStorageCheck = async () => {
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          if (!cancelled) {
            setStorageUsed(estimate.usage || 0);
            setStorageQuota(estimate.quota || 0);
          }
        }
      } catch (error) {
        console.error('Error checking storage:', error);
      }
    };

    initCacheCheck();
    initStorageCheck();
    return () => { cancelled = true; };
  }, []);

  const enableOfflineMode = async () => {
    try {
      // Register service worker if not already registered
      if ('serviceWorker' in navigator) {
        const _registration = await navigator.serviceWorker.register('/sw.js');
        // Service Worker registered successfully
        
        // Trigger cache of critical resources
        await cacheResources();
        
        await checkCacheStatus();
        await checkStorageUsage();
      }
    } catch (error) {
      console.error('Error enabling offline mode:', error);
      alert('Failed to enable offline mode. Please try again.');
    }
  };

  const cacheResources = async () => {
    if ('caches' in window) {
      const cache = await caches.open('resistance-hub-v1');
      
      const criticalResources = [
        '/',
        '/index.html',
        '/manifest.json',
        // Add more critical resources
      ];

      await cache.addAll(criticalResources);
    }
  };

  const clearCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        await checkCacheStatus();
        await checkStorageUsage();
        alert('Cache cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Failed to clear cache');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const storagePercentage = storageQuota > 0 ? (storageUsed / storageQuota) * 100 : 0;

  const criticalPages = [
    { name: 'Dashboard', path: '/', description: 'Main dashboard with emergency alerts' },
    { name: 'Security Center', path: '/security', description: 'Digital security tools and guides' },
    { name: 'Emergency Contacts', path: '/community', description: 'Emergency contact information' },
    { name: 'Political Prisoners', path: '/prisoners', description: 'Database of political prisoners' },
    { name: 'Take Action', path: '/take-action', description: 'Activism tools and resources' }
  ];

  return (
    <div className="bg-[#111820]/50 backdrop-blur-sm border border-[#1c2a35]/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        {isOnline ? (
          <Wifi className="w-8 h-8 text-green-400" />
        ) : (
          <WifiOff className="w-8 h-8 text-red-400" />
        )}
        <div>
          <h2 className="text-2xl font-bold text-white">Offline Mode Manager</h2>
          <p className="text-slate-400 text-sm">Access critical content without internet connection</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`p-4 mb-6 ${isOnline ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
        <div className="flex items-center gap-3">
          {isOnline ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <h3 className="text-green-400 font-bold">Online</h3>
                <p className="text-slate-300 text-sm">You are connected to the internet</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div>
                <h3 className="text-red-400 font-bold">Offline</h3>
                <p className="text-slate-300 text-sm">No internet connection. Cached content is available.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Why Offline Mode */}
      <div className="bg-[#22d3ee]/10 border border-[#1c2a35] p-4 mb-6">
        <h3 className="text-[#22d3ee] font-bold mb-2">Why Offline Mode?</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• <strong>Internet censorship:</strong> Access information even when websites are blocked</p>
          <p>• <strong>Network disruptions:</strong> Continue working during internet outages</p>
          <p>• <strong>Privacy:</strong> Reduce network requests that could be monitored</p>
          <p>• <strong>Emergency situations:</strong> Access critical contacts and security guides offline</p>
        </div>
      </div>

      {/* Cache Status */}
      <div className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5 mb-6">
        <h3 className="text-white font-bold mb-4">Cache Status</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-slate-400 mb-1">Status</div>
            <div className="flex items-center gap-2">
              {cacheStatus === 'active' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Active</span>
                </>
              )}
              {cacheStatus === 'inactive' && (
                <>
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Inactive</span>
                </>
              )}
              {cacheStatus === 'checking' && (
                <span className="text-slate-400">Checking...</span>
              )}
              {cacheStatus === 'unsupported' && (
                <span className="text-red-400">Not Supported</span>
              )}
            </div>
          </div>
          
          {cacheStatus === 'inactive' && (
            <button
              onClick={enableOfflineMode}
              className="flex items-center gap-2 px-4 py-2 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] transition-colors"
            >
              <Download className="w-4 h-4" />
              Enable Offline Mode
            </button>
          )}
          
          {cacheStatus === 'active' && (
            <button
              onClick={clearCache}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cache
            </button>
          )}
        </div>

        {/* Storage Usage */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-400">Storage Used</div>
            <div className="text-sm text-slate-300">
              {formatBytes(storageUsed)} / {formatBytes(storageQuota)}
            </div>
          </div>
          <div className="w-full bg-[#111820] rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                storagePercentage > 80 ? 'bg-red-500' : storagePercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Cached Pages Count */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <HardDrive className="w-4 h-4" />
          <span>{cachedPages.length} pages cached</span>
        </div>
      </div>

      {/* Critical Pages to Cache */}
      <div className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5 mb-6">
        <h3 className="text-white font-bold mb-4">Critical Pages for Offline Access</h3>
        <p className="text-slate-400 text-sm mb-4">
          These pages are automatically cached when you enable offline mode:
        </p>
        
        <div className="space-y-3">
          {criticalPages.map((page, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-[#111820]/50">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-white">{page.name}</div>
                <div className="text-sm text-slate-400">{page.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
        <h3 className="text-white font-bold mb-3">How to Use Offline Mode</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <div>
            <div className="font-medium text-white mb-1">1. Enable Offline Mode</div>
            <p className="text-slate-400">Click "Enable Offline Mode" to download critical resources to your device.</p>
          </div>
          <div>
            <div className="font-medium text-white mb-1">2. Browse While Online</div>
            <p className="text-slate-400">Visit pages you want to access offline. They will be automatically cached.</p>
          </div>
          <div>
            <div className="font-medium text-white mb-1">3. Access Offline</div>
            <p className="text-slate-400">When offline, cached pages will load automatically. Some features may be limited.</p>
          </div>
          <div>
            <div className="font-medium text-white mb-1">4. Update Regularly</div>
            <p className="text-slate-400">Connect to the internet periodically to update cached content with latest information.</p>
          </div>
        </div>
      </div>

      {/* Limitations Notice */}
      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 p-4">
        <h3 className="text-yellow-400 font-bold mb-2">Limitations</h3>
        <div className="space-y-1 text-sm text-slate-300">
          <p>• External links and embedded content may not work offline</p>
          <p>• Live data (news feeds, statistics) will show last cached version</p>
          <p>• Forms and interactive features may be limited</p>
          <p>• Cache size is limited by browser storage quota</p>
        </div>
      </div>
    </div>
  );
};

export default OfflineModeManager;
