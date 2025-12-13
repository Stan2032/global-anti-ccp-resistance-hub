import React, { useState } from 'react';
import { BookOpen, Play, Download, Award, Clock, Users, Star, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const EducationCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const trainingModules = [
    {
      id: 1,
      title: 'Digital Security Fundamentals',
      category: 'security',
      level: 'beginner',
      duration: '45 minutes',
      participants: 3247,
      rating: 4.9,
      description: 'Essential digital security practices for activists and organizations',
      modules: ['VPN Usage', 'Secure Messaging', 'Password Management', 'Device Security'],
      instructor: 'Digital Security Expert',
      completed: false,
      featured: true
    },
    {
      id: 2,
      title: 'CCP Propaganda Recognition',
      category: 'analysis',
      level: 'intermediate',
      duration: '60 minutes',
      participants: 2156,
      rating: 4.8,
      description: 'Learn to identify and counter CCP propaganda techniques and narratives',
      modules: ['Propaganda Techniques', 'Narrative Analysis', 'Source Verification', 'Counter-Messaging'],
      instructor: 'Media Literacy Specialist',
      completed: false,
      featured: true
    },
    {
      id: 3,
      title: 'Legal Rights for Activists',
      category: 'legal',
      level: 'intermediate',
      duration: '90 minutes',
      participants: 1834,
      rating: 4.7,
      description: 'Understanding legal rights and protections for human rights activists',
      modules: ['International Law', 'Domestic Protections', 'Legal Resources', 'Emergency Procedures'],
      instructor: 'Human Rights Lawyer',
      completed: true,
      featured: false
    },
    {
      id: 4,
      title: 'Campaign Organization and Strategy',
      category: 'organizing',
      level: 'advanced',
      duration: '120 minutes',
      participants: 1247,
      rating: 4.9,
      description: 'Advanced strategies for organizing effective resistance campaigns',
      modules: ['Strategic Planning', 'Coalition Building', 'Media Strategy', 'Impact Measurement'],
      instructor: 'Campaign Strategist',
      completed: false,
      featured: true
    },
    {
      id: 5,
      title: 'Trauma-Informed Activism',
      category: 'wellness',
      level: 'intermediate',
      duration: '75 minutes',
      participants: 892,
      rating: 4.6,
      description: 'Supporting mental health and wellbeing in resistance work',
      modules: ['Trauma Recognition', 'Self-Care Practices', 'Community Support', 'Professional Resources'],
      instructor: 'Mental Health Professional',
      completed: false,
      featured: false
    },
    {
      id: 6,
      title: 'Advanced Surveillance Detection',
      category: 'security',
      level: 'advanced',
      duration: '150 minutes',
      participants: 456,
      rating: 4.8,
      description: 'Advanced techniques for detecting and evading surveillance',
      modules: ['Physical Surveillance', 'Digital Tracking', 'Counter-Surveillance', 'Operational Security'],
      instructor: 'Security Consultant',
      completed: false,
      featured: false
    }
  ];

  const resources = [
    {
      title: 'Digital Security Toolkit',
      type: 'guide',
      downloads: 15234,
      description: 'Comprehensive guide to digital security tools and practices',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      title: 'CCP Influence Operations Database',
      type: 'database',
      downloads: 8947,
      description: 'Documented cases of CCP influence operations worldwide',
      size: '45.7 MB',
      format: 'JSON'
    },
    {
      title: 'Legal Aid Contact Directory',
      type: 'directory',
      downloads: 12456,
      description: 'Global directory of lawyers specializing in human rights cases',
      size: '1.8 MB',
      format: 'PDF'
    },
    {
      title: 'Campaign Planning Template',
      type: 'template',
      downloads: 6789,
      description: 'Strategic planning template for resistance campaigns',
      size: '856 KB',
      format: 'DOCX'
    }
  ];

  const achievements = [
    {
      title: 'Digital Security Certified',
      description: 'Completed all digital security training modules',
      earned: true,
      date: '2024-11-15'
    },
    {
      title: 'Propaganda Analyst',
      description: 'Mastered CCP propaganda recognition techniques',
      earned: false,
      progress: 75
    },
    {
      title: 'Campaign Organizer',
      description: 'Completed advanced campaign strategy training',
      earned: false,
      progress: 30
    },
    {
      title: 'Community Educator',
      description: 'Trained 10+ other activists in resistance techniques',
      earned: false,
      progress: 0
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'security': return '🔒';
      case 'analysis': return '🔍';
      case 'legal': return '⚖️';
      case 'organizing': return '📢';
      case 'wellness': return '💚';
      default: return '📚';
    }
  };

  const filteredModules = trainingModules.filter(module => {
    const categoryMatch = selectedCategory === 'all' || module.category === selectedCategory;
    const levelMatch = selectedLevel === 'all' || module.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Education Center</h1>
              <p className="text-purple-100">Training and resources for effective resistance</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">12</div>
              <div className="text-purple-100">Training Modules</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">9,834</div>
            <div className="text-gray-600">Students Trained</div>
          </Card>
          <Card className="p-6 text-center">
            <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-gray-600">Certifications Earned</div>
          </Card>
          <Card className="p-6 text-center">
            <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">43,426</div>
            <div className="text-gray-600">Resource Downloads</div>
          </Card>
          <Card className="p-6 text-center">
            <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Training Modules */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Training Modules</h2>
                <Button variant="primary" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="security">Digital Security</option>
                  <option value="analysis">Analysis</option>
                  <option value="legal">Legal</option>
                  <option value="organizing">Organizing</option>
                  <option value="wellness">Wellness</option>
                </select>
                <select 
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Featured Modules */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Training</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredModules.filter(module => module.featured).map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getCategoryIcon(module.category)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(module.level)}`}>
                            {module.level.toUpperCase()}
                          </span>
                          {module.completed && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{module.rating}</span>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">{module.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                      
                      <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {module.duration}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {module.participants.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {module.modules.length} modules
                        </div>
                        <Button variant="outline" size="sm">
                          {module.completed ? 'Review' : 'Start Course'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Modules */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Training Modules</h3>
                <div className="space-y-4">
                  {filteredModules.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{getCategoryIcon(module.category)}</span>
                          <h4 className="font-semibold text-gray-900">{module.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(module.level)}`}>
                            {module.level}
                          </span>
                          {module.completed && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 mr-1" />
                            <span className="text-sm">{module.rating}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            {module.completed ? 'Review' : 'Enroll'}
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {module.duration}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {module.participants.toLocaleString()} enrolled
                          </span>
                        </div>
                        <span>By {module.instructor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress & Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {achievement.earned ? (
                        <Award className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        {!achievement.earned && achievement.progress > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full" 
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Resources */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-3">
                {resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{resource.title}</h4>
                      <p className="text-xs text-gray-600">{resource.description}</p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span>{resource.format}</span>
                        <span>•</span>
                        <span>{resource.size}</span>
                        <span>•</span>
                        <span>{resource.downloads.toLocaleString()} downloads</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Start */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-center mb-3">
                <Play className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-900">Quick Start</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                New to resistance work? Start with our beginner-friendly modules.
              </p>
              <Button variant="primary" className="w-full">
                Begin Training Path
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationCenter;
