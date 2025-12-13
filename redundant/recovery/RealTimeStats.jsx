import React, { useState, useEffect } from 'react';
import { 
  Users, Eye, Share2, TrendingUp, Globe, Clock, 
  Zap, Target, Shield, AlertTriangle, CheckCircle,
  Activity, BarChart3, MapPin, Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const RealTimeStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 47382,
    activeNow: 1247,
    completedTraining: 23891,
    sharedContent: 8934,
    countriesReached: 89,
    propagandaDetected: 156789,
    liveSessions: 342,
    averageScore: 78
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'completed Memory Palace', location: 'United States', time: '2 seconds ago' },
    { id: 2, action: 'shared shocking statistic', location: 'United Kingdom', time: '5 seconds ago' },
    { id: 3, action: 'detected propaganda', location: 'Canada', time: '8 seconds ago' },
    { id: 4, action: 'started training', location: 'Australia', time: '12 seconds ago' },
    { id: 5, action: 'completed calculator', location: 'Germany', time: '15 seconds ago' }
  ]);

  const [milestones, setMilestones] = useState([
    { target: 50000, current: 47382, label: 'Total Users', icon: Users, color: 'bg-blue-500' },
    { target: 30000, current: 23891, label: 'Completed Training', icon: CheckCircle, color: 'bg-green-500' },
    { target: 100, current: 89, label: 'Countries Reached', icon: Globe, color: 'bg-purple-500' },
    { target: 200000, current: 156789, label: 'Propaganda Detected', icon: Shield, color: 'bg-red-500' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        activeNow: Math.max(800, prev.activeNow + Math.floor(Math.random() * 20) - 10),
        completedTraining: prev.completedTraining + Math.floor(Math.random() * 2),
        sharedContent: prev.sharedContent + Math.floor(Math.random() * 2),
        propagandaDetected: prev.propagandaDetected + Math.floor(Math.random() * 5),
        liveSessions: Math.max(200, prev.liveSessions + Math.floor(Math.random() * 10) - 5)
      }));

      // Update recent activity
      const actions = [
        'completed Memory Palace', 'shared shocking statistic', 'detected propaganda',
        'started training', 'completed calculator', 'unlocked technique',
        'shared on Twitter', 'completed quiz', 'identified bot account'
      ];
      const locations = [
        'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
        'France', 'Japan', 'South Korea', 'Netherlands', 'Sweden'
      ];

      setRecentActivity(prev => [
        {
          id: Date.now(),
          action: actions[Math.floor(Math.random() * actions.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          time: 'just now'
        },
        ...prev.slice(0, 4).map(item => ({
          ...item,
          time: item.time === 'just now' ? '2 seconds ago' : 
                item.time === '2 seconds ago' ? '5 seconds ago' :
                item.time === '5 seconds ago' ? '8 seconds ago' :
                item.time === '8 seconds ago' ? '12 seconds ago' : '15 seconds ago'
        }))
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update milestones based on current stats
  useEffect(() => {
    setMilestones(prev => prev.map(milestone => {
      switch (milestone.label) {
        case 'Total Users':
          return { ...milestone, current: stats.totalUsers };
        case 'Completed Training':
          return { ...milestone, current: stats.completedTraining };
        case 'Propaganda Detected':
          return { ...milestone, current: stats.propagandaDetected };
        default:
          return milestone;
      }
    }));
  }, [stats]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-primary mr-3" />
            <CardTitle className="text-3xl font-bold">Global Impact Dashboard</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Real-time statistics showing the worldwide fight against CCP propaganda
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-600">{formatNumber(stats.totalUsers)}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
            <Badge variant="secondary" className="mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{Math.floor(stats.totalUsers * 0.02)} today
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600">{formatNumber(stats.activeNow)}</div>
            <div className="text-sm text-muted-foreground">Active Now</div>
            <Badge variant="secondary" className="mt-2">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-600">{formatNumber(stats.completedTraining)}</div>
            <div className="text-sm text-muted-foreground">Trained</div>
            <Badge variant="secondary" className="mt-2">
              <CheckCircle className="h-3 w-3 mr-1" />
              {Math.round((stats.completedTraining / stats.totalUsers) * 100)}% rate
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Share2 className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-orange-600">{formatNumber(stats.sharedContent)}</div>
            <div className="text-sm text-muted-foreground">Shares</div>
            <Badge variant="secondary" className="mt-2">
              <Zap className="h-3 w-3 mr-1" />
              Viral
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Milestones Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-6 w-6 mr-2" />
            Global Milestones
          </CardTitle>
          <CardDescription>
            Tracking our progress toward key awareness goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((milestone, index) => {
              const progress = (milestone.current / milestone.target) * 100;
              const isComplete = progress >= 100;
              
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${milestone.color} text-white mr-3`}>
                        <milestone.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold">{milestone.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatNumber(milestone.current)} / {formatNumber(milestone.target)}
                        </div>
                      </div>
                    </div>
                    {isComplete && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {Math.round(progress)}% complete
                    {!isComplete && ` • ${formatNumber(milestone.target - milestone.current)} to go`}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-6 w-6 mr-2" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>
              Real-time actions from users worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <div>
                      <div className="text-sm font-medium">Someone {activity.action}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {activity.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-6 w-6 mr-2" />
              Impact Metrics
            </CardTitle>
            <CardDescription>
              Measuring our effectiveness against propaganda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Countries Reached</div>
                  <div className="text-sm text-muted-foreground">Global awareness spread</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{stats.countriesReached}</div>
                  <div className="text-xs text-muted-foreground">of 195 countries</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Propaganda Detected</div>
                  <div className="text-sm text-muted-foreground">By trained users</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{formatNumber(stats.propagandaDetected)}</div>
                  <div className="text-xs text-muted-foreground">instances blocked</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Average Score</div>
                  <div className="text-sm text-muted-foreground">Detection accuracy</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
                  <div className="text-xs text-muted-foreground">accuracy rate</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Live Sessions</div>
                  <div className="text-sm text-muted-foreground">Active learning now</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{stats.liveSessions}</div>
                  <div className="text-xs text-muted-foreground">concurrent users</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Proof */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700 dark:text-green-300">
            <Users className="h-6 w-6 mr-2" />
            Join the Movement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">{formatNumber(stats.totalUsers)}</div>
              <div className="text-sm text-muted-foreground">People are already learning to resist propaganda</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.countriesReached}</div>
              <div className="text-sm text-muted-foreground">Countries are building propaganda resistance</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">{formatNumber(stats.sharedContent)}</div>
              <div className="text-sm text-muted-foreground">Pieces of content shared to spread awareness</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">
              Every person trained makes the entire network stronger
            </p>
            <p className="text-sm text-muted-foreground">
              Join thousands of people worldwide who are building immunity to propaganda
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeStats;

