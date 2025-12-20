import React, { useState } from 'react';
import { MapPin, Calendar, Users, ExternalLink, Filter, Globe, Clock, ChevronRight } from 'lucide-react';

const events = [
  // North America
  {
    id: 1,
    title: 'Free Jimmy Lai Rally',
    date: '2025-01-15',
    time: '12:00 PM',
    location: 'Washington D.C.',
    country: 'USA',
    region: 'North America',
    coordinates: { lat: 38.9072, lng: -77.0369 },
    type: 'Rally',
    cause: 'Hong Kong',
    organizer: 'Committee for Freedom in Hong Kong Foundation',
    description: 'Rally outside the Chinese Embassy demanding the release of Jimmy Lai.',
    attendees: 500,
    link: 'https://cfhk.org',
  },
  {
    id: 2,
    title: 'Uyghur Genocide Awareness March',
    date: '2025-01-20',
    time: '10:00 AM',
    location: 'New York City',
    country: 'USA',
    region: 'North America',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    type: 'March',
    cause: 'Uyghur',
    organizer: 'Uyghur Human Rights Project',
    description: 'March from Times Square to the UN Headquarters.',
    attendees: 1000,
    link: 'https://uhrp.org',
  },
  {
    id: 3,
    title: 'Tibet Solidarity Vigil',
    date: '2025-03-10',
    time: '6:00 PM',
    location: 'Toronto',
    country: 'Canada',
    region: 'North America',
    coordinates: { lat: 43.6532, lng: -79.3832 },
    type: 'Vigil',
    cause: 'Tibet',
    organizer: 'Students for a Free Tibet',
    description: 'Candlelight vigil on Tibetan Uprising Day anniversary.',
    attendees: 300,
    link: 'https://studentsforafreetibet.org',
  },
  // Europe
  {
    id: 4,
    title: 'Hong Kong Watch Parliamentary Briefing',
    date: '2025-02-05',
    time: '2:00 PM',
    location: 'London',
    country: 'UK',
    region: 'Europe',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    type: 'Briefing',
    cause: 'Hong Kong',
    organizer: 'Hong Kong Watch',
    description: 'Briefing for MPs on the Hong Kong situation.',
    attendees: 100,
    link: 'https://hongkongwatch.org',
  },
  {
    id: 5,
    title: 'Uyghur Tribunal Anniversary',
    date: '2025-12-09',
    time: '10:00 AM',
    location: 'London',
    country: 'UK',
    region: 'Europe',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    type: 'Conference',
    cause: 'Uyghur',
    organizer: 'Uyghur Tribunal',
    description: 'Anniversary event marking the genocide determination.',
    attendees: 200,
    link: 'https://uyghurtribunal.com',
  },
  {
    id: 6,
    title: 'European Parliament Hearing',
    date: '2025-02-15',
    time: '9:00 AM',
    location: 'Brussels',
    country: 'Belgium',
    region: 'Europe',
    coordinates: { lat: 50.8503, lng: 4.3517 },
    type: 'Hearing',
    cause: 'General',
    organizer: 'European Parliament',
    description: 'Hearing on CCP human rights abuses.',
    attendees: 150,
    link: 'https://europarl.europa.eu',
  },
  {
    id: 7,
    title: 'Berlin Solidarity March',
    date: '2025-06-04',
    time: '3:00 PM',
    location: 'Berlin',
    country: 'Germany',
    region: 'Europe',
    coordinates: { lat: 52.5200, lng: 13.4050 },
    type: 'March',
    cause: 'Tiananmen',
    organizer: 'Amnesty International Germany',
    description: 'March commemorating Tiananmen Square massacre.',
    attendees: 800,
    link: 'https://amnesty.de',
  },
  // Asia-Pacific
  {
    id: 8,
    title: 'Taiwan Solidarity Rally',
    date: '2025-10-10',
    time: '10:00 AM',
    location: 'Taipei',
    country: 'Taiwan',
    region: 'Asia-Pacific',
    coordinates: { lat: 25.0330, lng: 121.5654 },
    type: 'Rally',
    cause: 'Taiwan',
    organizer: 'Taiwan Foundation for Democracy',
    description: 'Double Ten Day rally for democracy.',
    attendees: 5000,
    link: 'https://tfd.org.tw',
  },
  {
    id: 9,
    title: 'Hong Kong Vigil',
    date: '2025-06-04',
    time: '8:00 PM',
    location: 'Melbourne',
    country: 'Australia',
    region: 'Asia-Pacific',
    coordinates: { lat: -37.8136, lng: 144.9631 },
    type: 'Vigil',
    cause: 'Tiananmen',
    organizer: 'Australia Hong Kong Link',
    description: 'Tiananmen Square memorial vigil.',
    attendees: 400,
    link: 'https://australiahongkonglink.org',
  },
  {
    id: 10,
    title: 'Free Tibet Rally',
    date: '2025-03-10',
    time: '11:00 AM',
    location: 'Dharamsala',
    country: 'India',
    region: 'Asia-Pacific',
    coordinates: { lat: 32.2190, lng: 76.3234 },
    type: 'Rally',
    cause: 'Tibet',
    organizer: 'Tibetan Youth Congress',
    description: 'Tibetan Uprising Day commemoration.',
    attendees: 2000,
    link: 'https://tibetanyouthcongress.org',
  },
];

const regions = ['All Regions', 'North America', 'Europe', 'Asia-Pacific'];
const causes = ['All Causes', 'Hong Kong', 'Uyghur', 'Tibet', 'Taiwan', 'Tiananmen', 'General'];
const types = ['All Types', 'Rally', 'March', 'Vigil', 'Briefing', 'Conference', 'Hearing'];

export default function EventMap() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedCause, setSelectedCause] = useState('All Causes');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const filteredEvents = events.filter(event => {
    if (selectedRegion !== 'All Regions' && event.region !== selectedRegion) return false;
    if (selectedCause !== 'All Causes' && event.cause !== selectedCause) return false;
    if (selectedType !== 'All Types' && event.type !== selectedType) return false;
    return true;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcomingEvents = filteredEvents.filter(e => new Date(e.date) >= new Date());
  const pastEvents = filteredEvents.filter(e => new Date(e.date) < new Date());

  const getCauseColor = (cause) => {
    const colors = {
      'Hong Kong': 'bg-yellow-600',
      'Uyghur': 'bg-blue-600',
      'Tibet': 'bg-red-600',
      'Taiwan': 'bg-green-600',
      'Tiananmen': 'bg-purple-600',
      'General': 'bg-gray-600',
    };
    return colors[cause] || 'bg-gray-600';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isUpcoming = (dateStr) => new Date(dateStr) >= new Date();

  // Simple map visualization using CSS grid
  const MapView = () => (
    <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* North America */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            🌎 North America
          </h3>
          <div className="space-y-2">
            {filteredEvents.filter(e => e.region === 'North America').map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="w-full text-left p-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getCauseColor(event.cause)}`}></span>
                  <span className="text-white truncate">{event.title}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{event.location}</p>
              </button>
            ))}
            {filteredEvents.filter(e => e.region === 'North America').length === 0 && (
              <p className="text-slate-500 text-sm">No events</p>
            )}
          </div>
        </div>

        {/* Europe */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            🌍 Europe
          </h3>
          <div className="space-y-2">
            {filteredEvents.filter(e => e.region === 'Europe').map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="w-full text-left p-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getCauseColor(event.cause)}`}></span>
                  <span className="text-white truncate">{event.title}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{event.location}</p>
              </button>
            ))}
            {filteredEvents.filter(e => e.region === 'Europe').length === 0 && (
              <p className="text-slate-500 text-sm">No events</p>
            )}
          </div>
        </div>

        {/* Asia-Pacific */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            🌏 Asia-Pacific
          </h3>
          <div className="space-y-2">
            {filteredEvents.filter(e => e.region === 'Asia-Pacific').map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="w-full text-left p-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getCauseColor(event.cause)}`}></span>
                  <span className="text-white truncate">{event.title}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{event.location}</p>
              </button>
            ))}
            {filteredEvents.filter(e => e.region === 'Asia-Pacific').length === 0 && (
              <p className="text-slate-500 text-sm">No events</p>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {causes.filter(c => c !== 'All Causes').map(cause => (
          <div key={cause} className="flex items-center gap-2 text-sm">
            <span className={`w-3 h-3 rounded-full ${getCauseColor(cause)}`}></span>
            <span className="text-slate-400">{cause}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Global Event Map</h2>
            <p className="text-sm text-slate-400">Upcoming rallies, vigils, and events worldwide</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded text-sm ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{events.length}</p>
          <p className="text-xs text-slate-500">Total Events</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{upcomingEvents.length}</p>
          <p className="text-xs text-slate-500">Upcoming</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{new Set(events.map(e => e.country)).size}</p>
          <p className="text-xs text-slate-500">Countries</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{events.reduce((sum, e) => sum + e.attendees, 0).toLocaleString()}</p>
          <p className="text-xs text-slate-500">Expected Attendees</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600"
        >
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <select
          value={selectedCause}
          onChange={(e) => setSelectedCause(e.target.value)}
          className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600"
        >
          {causes.map(cause => (
            <option key={cause} value={cause}>{cause}</option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600"
        >
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Map View */}
      {viewMode === 'map' && <MapView />}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Upcoming Events ({upcomingEvents.length})
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full bg-slate-900/50 rounded-lg p-4 text-left hover:bg-slate-900/70 transition-colors border border-slate-700 hover:border-slate-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getCauseColor(event.cause)}`}>
                            {event.cause}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">
                            {event.type}
                          </span>
                        </div>
                        <h4 className="text-white font-semibold">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(event.date)} at {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}, {event.country}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-400 mb-3">
                Past Events ({pastEvents.length})
              </h3>
              <div className="space-y-3 opacity-60">
                {pastEvents.slice(0, 5).map(event => (
                  <div
                    key={event.id}
                    className="bg-slate-900/50 rounded-lg p-4 border border-slate-700"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getCauseColor(event.cause)}`}>
                        {event.cause}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold">{event.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(event.date)} • {event.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-slate-800 rounded-xl max-w-lg w-full p-6 border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getCauseColor(selectedEvent.cause)}`}>
                {selectedEvent.cause}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">
                {selectedEvent.type}
              </span>
              {isUpcoming(selectedEvent.date) && (
                <span className="px-2 py-0.5 rounded text-xs bg-green-600 text-white">
                  Upcoming
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{selectedEvent.title}</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400" />
                {formatDate(selectedEvent.date)} at {selectedEvent.time}
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400" />
                {selectedEvent.location}, {selectedEvent.country}
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-slate-400" />
                ~{selectedEvent.attendees.toLocaleString()} expected attendees
              </div>
            </div>

            <p className="text-slate-400 mb-4">{selectedEvent.description}</p>

            <div className="mb-4">
              <p className="text-sm text-slate-500">Organized by</p>
              <p className="text-white">{selectedEvent.organizer}</p>
            </div>

            <div className="flex gap-3">
              <a
                href={selectedEvent.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Learn More
              </a>
              <button
                onClick={() => {
                  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedEvent.title)}&dates=${selectedEvent.date.replace(/-/g, '')}/${selectedEvent.date.replace(/-/g, '')}&details=${encodeURIComponent(selectedEvent.description)}&location=${encodeURIComponent(selectedEvent.location + ', ' + selectedEvent.country)}`;
                  window.open(calendarUrl, '_blank');
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Add to Calendar
              </button>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full mt-3 px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No events match your filters</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">📍 Organizing an Event?</h3>
        <p className="text-sm text-slate-400">
          Contact us to have your event listed on this map. We feature rallies, vigils, marches, 
          briefings, and other activism events supporting human rights in China.
        </p>
      </div>
    </div>
  );
}
