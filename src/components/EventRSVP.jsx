import React, { useState, useEffect } from 'react';
import { Megaphone, Monitor, Flame, Landmark, BookOpen, Calendar, Bell, ClipboardList, Inbox, MapPin, Globe, Building2, ExternalLink, FileText } from 'lucide-react';

const EventRSVP = () => {
  const [rsvps, setRsvps] = useState(() => {
    const saved = localStorage.getItem('eventRsvps');
    return saved ? JSON.parse(saved) : [];
  });
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('eventReminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeFilter, setActiveFilter] = useState('upcoming');

  useEffect(() => {
    localStorage.setItem('eventRsvps', JSON.stringify(rsvps));
  }, [rsvps]);

  useEffect(() => {
    localStorage.setItem('eventReminders', JSON.stringify(reminders));
  }, [reminders]);

  const events = [
    {
      id: 'event-1',
      title: 'Global Day of Action for Jimmy Lai',
      date: '2025-01-15',
      time: '12:00 PM',
      timezone: 'Local',
      type: 'protest',
      location: 'Multiple cities worldwide',
      description: 'Join protests at Chinese embassies and consulates worldwide demanding the release of Jimmy Lai.',
      organizer: 'Committee for Freedom in Hong Kong',
      cities: ['London', 'Washington DC', 'Toronto', 'Sydney', 'Berlin', 'Paris'],
      virtual: false,
      link: 'https://cfhk.org',
    },
    {
      id: 'event-2',
      title: 'Uyghur Genocide Awareness Webinar',
      date: '2025-01-20',
      time: '2:00 PM EST',
      timezone: 'EST',
      type: 'webinar',
      location: 'Online (Zoom)',
      description: 'Learn about the latest developments in the Uyghur genocide and how you can help.',
      organizer: 'Uyghur Human Rights Project',
      virtual: true,
      link: 'https://uhrp.org/events',
    },
    {
      id: 'event-3',
      title: 'Tibetan Uprising Day Commemoration',
      date: '2025-03-10',
      time: '10:00 AM',
      timezone: 'Local',
      type: 'commemoration',
      location: 'Multiple cities worldwide',
      description: 'Annual commemoration of the 1959 Tibetan uprising against Chinese occupation.',
      organizer: 'International Campaign for Tibet',
      cities: ['Dharamsala', 'New York', 'London', 'Brussels', 'Tokyo'],
      virtual: false,
      link: 'https://savetibet.org',
    },
    {
      id: 'event-4',
      title: 'Hong Kong Watch Parliamentary Briefing',
      date: '2025-02-05',
      time: '3:00 PM GMT',
      timezone: 'GMT',
      type: 'briefing',
      location: 'Online & UK Parliament',
      description: 'Briefing on the state of human rights in Hong Kong for parliamentarians and the public.',
      organizer: 'Hong Kong Watch',
      virtual: true,
      link: 'https://hongkongwatch.org',
    },
    {
      id: 'event-5',
      title: 'Tiananmen Square Vigil',
      date: '2025-06-04',
      time: '8:00 PM',
      timezone: 'Local',
      type: 'vigil',
      location: 'Multiple cities worldwide',
      description: 'Annual candlelight vigil commemorating the victims of the 1989 Tiananmen Square massacre.',
      organizer: 'Various organizations',
      cities: ['Hong Kong (banned)', 'Taipei', 'London', 'New York', 'San Francisco', 'Toronto'],
      virtual: false,
    },
    {
      id: 'event-6',
      title: 'Forced Labor Supply Chain Workshop',
      date: '2025-02-15',
      time: '11:00 AM EST',
      timezone: 'EST',
      type: 'workshop',
      location: 'Online (Zoom)',
      description: 'Learn how to audit supply chains and identify forced labor risks.',
      organizer: 'Coalition to End Forced Labour',
      virtual: true,
      link: 'https://enduyghurforcedlabour.org',
    },
  ];

  const typeColors = {
    protest: 'bg-red-900/30 border-red-700/50',
    webinar: 'bg-blue-900/30 border-blue-700/50',
    commemoration: 'bg-purple-900/30 border-purple-700/50',
    briefing: 'bg-green-900/30 border-green-700/50',
    vigil: 'bg-yellow-900/30 border-yellow-700/50',
    workshop: 'bg-cyan-900/30 border-cyan-700/50',
  };

  const typeIcons = {
    protest: Megaphone,
    webinar: Monitor,
    commemoration: Flame,
    briefing: Landmark,
    vigil: Flame,
    workshop: BookOpen,
  };

  const toggleRSVP = (eventId) => {
    if (rsvps.includes(eventId)) {
      setRsvps(rsvps.filter(id => id !== eventId));
    } else {
      setRsvps([...rsvps, eventId]);
    }
  };

  const toggleReminder = (eventId) => {
    if (reminders.includes(eventId)) {
      setReminders(reminders.filter(id => id !== eventId));
    } else {
      setReminders([...reminders, eventId]);
    }
  };

  const addToCalendar = (event) => {
    const startDate = new Date(`${event.date}T${event.time.replace(' ', 'T').replace(/ (AM|PM)/, '')}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const isUpcoming = (dateStr) => {
    return new Date(dateStr) >= new Date();
  };

  const filteredEvents = events.filter(event => {
    if (activeFilter === 'upcoming') return isUpcoming(event.date);
    if (activeFilter === 'rsvp') return rsvps.includes(event.id);
    if (activeFilter === 'reminders') return reminders.includes(event.id);
    return true;
  });

  const getDaysUntil = (dateStr) => {
    const diff = new Date(dateStr) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today!';
    if (days === 1) return 'Tomorrow';
    if (days < 0) return 'Past';
    return `${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-700/50">
        <div className="flex items-center mb-4">
          <Calendar className="w-8 h-8 text-purple-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Events & Actions</h2>
            <p className="text-slate-400">RSVP to events and set reminders</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Find upcoming protests, webinars, commemorations, and other events. RSVP to show your 
          commitment and set reminders so you don't miss important dates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-white">{events.filter(e => isUpcoming(e.date)).length}</div>
          <div className="text-xs text-slate-400">Upcoming Events</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{rsvps.length}</div>
          <div className="text-xs text-slate-400">Your RSVPs</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{reminders.length}</div>
          <div className="text-xs text-slate-400">Reminders Set</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'upcoming', name: 'Upcoming', Icon: Calendar },
          { id: 'rsvp', name: 'My RSVPs', icon: '✅' },
          { id: 'reminders', name: 'My Reminders', Icon: Bell },
          { id: 'all', name: 'All Events', Icon: ClipboardList },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{filter.Icon ? <filter.Icon className="w-4 h-4" /> : filter.icon}</span>
            <span>{filter.name}</span>
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center">
            <Inbox className="w-10 h-10 text-slate-500 mb-4 mx-auto" />
            <p className="text-slate-400">No events found in this category.</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div 
              key={event.id}
              className={`rounded-xl border p-4 ${typeColors[event.type]}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  {(() => { const TypeIcon = typeIcons[event.type]; return <TypeIcon className="w-6 h-6" />; })()}
                  <div>
                    <h3 className="font-bold text-white">{event.title}</h3>
                    <p className="text-sm text-slate-400">{event.organizer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{event.date}</div>
                  <div className="text-xs text-slate-400">{event.time} {event.timezone}</div>
                  <div className={`text-xs mt-1 ${
                    getDaysUntil(event.date) === 'Today!' ? 'text-red-400 font-bold' :
                    getDaysUntil(event.date) === 'Tomorrow' ? 'text-orange-400' :
                    getDaysUntil(event.date) === 'Past' ? 'text-slate-500' :
                    'text-green-400'
                  }`}>
                    {getDaysUntil(event.date)}
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-3">{event.description}</p>

              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                  <MapPin className="w-3 h-3 inline mr-1" /> {event.location}
                </span>
                {event.virtual && (
                  <span className="px-2 py-0.5 bg-blue-900/50 rounded text-blue-400">
                    <Globe className="w-3 h-3 inline mr-1" /> Virtual
                  </span>
                )}
                {event.cities && (
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                    <Building2 className="w-3 h-3 inline mr-1" /> {event.cities.length} cities
                  </span>
                )}
                <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400 capitalize">
                  {event.type}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleRSVP(event.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    rsvps.includes(event.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {rsvps.includes(event.id) ? '✓ RSVPd' : 'RSVP'}
                </button>
                <button
                  onClick={() => toggleReminder(event.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    reminders.includes(event.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {reminders.includes(event.id) ? <><Bell className="w-3 h-3 inline mr-1" /> Reminder Set</> : <><Bell className="w-3 h-3 inline mr-1" /> Set Reminder</>}
                </button>
                <button
                  onClick={() => addToCalendar(event)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                >
                  <Calendar className="w-3 h-3 inline mr-1" /> Add to Calendar
                </button>
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 inline mr-1" /> More Info
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Event */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <h3 className="font-medium text-white mb-2"><FileText className="w-4 h-4 inline mr-1" /> Submit an Event</h3>
        <p className="text-sm text-slate-400 mb-3">
          Know of an upcoming event that should be listed here? Let us know!
        </p>
        <a
          href="https://github.com/Stan2032/global-anti-ccp-resistance-hub/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
        >
          Submit Event
        </a>
      </div>
    </div>
  );
};

export default EventRSVP;
