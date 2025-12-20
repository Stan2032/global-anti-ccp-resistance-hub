import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const importantDates = [
    {
      id: 'tiananmen',
      name: 'Tiananmen Square Anniversary',
      date: new Date('2025-06-04T00:00:00'),
      description: '36th anniversary of the 1989 Tiananmen Square Massacre',
      icon: '🕯️',
      type: 'memorial',
      actions: ['Light a candle', 'Share survivor stories', 'Contact representatives'],
    },
    {
      id: 'july1',
      name: 'Hong Kong Handover Anniversary',
      date: new Date('2025-07-01T00:00:00'),
      description: '28th anniversary of Hong Kong handover to China',
      icon: '🇭🇰',
      type: 'awareness',
      actions: ['Stand with Hong Kong', 'Support HK refugees', 'Share HK stories'],
    },
    {
      id: 'tibet-uprising',
      name: 'Tibetan Uprising Day',
      date: new Date('2025-03-10T00:00:00'),
      description: '66th anniversary of the 1959 Tibetan uprising',
      icon: '🏔️',
      type: 'memorial',
      actions: ['Fly Tibetan flag', 'Support ICT', 'Contact representatives'],
    },
    {
      id: 'uyghur-day',
      name: 'Uyghur Human Rights Day',
      date: new Date('2025-07-05T00:00:00'),
      description: 'Commemorating the 2009 Ürümqi protests',
      icon: '🕌',
      type: 'memorial',
      actions: ['Support UHRP', 'Share Uyghur stories', 'Check supply chains'],
    },
    {
      id: 'human-rights-day',
      name: 'Human Rights Day',
      date: new Date('2025-12-10T00:00:00'),
      description: 'Universal Declaration of Human Rights anniversary',
      icon: '✊',
      type: 'action',
      actions: ['Contact representatives', 'Donate to orgs', 'Share on social media'],
    },
    {
      id: 'taiwan-national',
      name: 'Taiwan National Day',
      date: new Date('2025-10-10T00:00:00'),
      description: 'Double Ten Day - Taiwan\'s National Day',
      icon: '🇹🇼',
      type: 'solidarity',
      actions: ['Stand with Taiwan', 'Share Taiwan stories', 'Support Taiwan businesses'],
    },
    {
      id: 'panchen-lama',
      name: 'Panchen Lama Abduction Anniversary',
      date: new Date('2025-05-17T00:00:00'),
      description: '30 years since Gedhun Choekyi Nyima was abducted',
      icon: '⛓️',
      type: 'memorial',
      actions: ['Demand his release', 'Contact representatives', 'Share his story'],
    },
    {
      id: 'nsl-anniversary',
      name: 'Hong Kong NSL Anniversary',
      date: new Date('2025-06-30T00:00:00'),
      description: '5 years since the National Security Law was imposed',
      icon: '⚖️',
      type: 'awareness',
      actions: ['Document impact', 'Support political prisoners', 'Advocate for sanctions'],
    },
  ];

  const getTimeRemaining = (targetDate) => {
    const total = targetDate - now;
    
    if (total <= 0) {
      // If date has passed this year, calculate for next year
      const nextYear = new Date(targetDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const newTotal = nextYear - now;
      
      return {
        total: newTotal,
        days: Math.floor(newTotal / (1000 * 60 * 60 * 24)),
        hours: Math.floor((newTotal / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((newTotal / 1000 / 60) % 60),
        seconds: Math.floor((newTotal / 1000) % 60),
        isPast: false,
        isToday: false,
      };
    }

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
      isPast: false,
      isToday: days === 0 && hours < 24,
    };
  };

  // Sort by closest upcoming date
  const sortedDates = [...importantDates].sort((a, b) => {
    const timeA = getTimeRemaining(a.date);
    const timeB = getTimeRemaining(b.date);
    return timeA.total - timeB.total;
  });

  const typeColors = {
    memorial: { bg: 'bg-purple-900/30', border: 'border-purple-700/50', badge: 'bg-purple-600' },
    awareness: { bg: 'bg-blue-900/30', border: 'border-blue-700/50', badge: 'bg-blue-600' },
    action: { bg: 'bg-red-900/30', border: 'border-red-700/50', badge: 'bg-red-600' },
    solidarity: { bg: 'bg-green-900/30', border: 'border-green-700/50', badge: 'bg-green-600' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center mb-2">
          <span className="text-3xl mr-3">📅</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Important Dates</h2>
            <p className="text-slate-400">Upcoming anniversaries and days of action</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          Mark your calendar and prepare to take action on these significant dates.
        </p>
      </div>

      {/* Featured Countdown (Next Event) */}
      {sortedDates.length > 0 && (
        <div className={`${typeColors[sortedDates[0].type].bg} rounded-xl border ${typeColors[sortedDates[0].type].border} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-4xl mr-3">{sortedDates[0].icon}</span>
              <div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${typeColors[sortedDates[0].type].badge} text-white mb-1 inline-block`}>
                  NEXT UP
                </span>
                <h3 className="text-xl font-bold text-white">{sortedDates[0].name}</h3>
                <p className="text-sm text-slate-400">{sortedDates[0].description}</p>
              </div>
            </div>
          </div>

          {/* Countdown Display */}
          {(() => {
            const time = getTimeRemaining(sortedDates[0].date);
            return (
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-white">{time.days}</div>
                  <div className="text-xs text-slate-400">Days</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-white">{time.hours}</div>
                  <div className="text-xs text-slate-400">Hours</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-white">{time.minutes}</div>
                  <div className="text-xs text-slate-400">Minutes</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-white">{time.seconds}</div>
                  <div className="text-xs text-slate-400">Seconds</div>
                </div>
              </div>
            );
          })()}

          {/* Actions */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">How to participate:</h4>
            <div className="flex flex-wrap gap-2">
              {sortedDates[0].actions.map((action, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300">
                  {action}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other Upcoming Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        {sortedDates.slice(1).map(event => {
          const time = getTimeRemaining(event.date);
          const colors = typeColors[event.type];
          
          return (
            <div key={event.id} className={`${colors.bg} rounded-xl border ${colors.border} p-4`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{event.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm">{event.name}</h3>
                    <p className="text-xs text-slate-400">{event.description}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors.badge} text-white`}>
                  {event.type}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="bg-slate-900/50 rounded px-2 py-1 text-center">
                    <span className="text-lg font-bold text-white">{time.days}</span>
                    <span className="text-xs text-slate-400 ml-1">d</span>
                  </div>
                  <div className="bg-slate-900/50 rounded px-2 py-1 text-center">
                    <span className="text-lg font-bold text-white">{time.hours}</span>
                    <span className="text-xs text-slate-400 ml-1">h</span>
                  </div>
                  <div className="bg-slate-900/50 rounded px-2 py-1 text-center">
                    <span className="text-lg font-bold text-white">{time.minutes}</span>
                    <span className="text-xs text-slate-400 ml-1">m</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500">
                  {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add to Calendar */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <h3 className="font-medium text-white mb-2">📆 Add to Your Calendar</h3>
        <p className="text-sm text-slate-400 mb-3">
          Never miss an important date. Add these events to your calendar to receive reminders.
        </p>
        <div className="flex flex-wrap gap-2">
          <a 
            href="https://calendar.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-colors"
          >
            Google Calendar
          </a>
          <a 
            href="https://outlook.live.com/calendar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-colors"
          >
            Outlook
          </a>
          <a 
            href="https://calendar.apple.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-colors"
          >
            Apple Calendar
          </a>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
