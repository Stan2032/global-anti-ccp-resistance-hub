import { useState } from 'react';
import { Flame, Heart, Handshake, Megaphone, CalendarDays, Smartphone } from 'lucide-react';

const EventCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState('all');

  const events = [
    // January
    {
      date: 'January 1',
      month: 'january',
      name: 'Taiwan New Year Solidarity',
      type: 'solidarity',
      description: 'Show support for Taiwan\'s democracy and sovereignty',
      actions: ['Share Taiwan flag', 'Post solidarity messages', 'Contact representatives about Taiwan support']
    },
    
    // February
    {
      date: 'February 22',
      month: 'february',
      name: 'Tibet Uprising Day (1959)',
      type: 'commemoration',
      description: 'Anniversary of the 1959 Tibetan uprising against Chinese occupation',
      actions: ['Attend local vigils', 'Share Tibetan stories', 'Fly Tibetan flag']
    },
    
    // March
    {
      date: 'March 10',
      month: 'march',
      name: 'Tibetan Uprising Day',
      type: 'commemoration',
      description: 'Major annual commemoration of 1959 uprising. Global protests.',
      actions: ['Join protests', 'Contact representatives', 'Share on social media']
    },
    {
      date: 'March 14',
      month: 'march',
      name: '2008 Tibet Protests Anniversary',
      type: 'commemoration',
      description: 'Anniversary of 2008 protests across Tibet',
      actions: ['Share stories', 'Support Tibetan organizations']
    },
    
    // April
    {
      date: 'April 25',
      month: 'april',
      name: 'Falun Gong Persecution Awareness',
      type: 'awareness',
      description: 'Anniversary of 1999 appeal that led to persecution',
      actions: ['Learn about persecution', 'Share information', 'Support practitioners']
    },
    
    // May
    {
      date: 'May 3',
      month: 'may',
      name: 'World Press Freedom Day',
      type: 'awareness',
      description: 'Highlight imprisoned journalists in China',
      actions: ['Share journalist stories', 'Support press freedom orgs', 'Write to imprisoned journalists']
    },
    {
      date: 'May 13',
      month: 'may',
      name: 'World Falun Dafa Day',
      type: 'awareness',
      description: 'Celebrate Falun Gong and raise awareness of persecution',
      actions: ['Attend events', 'Share information']
    },
    
    // June
    {
      date: 'June 4',
      month: 'june',
      name: 'Tiananmen Square Massacre Anniversary',
      type: 'commemoration',
      description: 'MAJOR: 1989 massacre anniversary. Global vigils and protests.',
      actions: ['Attend vigils', 'Light candles', 'Share Tank Man image', 'Contact representatives'],
      priority: 'CRITICAL'
    },
    {
      date: 'June 9',
      month: 'june',
      name: 'Hong Kong Protests Anniversary (2019)',
      type: 'commemoration',
      description: 'Anniversary of first major 2019 protest (1 million marched)',
      actions: ['Share Hong Kong stories', 'Support HK organizations']
    },
    {
      date: 'June 12',
      month: 'june',
      name: 'Hong Kong Siege Anniversary',
      type: 'commemoration',
      description: 'Anniversary of 2019 LegCo siege',
      actions: ['Remember protesters', 'Share footage']
    },
    
    // July
    {
      date: 'July 1',
      month: 'july',
      name: 'Hong Kong Handover Anniversary',
      type: 'commemoration',
      description: 'Anniversary of 1997 handover. Annual protests (now banned).',
      actions: ['Share Hong Kong history', 'Support diaspora events']
    },
    {
      date: 'July 5',
      month: 'july',
      name: 'Ürümqi Massacre Anniversary (2009)',
      type: 'commemoration',
      description: 'Anniversary of 2009 Uyghur protests and massacre',
      actions: ['Share Uyghur stories', 'Support Uyghur organizations']
    },
    
    // August
    {
      date: 'August 31',
      month: 'august',
      name: 'Prince Edward Station Attack Anniversary',
      type: 'commemoration',
      description: 'Anniversary of 2019 police attack on protesters in MTR station',
      actions: ['Remember victims', 'Share footage']
    },
    
    // September
    {
      date: 'September 28',
      month: 'september',
      name: 'Umbrella Movement Anniversary',
      type: 'commemoration',
      description: 'Anniversary of 2014 Occupy Central / Umbrella Movement',
      actions: ['Share umbrella symbol', 'Remember protesters']
    },
    
    // October
    {
      date: 'October 1',
      month: 'october',
      name: 'PRC National Day Counter-Protests',
      type: 'protest',
      description: 'Counter CCP celebrations with human rights awareness',
      actions: ['Join protests', 'Share human rights info', 'Boycott celebrations']
    },
    {
      date: 'October 10',
      month: 'october',
      name: 'Taiwan National Day (Double Ten)',
      type: 'solidarity',
      description: 'Celebrate Taiwan\'s democracy and show solidarity',
      actions: ['Share Taiwan flag', 'Attend Taiwan events', 'Post solidarity']
    },
    
    // November
    {
      date: 'November 12',
      month: 'november',
      name: 'PolyU Siege Anniversary',
      type: 'commemoration',
      description: 'Anniversary of 2019 Hong Kong Polytechnic University siege',
      actions: ['Remember trapped students', 'Share stories']
    },
    
    // December
    {
      date: 'December 10',
      month: 'december',
      name: 'Human Rights Day',
      type: 'awareness',
      description: 'MAJOR: UN Human Rights Day. Highlight CCP abuses.',
      actions: ['Join events', 'Share prisoner stories', 'Contact representatives'],
      priority: 'HIGH'
    },
    {
      date: 'December 12',
      month: 'december',
      name: 'Jimmy Lai Arrest Anniversary',
      type: 'commemoration',
      description: 'Anniversary of Jimmy Lai\'s arrest under NSL',
      actions: ['#FreeJimmyLai', 'Contact representatives', 'Support Apple Daily legacy']
    },
    {
      date: 'December 25',
      month: 'december',
      name: 'Liu Xiaobo Birthday',
      type: 'commemoration',
      description: 'Birthday of Nobel laureate Liu Xiaobo (1955-2017)',
      actions: ['Share Charter 08', 'Remember his legacy']
    }
  ];

  const months = [
    { id: 'all', name: 'All Events' },
    { id: 'january', name: 'January' },
    { id: 'february', name: 'February' },
    { id: 'march', name: 'March' },
    { id: 'april', name: 'April' },
    { id: 'may', name: 'May' },
    { id: 'june', name: 'June' },
    { id: 'july', name: 'July' },
    { id: 'august', name: 'August' },
    { id: 'september', name: 'September' },
    { id: 'october', name: 'October' },
    { id: 'november', name: 'November' },
    { id: 'december', name: 'December' },
  ];

  const filteredEvents = selectedMonth === 'all'
    ? events
    : events.filter(e => e.month === selectedMonth);

  const getTypeColor = (type) => {
    switch (type) {
      case 'commemoration': return 'bg-purple-600';
      case 'protest': return 'bg-red-600';
      case 'solidarity': return 'bg-blue-600';
      case 'awareness': return 'bg-yellow-600';
      default: return 'bg-slate-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'commemoration': return Flame;
      case 'protest': return Heart;
      case 'solidarity': return Handshake;
      case 'awareness': return Megaphone;
      default: return CalendarDays;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><CalendarDays className="w-6 h-6" /> Resistance Calendar</h2>
        <p className="text-slate-300">
          Key dates for commemorations, protests, and solidarity actions throughout the year.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-600"></span>
          <span className="text-sm text-slate-300">Commemoration</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600"></span>
          <span className="text-sm text-slate-300">Protest</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span className="text-sm text-slate-300">Solidarity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-600"></span>
          <span className="text-sm text-slate-300">Awareness</span>
        </div>
      </div>

      {/* Month Filter */}
      <div className="flex flex-wrap gap-2">
        {months.map((month) => (
          <button
            key={month.id}
            onClick={() => setSelectedMonth(month.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedMonth === month.id
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {month.name}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event, i) => (
          <div 
            key={i} 
            className={`bg-[#111820] border p-6 ${
              event.priority === 'CRITICAL' ? 'border-red-500' : 
              event.priority === 'HIGH' ? 'border-yellow-500' : 'border-[#1c2a35]'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {(() => { const TypeIcon = getTypeIcon(event.type); return <TypeIcon className="w-6 h-6" />; })()}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-mono text-sm">{event.date}</span>
                    {event.priority && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        event.priority === 'CRITICAL' ? 'bg-red-600' : 'bg-yellow-600'
                      }`}>
                        {event.priority}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">{event.name}</h3>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(event.type)}`}>
                {event.type}
              </span>
            </div>
            
            <p className="text-slate-300 text-sm mb-4">{event.description}</p>
            
            <div className="border-t border-[#1c2a35] pt-4">
              <p className="text-xs text-slate-500 mb-2">Suggested Actions:</p>
              <div className="flex flex-wrap gap-2">
                {event.actions.map((action, j) => (
                  <span key={j} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                    {action}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add to Calendar */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5" /> Stay Updated</h3>
        <p className="text-slate-300 text-sm mb-4">
          Add these events to your calendar to never miss an important date.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors">
            Subscribe to Calendar (Coming Soon)
          </button>
          <button 
            onClick={() => {
              const text = events.map(e => `${e.date}: ${e.name}`).join('\n');
              navigator.clipboard.writeText(text);
            }}
            className="bg-slate-700 hover:bg-[#1c2a35] text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Copy All Dates
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
