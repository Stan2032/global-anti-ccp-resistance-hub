import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Clock, Award, TrendingUp, RotateCcw, ExternalLink, Star, Filter, Library, GraduationCap, Trophy, Book, FileText, Newspaper } from 'lucide-react';

const readingMaterials = [
  // Books
  { id: 'book-1', type: 'book', title: 'The Uyghurs: Strangers in Their Own Land', author: 'Gardner Bovingdon', pages: 280, category: 'Uyghur', difficulty: 'Academic', essential: true },
  { id: 'book-2', type: 'book', title: 'The People\'s Republic of Amnesia', author: 'Louisa Lim', pages: 256, category: 'Tiananmen', difficulty: 'General', essential: true },
  { id: 'book-3', type: 'book', title: 'Unfreedom of the Press', author: 'Jimmy Lai', pages: 272, category: 'Hong Kong', difficulty: 'General', essential: true },
  { id: 'book-4', type: 'book', title: 'The Gate of Heavenly Peace', author: 'Jonathan Spence', pages: 512, category: 'History', difficulty: 'Academic', essential: false },
  { id: 'book-5', type: 'book', title: 'Tibet: A History', author: 'Sam van Schaik', pages: 352, category: 'Tibet', difficulty: 'General', essential: true },
  { id: 'book-6', type: 'book', title: 'Red Roulette', author: 'Desmond Shum', pages: 320, category: 'CCP Elite', difficulty: 'General', essential: false },
  { id: 'book-7', type: 'book', title: 'The Third Revolution', author: 'Elizabeth Economy', pages: 368, category: 'Xi Jinping', difficulty: 'Academic', essential: false },
  { id: 'book-8', type: 'book', title: 'Surveillance State', author: 'Josh Chin & Liza Lin', pages: 320, category: 'Surveillance', difficulty: 'General', essential: true },
  
  // Reports
  { id: 'report-1', type: 'report', title: 'Uyghur Genocide Report', author: 'Newlines Institute', pages: 55, category: 'Uyghur', difficulty: 'Report', essential: true },
  { id: 'report-2', type: 'report', title: 'Xinjiang Police Files', author: 'Dr. Adrian Zenz', pages: 100, category: 'Uyghur', difficulty: 'Report', essential: true },
  { id: 'report-3', type: 'report', title: '110 Overseas Report', author: 'Safeguard Defenders', pages: 30, category: 'Transnational', difficulty: 'Report', essential: true },
  { id: 'report-4', type: 'report', title: 'Uyghurs for Sale', author: 'ASPI', pages: 45, category: 'Forced Labor', difficulty: 'Report', essential: true },
  { id: 'report-5', type: 'report', title: 'Freedom in the World: China', author: 'Freedom House', pages: 20, category: 'Human Rights', difficulty: 'Report', essential: false },
  
  // Articles
  { id: 'article-1', type: 'article', title: 'China\'s Detention Camps for Muslims', author: 'The New Yorker', pages: 15, category: 'Uyghur', difficulty: 'General', essential: true },
  { id: 'article-2', type: 'article', title: 'Inside China\'s Internment Camps', author: 'BBC', pages: 10, category: 'Uyghur', difficulty: 'General', essential: false },
  { id: 'article-3', type: 'article', title: 'The Making of Hong Kong\'s National Security Law', author: 'HKFP', pages: 8, category: 'Hong Kong', difficulty: 'General', essential: true },
  { id: 'article-4', type: 'article', title: 'Tibet Under Chinese Rule', author: 'ICT', pages: 12, category: 'Tibet', difficulty: 'General', essential: false },
];

const achievements = [
  { id: 'first-read', name: 'First Steps', description: 'Complete your first reading', Icon: BookOpen, requirement: 1 },
  { id: 'five-reads', name: 'Dedicated Learner', description: 'Complete 5 readings', Icon: Library, requirement: 5 },
  { id: 'ten-reads', name: 'Scholar', description: 'Complete 10 readings', Icon: GraduationCap, requirement: 10 },
  { id: 'all-essential', name: 'Essential Knowledge', description: 'Complete all essential readings', Icon: Star, requirement: 'essential' },
  { id: 'category-master', name: 'Category Expert', description: 'Complete all readings in one category', Icon: Trophy, requirement: 'category' },
  { id: 'book-worm', name: 'Book Worm', description: 'Complete 5 books', Icon: Book, requirement: 'books-5' },
];

export default function ReadingProgress() {
  const [progress, setProgress] = useState({});
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [earnedAchievements, setEarnedAchievements] = useState([]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('reading-progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
    const savedAchievements = localStorage.getItem('reading-achievements');
    if (savedAchievements) {
      setEarnedAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('reading-progress', JSON.stringify(progress));
    checkAchievements();
  }, [progress]);

  const checkAchievements = () => {
    const completedCount = Object.values(progress).filter(p => p.completed).length;
    const completedIds = Object.keys(progress).filter(id => progress[id]?.completed);
    const newAchievements = [...earnedAchievements];

    // Check count-based achievements
    if (completedCount >= 1 && !newAchievements.includes('first-read')) {
      newAchievements.push('first-read');
    }
    if (completedCount >= 5 && !newAchievements.includes('five-reads')) {
      newAchievements.push('five-reads');
    }
    if (completedCount >= 10 && !newAchievements.includes('ten-reads')) {
      newAchievements.push('ten-reads');
    }

    // Check essential readings
    const essentialIds = readingMaterials.filter(m => m.essential).map(m => m.id);
    if (essentialIds.every(id => completedIds.includes(id)) && !newAchievements.includes('all-essential')) {
      newAchievements.push('all-essential');
    }

    // Check books
    const bookIds = readingMaterials.filter(m => m.type === 'book').map(m => m.id);
    const completedBooks = bookIds.filter(id => completedIds.includes(id)).length;
    if (completedBooks >= 5 && !newAchievements.includes('book-worm')) {
      newAchievements.push('book-worm');
    }

    // Check category completion
    const categories = [...new Set(readingMaterials.map(m => m.category))];
    for (const cat of categories) {
      const catIds = readingMaterials.filter(m => m.category === cat).map(m => m.id);
      if (catIds.every(id => completedIds.includes(id)) && !newAchievements.includes('category-master')) {
        newAchievements.push('category-master');
      }
    }

    if (newAchievements.length !== earnedAchievements.length) {
      setEarnedAchievements(newAchievements);
      localStorage.setItem('reading-achievements', JSON.stringify(newAchievements));
    }
  };

  const toggleCompleted = (id) => {
    setProgress(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        completed: !prev[id]?.completed,
        completedDate: !prev[id]?.completed ? new Date().toISOString() : null
      }
    }));
  };

  const updateCurrentPage = (id, page) => {
    const material = readingMaterials.find(m => m.id === id);
    setProgress(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        currentPage: Math.min(page, material.pages),
        completed: page >= material.pages,
        completedDate: page >= material.pages ? new Date().toISOString() : prev[id]?.completedDate
      }
    }));
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all reading progress?')) {
      setProgress({});
      setEarnedAchievements([]);
      localStorage.removeItem('reading-progress');
      localStorage.removeItem('reading-achievements');
    }
  };

  const categories = ['all', ...new Set(readingMaterials.map(m => m.category))];
  const types = ['all', 'book', 'report', 'article'];

  const filteredMaterials = readingMaterials.filter(m => {
    if (filter !== 'all' && m.category !== filter) return false;
    if (typeFilter !== 'all' && m.type !== typeFilter) return false;
    if (!showCompleted && progress[m.id]?.completed) return false;
    return true;
  });

  const totalCompleted = Object.values(progress).filter(p => p.completed).length;
  const totalPages = readingMaterials.reduce((sum, m) => sum + m.pages, 0);
  const pagesRead = readingMaterials.reduce((sum, m) => {
    const p = progress[m.id];
    if (p?.completed) return sum + m.pages;
    if (p?.currentPage) return sum + p.currentPage;
    return sum;
  }, 0);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'book': return <Book className="w-5 h-5 text-red-400" />;
      case 'report': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'article': return <Newspaper className="w-5 h-5 text-green-400" />;
      default: return <BookOpen className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Reading Progress Tracker</h2>
            <p className="text-sm text-slate-400">Track your learning journey through essential readings</p>
          </div>
        </div>
        <button
          onClick={resetProgress}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          title="Reset progress"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-500">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalCompleted}/{readingMaterials.length}</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-500">Pages Read</span>
          </div>
          <p className="text-2xl font-bold text-white">{pagesRead.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-500">Progress</span>
          </div>
          <p className="text-2xl font-bold text-white">{Math.round((pagesRead / totalPages) * 100)}%</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-500">Achievements</span>
          </div>
          <p className="text-2xl font-bold text-white">{earnedAchievements.length}/{achievements.length}</p>
        </div>
      </div>

      {/* Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-400 mb-2">Achievements Earned</h3>
          <div className="flex flex-wrap gap-2">
            {achievements.filter(a => earnedAchievements.includes(a.id)).map(achievement => (
              <div
                key={achievement.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-yellow-900/30 rounded-full"
                title={achievement.description}
              >
                <achievement.Icon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-300">{achievement.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            aria-label="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-700 text-white text-sm rounded-lg px-3 py-1.5 border border-slate-600"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
        <select
          aria-label="Type filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-700 text-white text-sm rounded-lg px-3 py-1.5 border border-slate-600"
        >
          {types.map(type => (
            <option key={type} value={type}>{type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="rounded bg-slate-700 border-slate-600"
          />
          Show completed
        </label>
      </div>

      {/* Reading List */}
      <div className="space-y-3">
        {filteredMaterials.map(material => {
          const itemProgress = progress[material.id] || {};
          const percentComplete = itemProgress.completed 
            ? 100 
            : itemProgress.currentPage 
              ? Math.round((itemProgress.currentPage / material.pages) * 100)
              : 0;

          return (
            <div
              key={material.id}
              className={`bg-slate-900/50 rounded-lg p-4 border transition-colors ${
                itemProgress.completed 
                  ? 'border-green-700 bg-green-900/10' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center">{getTypeIcon(material.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${itemProgress.completed ? 'text-green-400' : 'text-white'}`}>
                      {material.title}
                    </h3>
                    {material.essential && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" title="Essential reading" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{material.author}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">{material.category}</span>
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">{material.pages} pages</span>
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">{material.difficulty}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{percentComplete}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${itemProgress.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${percentComplete}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleCompleted(material.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      itemProgress.completed
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
                    }`}
                    title={itemProgress.completed ? 'Mark as unread' : 'Mark as complete'}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  {!itemProgress.completed && (
                    <input
                      aria-label="Current page number"
                      type="number"
                      min="0"
                      max={material.pages}
                      value={itemProgress.currentPage || ''}
                      onChange={(e) => updateCurrentPage(material.id, parseInt(e.target.value) || 0)}
                      placeholder="Page"
                      className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm text-center"
                    />
                  )}
                </div>
              </div>
              
              {itemProgress.completedDate && (
                <p className="text-xs text-green-400 mt-2">
                  ✓ Completed on {new Date(itemProgress.completedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No readings match your filters</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2"><Library className="w-4 h-4" /> Reading Tips</h3>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• Start with ⭐ essential readings for foundational knowledge</li>
          <li>• Reports are shorter and great for quick learning</li>
          <li>• Track your page progress for longer books</li>
          <li>• Your progress is saved automatically in your browser</li>
        </ul>
      </div>
    </div>
  );
}
