import React from 'react';

const ImpactMetrics = () => {
  const metrics = [
    {
      label: 'Countries with CCP Police Stations',
      value: 53,
      change: '+7',
      changeLabel: 'newly identified',
      icon: '🌍',
      color: 'red'
    },
    {
      label: 'Political Prisoners Documented',
      value: 53,
      change: '+12',
      changeLabel: 'this year',
      icon: '⛓️',
      color: 'orange'
    },
    {
      label: 'Resistance Organizations',
      value: 24,
      change: 'Verified',
      changeLabel: 'and active',
      icon: '🏛️',
      color: 'blue'
    },
    {
      label: 'Documented Victories',
      value: 25,
      change: '+5',
      changeLabel: 'in 2024',
      icon: '🏆',
      color: 'green'
    }
  ];

  const recentVictories = [
    {
      title: 'Netherlands Closes Police Stations',
      date: 'Oct 2023',
      description: 'First country to shut down CCP police stations after Safeguard Defenders report'
    },
    {
      title: 'NYC Arrests for CCP Spy Station',
      date: 'Apr 2023',
      description: 'Two individuals arrested for operating undeclared Chinese police station in Manhattan'
    },
    {
      title: 'UFLPA Implementation',
      date: 'Jun 2022',
      description: 'Uyghur Forced Labor Prevention Act blocks goods made with forced labor'
    }
  ];

  const colorClasses = {
    red: 'text-red-400 bg-red-900/30',
    orange: 'text-orange-400 bg-orange-900/30',
    blue: 'text-blue-400 bg-blue-900/30',
    green: 'text-green-400 bg-green-900/30'
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Platform Impact</h2>
          <p className="text-sm text-slate-400">Tracking our collective progress</p>
        </div>
        <span className="px-3 py-1 bg-green-900/50 text-green-400 text-xs font-medium rounded-full border border-green-700">
          Live Data
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClasses[metric.color]}`}>
                {metric.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-xs text-slate-400">{metric.label}</div>
            <div className="text-xs text-slate-500 mt-1">{metric.changeLabel}</div>
          </div>
        ))}
      </div>

      {/* Recent Victories */}
      <div className="border-t border-slate-700 pt-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
          <span className="mr-2">🏆</span> Recent Victories
        </h3>
        <div className="space-y-3">
          {recentVictories.map((victory, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">{victory.title}</span>
                  <span className="text-xs text-slate-500">{victory.date}</span>
                </div>
                <p className="text-xs text-slate-400">{victory.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
        <p className="text-sm text-blue-300">
          <strong>Your actions matter.</strong> Every petition signed, every representative contacted, and every story shared contributes to these victories.
        </p>
      </div>
    </div>
  );
};

export default ImpactMetrics;
