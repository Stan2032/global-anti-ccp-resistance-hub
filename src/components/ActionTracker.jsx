import React, { useState, useEffect } from 'react';
import { Megaphone, Landmark, Heart, BookOpen, Handshake, Sprout, Leaf, TreePine, Trophy, Crown, Target, Flame, Star, Award } from 'lucide-react';

const ActionTracker = () => {
  const [completedActions, setCompletedActions] = useState(() => {
    const saved = localStorage.getItem('completedActions');
    return saved ? JSON.parse(saved) : [];
  });
  const [streak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const actionCategories = [
    {
      id: 'awareness',
      name: 'Raise Awareness',
      Icon: Megaphone,
      color: 'blue',
      actions: [
        { id: 'share-social', name: 'Share an article on social media', points: 5 },
        { id: 'discuss-friend', name: 'Discuss with a friend or family member', points: 10 },
        { id: 'post-original', name: 'Create an original post about CCP abuses', points: 15 },
        { id: 'attend-event', name: 'Attend a rally or event', points: 25 },
        { id: 'organize-event', name: 'Organize an awareness event', points: 50 },
      ]
    },
    {
      id: 'advocacy',
      name: 'Political Advocacy',
      Icon: Landmark,
      color: 'purple',
      actions: [
        { id: 'sign-petition', name: 'Sign a petition', points: 5 },
        { id: 'email-rep', name: 'Email your representative', points: 15 },
        { id: 'call-rep', name: 'Call your representative', points: 20 },
        { id: 'meet-rep', name: 'Meet with your representative', points: 50 },
        { id: 'testify', name: 'Testify at a hearing', points: 100 },
      ]
    },
    {
      id: 'economic',
      name: 'Economic Action',
      Icon: Heart,
      color: 'green',
      actions: [
        { id: 'check-labels', name: 'Check product labels for origin', points: 5 },
        { id: 'avoid-company', name: 'Avoid a company using forced labor', points: 10 },
        { id: 'donate', name: 'Donate to a human rights organization', points: 20 },
        { id: 'divest', name: 'Divest from CCP-linked investments', points: 30 },
        { id: 'support-business', name: 'Support a diaspora-owned business', points: 15 },
      ]
    },
    {
      id: 'education',
      name: 'Self-Education',
      Icon: BookOpen,
      color: 'yellow',
      actions: [
        { id: 'read-article', name: 'Read an in-depth article', points: 5 },
        { id: 'watch-doc', name: 'Watch a documentary', points: 10 },
        { id: 'read-book', name: 'Read a book on the topic', points: 25 },
        { id: 'take-course', name: 'Complete an online course', points: 30 },
        { id: 'learn-language', name: 'Learn basic Uyghur/Tibetan/Cantonese', points: 50 },
      ]
    },
    {
      id: 'support',
      name: 'Direct Support',
      Icon: Handshake,
      color: 'red',
      actions: [
        { id: 'welcome-refugee', name: 'Welcome a refugee to your community', points: 30 },
        { id: 'volunteer', name: 'Volunteer with an organization', points: 25 },
        { id: 'mentor', name: 'Mentor a diaspora community member', points: 40 },
        { id: 'legal-support', name: 'Provide legal or professional support', points: 50 },
        { id: 'host-activist', name: 'Host an activist or refugee', points: 75 },
      ]
    },
  ];

  const achievements = [
    { id: 'first-action', name: 'First Steps', description: 'Complete your first action', Icon: Sprout, requirement: 1 },
    { id: 'five-actions', name: 'Getting Started', description: 'Complete 5 actions', Icon: Leaf, requirement: 5 },
    { id: 'ten-actions', name: 'Committed', description: 'Complete 10 actions', Icon: TreePine, requirement: 10 },
    { id: 'twenty-five', name: 'Advocate', description: 'Complete 25 actions', Icon: Star, requirement: 25 },
    { id: 'fifty', name: 'Champion', description: 'Complete 50 actions', Icon: Trophy, requirement: 50 },
    { id: 'hundred', name: 'Hero', description: 'Complete 100 actions', Icon: Crown, requirement: 100 },
    { id: 'all-categories', name: 'Well-Rounded', description: 'Complete actions in all categories', Icon: Target, requirement: 'all-categories' },
    { id: 'week-streak', name: 'Consistent', description: 'Take action 7 days in a row', Icon: Flame, requirement: 'streak-7' },
  ];

  useEffect(() => {
    localStorage.setItem('completedActions', JSON.stringify(completedActions));
  }, [completedActions]);

  const toggleAction = (actionId) => {
    if (completedActions.includes(actionId)) {
      setCompletedActions(completedActions.filter(id => id !== actionId));
    } else {
      setCompletedActions([...completedActions, actionId]);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const getTotalPoints = () => {
    let total = 0;
    actionCategories.forEach(category => {
      category.actions.forEach(action => {
        if (completedActions.includes(action.id)) {
          total += action.points;
        }
      });
    });
    return total;
  };

  const getCompletedCount = () => completedActions.length;

  const getCategoryProgress = (categoryId) => {
    const category = actionCategories.find(c => c.id === categoryId);
    const completed = category.actions.filter(a => completedActions.includes(a.id)).length;
    return Math.round((completed / category.actions.length) * 100);
  };

  const getUnlockedAchievements = () => {
    const count = getCompletedCount();
    const completedCategories = actionCategories.filter(cat => 
      cat.actions.some(a => completedActions.includes(a.id))
    ).length;
    
    return achievements.filter(achievement => {
      if (typeof achievement.requirement === 'number') {
        return count >= achievement.requirement;
      }
      if (achievement.requirement === 'all-categories') {
        return completedCategories === actionCategories.length;
      }
      if (achievement.requirement === 'streak-7') {
        return streak >= 7;
      }
      return false;
    });
  };

  const getLevel = () => {
    const points = getTotalPoints();
    if (points >= 500) return { level: 5, name: 'Champion', next: null };
    if (points >= 250) return { level: 4, name: 'Advocate', next: 500 };
    if (points >= 100) return { level: 3, name: 'Activist', next: 250 };
    if (points >= 50) return { level: 2, name: 'Supporter', next: 100 };
    return { level: 1, name: 'Newcomer', next: 50 };
  };

  const levelInfo = getLevel();
  const unlockedAchievements = getUnlockedAchievements();

  const colorClasses = {
    blue: { bg: 'bg-blue-900/30', border: 'border-blue-700/50', text: 'text-blue-400', check: 'bg-blue-600' },
    purple: { bg: 'bg-purple-900/30', border: 'border-purple-700/50', text: 'text-purple-400', check: 'bg-purple-600' },
    green: { bg: 'bg-green-900/30', border: 'border-green-700/50', text: 'text-green-400', check: 'bg-green-600' },
    yellow: { bg: 'bg-yellow-900/30', border: 'border-yellow-700/50', text: 'text-yellow-400', check: 'bg-yellow-600' },
    red: { bg: 'bg-red-900/30', border: 'border-red-700/50', text: 'text-red-400', check: 'bg-red-600' },
  };

  return (
    <div className="space-y-6">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <Star className="w-16 h-16 text-yellow-400 animate-bounce" />
        </div>
      )}

      {/* Header Stats */}
      <div className="bg-[#111820] p-6 border border-[#1c2a35]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Action Tracker</h2>
            <p className="text-slate-400">Track your contributions to the resistance</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{getTotalPoints()}</div>
            <div className="text-sm text-slate-400">Total Points</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-[#0a0e14]/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-slate-300" />
              <div>
                <div className="font-medium text-white">Level {levelInfo.level}: {levelInfo.name}</div>
                <div className="text-xs text-slate-400">{getCompletedCount()} actions completed</div>
              </div>
            </div>
            {levelInfo.next && (
              <div className="text-sm text-slate-400">
                {levelInfo.next - getTotalPoints()} points to next level
              </div>
            )}
          </div>
          {levelInfo.next && (
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-[#4afa82] h-2 transition-all duration-500"
                style={{ width: `${Math.min((getTotalPoints() / levelInfo.next) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-bold text-white mb-3 flex items-center">
          <Trophy className="w-5 h-5 mr-2" /> Achievements ({unlockedAchievements.length}/{achievements.length})
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {achievements.map(achievement => {
            const unlocked = unlockedAchievements.some(a => a.id === achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-2 text-center transition-all ${
                  unlocked 
                    ? 'bg-yellow-900/30 border border-yellow-600/50' 
                    : 'bg-[#0a0e14]/50 border border-[#1c2a35] opacity-50'
                }`}
                title={`${achievement.name}: ${achievement.description}`}
              >
                <achievement.Icon className="w-6 h-6 text-slate-300" />
                <div className="text-xs text-slate-400 mt-1 truncate">{achievement.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Categories */}
      <div className="space-y-4">
        {actionCategories.map(category => {
          const colors = colorClasses[category.color];
          const progress = getCategoryProgress(category.id);
          
          return (
            <div 
              key={category.id}
              className={`${colors.bg} border ${colors.border} p-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <category.Icon className="w-6 h-6 text-slate-300" />
                  <h3 className="font-bold text-white">{category.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-slate-400">{progress}%</div>
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div 
                      className={`${colors.check} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {category.actions.map(action => {
                  const isCompleted = completedActions.includes(action.id);
                  return (
                    <button
                      key={action.id}
                      onClick={() => toggleAction(action.id)}
                      className={`w-full flex items-center justify-between p-3 transition-all ${
                        isCompleted 
                          ? 'bg-[#0a0e14]/70 border border-green-600/50' 
                          : 'bg-[#0a0e14]/30 border border-[#1c2a35] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-green-600 border-green-600' 
                            : 'border-slate-500'
                        }`}>
                          {isCompleted && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className={`text-sm ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                          {action.name}
                        </span>
                      </div>
                      <span className={`text-xs font-medium ${colors.text}`}>
                        +{action.points} pts
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivation */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-red-500 p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Every Action Matters</h3>
        <p className="text-slate-300 text-sm">
          "The only thing necessary for the triumph of evil is for good men to do nothing." — Edmund Burke
        </p>
        <p className="text-slate-400 text-xs mt-2">
          Your actions, no matter how small, contribute to the global movement for human rights.
        </p>
      </div>

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
              setCompletedActions([]);
              localStorage.removeItem('completedActions');
            }
          }}
          className="text-xs text-slate-500 hover:text-slate-400"
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
};

export default ActionTracker;
