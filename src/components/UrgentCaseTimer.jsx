import { useState, useEffect } from 'react';
import { User, Clock, MapPin, Cake } from 'lucide-react';

const UrgentCaseTimer = ({ compact = false }) => {
  const [timers, setTimers] = useState({});

  const urgentCases = [
    {
      id: 'jimmy-lai',
      name: 'Jimmy Lai',
      chinese: '黎智英',
      status: 'SENTENCED - 20 YEARS',
      statusColor: 'red',
      detentionDate: '2020-12-03',
      location: 'Stanley Prison, Hong Kong',
      age: 78,
      description: 'Media tycoon and founder of Apple Daily. Convicted Dec 15, 2025. Sentenced to 20 years on Feb 9, 2026.',
      image: 'user',
      actionUrl: '/prisoners',
      hashtag: '#FreeJimmyLai'
    },
    {
      id: 'ilham-tohti',
      name: 'Ilham Tohti',
      chinese: '伊力哈木·土赫提',
      status: 'LIFE SENTENCE',
      statusColor: 'red',
      detentionDate: '2014-01-15',
      location: 'Urumqi Prison, Xinjiang',
      age: 55,
      description: 'Uyghur economist and professor. Sentenced to life for "separatism". Sakharov Prize winner.',
      image: 'user',
      actionUrl: '/prisoners',
      hashtag: '#FreeIlhamTohti'
    },
    {
      id: 'chow-hang-tung',
      name: 'Chow Hang-tung',
      chinese: '邹幸彤',
      status: 'IMPRISONED',
      statusColor: 'red',
      detentionDate: '2021-06-04',
      location: 'Hong Kong',
      age: 38,
      description: 'Human rights lawyer and Tiananmen vigil organizer. Multiple sentences totaling over 6 years.',
      image: 'user',
      actionUrl: '/prisoners',
      hashtag: '#FreeChowHangTung'
    },
    {
      id: 'gedhun-choekyi-nyima',
      name: 'Gedhun Choekyi Nyima',
      chinese: '根敦确吉尼玛',
      status: 'DISAPPEARED',
      statusColor: 'gray',
      detentionDate: '1995-05-17',
      location: 'Unknown, China',
      age: 35,
      description: 'Recognized as 11th Panchen Lama by Dalai Lama at age 6. Disappeared 3 days later. Longest-held political prisoner.',
      image: 'user',
      actionUrl: '/prisoners',
      hashtag: '#FreePanchenLama'
    }
  ];

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const newTimers = {};
      
      urgentCases.forEach(prisoner => {
        const detentionDate = new Date(prisoner.detentionDate);
        const diff = now - detentionDate;
        
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        newTimers[prisoner.id] = { years, days, hours, minutes, seconds, totalDays: Math.floor(diff / (1000 * 60 * 60 * 24)) };
      });
      
      setTimers(newTimers);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    // Compact version for dashboard
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-500" /> Time in Detention
          </h3>
          <a href="/prisoners" className="text-xs text-red-400 hover:text-red-300">View all →</a>
        </div>
        
        {urgentCases.slice(0, 3).map(prisoner => {
          const timer = timers[prisoner.id];
          if (!timer) return null;
          
          return (
            <div key={prisoner.id} className="bg-[#0a0e14]/50 p-3 border border-[#1c2a35]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-white">{prisoner.name}</span>
                  <span className="text-slate-500 text-sm ml-2">{prisoner.chinese}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  prisoner.statusColor === 'red' ? 'bg-red-600' : 'bg-[#1c2a35]'
                }`}>
                  {prisoner.status}
                </span>
              </div>
              <div className="mt-2 font-mono text-lg">
                <span className="text-red-400">{timer.years}</span>
                <span className="text-slate-500 text-sm">y </span>
                <span className="text-red-400">{timer.days}</span>
                <span className="text-slate-500 text-sm">d </span>
                <span className="text-red-400">{timer.hours}</span>
                <span className="text-slate-500 text-sm">h </span>
                <span className="text-red-400">{timer.minutes}</span>
                <span className="text-slate-500 text-sm">m </span>
                <span className="text-red-400">{timer.seconds}</span>
                <span className="text-slate-500 text-sm">s</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Full version
  return (
    <div className="space-y-6">
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-red-500 p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Clock className="w-6 h-6" /> Time in Detention</h2>
        <p className="text-slate-300">
          Live counters showing how long political prisoners have been detained. Every second counts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {urgentCases.map(prisoner => {
          const timer = timers[prisoner.id];
          if (!timer) return null;

          return (
            <div key={prisoner.id} className="bg-[#111820] border border-[#1c2a35] p-6 hover:border-red-500/50 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{prisoner.name}</h3>
                  <p className="text-red-400">{prisoner.chinese}</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-bold ${
                  prisoner.statusColor === 'red' ? 'bg-red-600 text-white' : 'bg-[#1c2a35] text-white'
                }`}>
                  {prisoner.status}
                </span>
              </div>

              {/* Timer */}
              <div className="bg-[#0a0e14] p-4 mb-4">
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div>
                    <div className="text-3xl font-mono font-bold text-red-400">{timer.years}</div>
                    <div className="text-xs text-slate-500">YEARS</div>
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-red-400">{timer.days}</div>
                    <div className="text-xs text-slate-500">DAYS</div>
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-red-400">{timer.hours}</div>
                    <div className="text-xs text-slate-500">HOURS</div>
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-red-400">{timer.minutes}</div>
                    <div className="text-xs text-slate-500">MINS</div>
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-red-400">{timer.seconds}</div>
                    <div className="text-xs text-slate-500">SECS</div>
                  </div>
                </div>
                <div className="text-center mt-2 text-sm text-slate-400">
                  Total: <span className="text-white font-semibold">{timer.totalDays.toLocaleString()}</span> days
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <p className="text-slate-300">{prisoner.description}</p>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{prisoner.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Cake className="w-4 h-4" />
                  <span>Age: {prisoner.age}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={prisoner.actionUrl}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Take Action
                </a>
                <button
                  onClick={() => {
                    const text = `${prisoner.name} (${prisoner.chinese}) has been detained for ${timer.years} years, ${timer.days} days. ${prisoner.hashtag} #FreePoliticalPrisoners`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="bg-[#111820] hover:bg-[#1c2a35] text-white px-4 py-2 rounded text-sm transition-colors"
                >
                  Copy to Share
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UrgentCaseTimer;
