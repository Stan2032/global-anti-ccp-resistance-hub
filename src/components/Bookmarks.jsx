import React, { useState, useEffect } from 'react';
import { Library, BookOpen, Landmark, Newspaper, FlaskConical, Megaphone, Wrench, Bookmark, Pin } from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('resistanceBookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', category: 'resource', notes: '' });

  useEffect(() => {
    localStorage.setItem('resistanceBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const categories = [
    { id: 'all', name: 'All Bookmarks', Icon: Library },
    { id: 'resource', name: 'Resources', Icon: BookOpen },
    { id: 'organization', name: 'Organizations', Icon: Landmark },
    { id: 'news', name: 'News Sources', Icon: Newspaper },
    { id: 'research', name: 'Research', Icon: FlaskConical },
    { id: 'action', name: 'Take Action', Icon: Megaphone },
    { id: 'tool', name: 'Tools', Icon: Wrench },
  ];

  const suggestedBookmarks = [
    { title: 'Safeguard Defenders', url: 'https://safeguarddefenders.com', category: 'organization', description: 'Documenting transnational repression' },
    { title: 'Hong Kong Watch', url: 'https://www.hongkongwatch.org', category: 'organization', description: 'Monitoring HK human rights' },
    { title: 'UHRP', url: 'https://uhrp.org', category: 'organization', description: 'Uyghur Human Rights Project' },
    { title: 'Radio Free Asia', url: 'https://www.rfa.org', category: 'news', description: 'Independent news on Asia' },
    { title: 'Hong Kong Free Press', url: 'https://hongkongfp.com', category: 'news', description: 'Independent HK news' },
    { title: 'ASPI', url: 'https://www.aspi.org.au', category: 'research', description: 'Australian Strategic Policy Institute' },
    { title: 'Xinjiang Victims Database', url: 'https://shahit.biz', category: 'research', description: '35,000+ documented cases' },
    { title: 'CECC', url: 'https://www.cecc.gov', category: 'resource', description: 'Congressional-Executive Commission on China' },
    { title: 'Tor Browser', url: 'https://www.torproject.org', category: 'tool', description: 'Anonymous browsing' },
    { title: 'Signal', url: 'https://signal.org', category: 'tool', description: 'Encrypted messaging' },
  ];

  const addBookmark = (bookmark) => {
    const newBm = {
      ...bookmark,
      id: Date.now(),
      addedAt: new Date().toISOString(),
    };
    setBookmarks([...bookmarks, newBm]);
    setNewBookmark({ title: '', url: '', category: 'resource', notes: '' });
    setShowAddForm(false);
  };

  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter(bm => bm.id !== id));
  };

  const isBookmarked = (url) => bookmarks.some(bm => bm.url === url);

  const filteredBookmarks = activeCategory === 'all' 
    ? bookmarks 
    : bookmarks.filter(bm => bm.category === activeCategory);

  const getCategoryInfo = (categoryId) => categories.find(c => c.id === categoryId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bookmark className="w-8 h-8 text-yellow-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">Your Bookmarks</h2>
              <p className="text-slate-400">Save and organize important resources</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Add Bookmark
          </button>
        </div>
        <p className="text-sm text-slate-400">
          {bookmarks.length} bookmarks saved • Data stored locally in your browser
        </p>
      </div>

      {/* Add Bookmark Form */}
      {showAddForm && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-4">Add New Bookmark</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Title</label>
              <input
                aria-label="Title"
                type="text"
                value={newBookmark.title}
                onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                placeholder="Resource name"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">URL</label>
              <input
                aria-label="URL"
                type="url"
                value={newBookmark.url}
                onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select
                aria-label="Category"
                value={newBookmark.category}
                onChange={(e) => setNewBookmark({ ...newBookmark, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
              >
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Notes (optional)</label>
              <input
                aria-label="Notes (optional)"
                type="text"
                value={newBookmark.notes}
                onChange={(e) => setNewBookmark({ ...newBookmark, notes: e.target.value })}
                placeholder="Personal notes..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => addBookmark(newBookmark)}
              disabled={!newBookmark.title || !newBookmark.url}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save Bookmark
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <cat.Icon className="w-4 h-4" />
            <span>{cat.name}</span>
            {cat.id !== 'all' && (
              <span className="text-xs opacity-70">
                ({bookmarks.filter(bm => bm.category === cat.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length > 0 ? (
        <div className="space-y-2">
          {filteredBookmarks.map(bookmark => {
            const categoryInfo = getCategoryInfo(bookmark.category);
            return (
              <div 
                key={bookmark.id}
                className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 flex items-center justify-between group hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {categoryInfo?.Icon && <categoryInfo.Icon className="w-5 h-5 text-slate-400" />}
                  <div>
                    <a 
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-white hover:text-yellow-400 transition-colors"
                    >
                      {bookmark.title}
                    </a>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span>{new URL(bookmark.url).hostname}</span>
                      {bookmark.notes && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">{bookmark.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove bookmark"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
          <Bookmark className="w-10 h-10 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">No bookmarks yet</p>
          <p className="text-sm text-slate-500">Start by adding suggested resources below</p>
        </div>
      )}

      {/* Suggested Bookmarks */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <h3 className="font-medium text-white mb-4 flex items-center gap-2"><Pin className="w-4 h-4" /> Suggested Resources</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {suggestedBookmarks.map((suggestion, idx) => {
            const alreadyBookmarked = isBookmarked(suggestion.url);
            const categoryInfo = getCategoryInfo(suggestion.category);
            
            return (
              <div 
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  alreadyBookmarked 
                    ? 'bg-green-900/20 border border-green-700/50' 
                    : 'bg-slate-900/50 border border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {categoryInfo?.Icon && <categoryInfo.Icon className="w-4 h-4 text-slate-400" />}
                  <div>
                    <a 
                      href={suggestion.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-white text-sm hover:text-yellow-400"
                    >
                      {suggestion.title}
                    </a>
                    <p className="text-xs text-slate-500">{suggestion.description}</p>
                  </div>
                </div>
                {alreadyBookmarked ? (
                  <span className="text-green-400 text-sm">✓ Saved</span>
                ) : (
                  <button
                    onClick={() => addBookmark({ ...suggestion, notes: '' })}
                    className="text-yellow-400 hover:text-yellow-300 text-sm"
                  >
                    + Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Export/Import */}
      <div className="flex justify-center space-x-4 text-sm">
        <button
          onClick={() => {
            const data = JSON.stringify(bookmarks, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resistance-bookmarks.json';
            a.click();
          }}
          className="text-slate-400 hover:text-slate-300"
        >
          Export Bookmarks
        </button>
        <span className="text-slate-600">•</span>
        <label className="text-slate-400 hover:text-slate-300 cursor-pointer">
          Import Bookmarks
          <input
            aria-label="Select bookmarks file"
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const imported = JSON.parse(event.target.result);
                    setBookmarks([...bookmarks, ...imported]);
                  } catch (err) {
                    alert('Invalid bookmark file');
                  }
                };
                reader.readAsText(file);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default Bookmarks;
