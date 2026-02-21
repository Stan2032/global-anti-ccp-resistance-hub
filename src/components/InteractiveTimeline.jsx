import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Play, Pause, ZoomIn, ZoomOut, Filter, Info, ExternalLink } from 'lucide-react';
import SourceAttribution from './ui/SourceAttribution';
import { resolveSource } from '../utils/sourceLinks';
import timelineEvents from '../data/timeline_events.json';

// Categories kept inline since they include Tailwind CSS classes (not pure data)

const categories = [
  { id: 'all', name: 'All Events', color: 'bg-slate-500' },
  { id: 'hongkong', name: 'Hong Kong', color: 'bg-yellow-500' },
  { id: 'uyghur', name: 'Uyghur/Xinjiang', color: 'bg-blue-500' },
  { id: 'tibet', name: 'Tibet', color: 'bg-red-500' },
  { id: 'mainland', name: 'Mainland China', color: 'bg-purple-500' },
  { id: 'falungong', name: 'Falun Gong', color: 'bg-orange-500' },
  { id: 'global', name: 'Global', color: 'bg-green-500' }
];

export default function InteractiveTimeline() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timelineRef = useRef(null);
  const playIntervalRef = useRef(null);

  const filteredEvents = selectedCategory === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(e => e.category === selectedCategory);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && filteredEvents.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const next = (prev + 1) % filteredEvents.length;
          setSelectedEvent(filteredEvents[next]);
          return next;
        });
      }, 3000);
    }
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, filteredEvents]);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredEvents.length - 1;
    setCurrentIndex(newIndex);
    setSelectedEvent(filteredEvents[newIndex]);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % filteredEvents.length;
    setCurrentIndex(newIndex);
    setSelectedEvent(filteredEvents[newIndex]);
  };

  const getCategoryColor = (category) => {
    return categories.find(c => c.id === category)?.color || 'bg-slate-500';
  };

  const getSignificanceStyle = (significance) => {
    switch (significance) {
      case 'critical': return 'ring-2 ring-red-500';
      case 'high': return 'ring-2 ring-orange-500';
      default: return '';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getYearRange = () => {
    const years = filteredEvents.map(e => new Date(e.date).getFullYear());
    return { min: Math.min(...years), max: Math.max(...years) };
  };

  const yearRange = getYearRange();

  return (
    <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-red-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Interactive Timeline</h2>
            <p className="text-sm text-slate-400">Key events in the struggle against CCP authoritarianism</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
            className="p-2 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
            className="p-2 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setSelectedEvent(null);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? `${category.color} text-white`
                : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Timeline Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handlePrevious}
          className="p-2 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`p-3 transition-colors ${
            isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
        </button>
        <button
          onClick={handleNext}
          className="p-2 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
        <span className="text-slate-400 text-sm ml-4">
          {currentIndex + 1} / {filteredEvents.length} events
        </span>
      </div>

      {/* Timeline Visualization */}
      <div className="relative mb-6 overflow-x-auto" ref={timelineRef}>
        <div className="min-w-full py-8" style={{ transform: `scaleX(${zoomLevel})`, transformOrigin: 'left' }}>
          {/* Year markers */}
          <div className="flex justify-between mb-2 px-4">
            {Array.from({ length: yearRange.max - yearRange.min + 1 }, (_, i) => yearRange.min + i).map(year => (
              <span key={year} className="text-xs text-slate-500">{year}</span>
            ))}
          </div>
          
          {/* Timeline line */}
          <div className="relative h-2 bg-[#111820] rounded-full mx-4">
            {filteredEvents.map((event, index) => {
              const year = new Date(event.date).getFullYear();
              const position = ((year - yearRange.min) / (yearRange.max - yearRange.min)) * 100;
              return (
                <button
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setCurrentIndex(index);
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${getCategoryColor(event.category)} ${getSignificanceStyle(event.significance)} hover:scale-150 transition-transform cursor-pointer ${
                    selectedEvent?.id === event.id ? 'scale-150 ring-4 ring-white' : ''
                  }`}
                  style={{ left: `${position}%` }}
                  title={event.title}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Details */}
      {selectedEvent ? (
        <div className="bg-[#0a0e14]/50 p-6 border border-[#1c2a35]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getCategoryColor(selectedEvent.category)}`}>
                  {categories.find(c => c.id === selectedEvent.category)?.name}
                </span>
                {selectedEvent.significance === 'critical' && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white">
                    Critical Event
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
              <p className="text-slate-400">{formatDate(selectedEvent.date)}</p>
            </div>
          </div>
          
          <p className="text-slate-300 mb-4">{selectedEvent.description}</p>
          
          <div className="bg-[#111820]/50 p-4 mb-4">
            <p className="text-slate-300 text-sm">{selectedEvent.details}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {selectedEvent.casualties && (
              <div className="bg-red-900/30 p-3">
                <p className="text-xs text-red-400 mb-1">Casualties</p>
                <p className="text-white font-semibold">{selectedEvent.casualties}</p>
              </div>
            )}
            {selectedEvent.detained && (
              <div className="bg-orange-900/30 p-3">
                <p className="text-xs text-orange-400 mb-1">Detained</p>
                <p className="text-white font-semibold">{selectedEvent.detained}</p>
              </div>
            )}
            {selectedEvent.participants && (
              <div className="bg-blue-900/30 p-3">
                <p className="text-xs text-blue-400 mb-1">Participants</p>
                <p className="text-white font-semibold">{selectedEvent.participants}</p>
              </div>
            )}
            {selectedEvent.sentence && (
              <div className="bg-purple-900/30 p-3">
                <p className="text-xs text-purple-400 mb-1">Sentence</p>
                <p className="text-white font-semibold">{selectedEvent.sentence}</p>
              </div>
            )}
            {selectedEvent.stations && (
              <div className="bg-green-900/30 p-3">
                <p className="text-xs text-green-400 mb-1">Police Stations</p>
                <p className="text-white font-semibold">{selectedEvent.stations}</p>
              </div>
            )}
          </div>
          
          {selectedEvent.impact && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-400 mb-2">Impact</h4>
              <p className="text-slate-300">{selectedEvent.impact}</p>
            </div>
          )}
          
          {selectedEvent.sources && (
            <div>
              <h4 className="text-sm font-semibold text-slate-400 mb-2">Sources</h4>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.sources.map((source, i) => {
                  const resolved = resolveSource(source);
                  return resolved.url ? (
                    <SourceAttribution key={i} source={resolved} compact />
                  ) : (
                    <span key={i} className="px-2 py-1 bg-[#111820] rounded text-xs text-slate-300">
                      {source}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#0a0e14]/50 p-8 border border-[#1c2a35] text-center">
          <Info className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Click on a timeline marker to view event details</p>
          <p className="text-slate-500 text-sm mt-2">Or press Play to auto-advance through events</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-[#1c2a35]">
        <h4 className="text-sm font-semibold text-slate-400 mb-3">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500 ring-2 ring-red-500"></div>
            <span className="text-xs text-slate-400">Critical Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500 ring-2 ring-orange-500"></div>
            <span className="text-xs text-slate-400">High Significance</span>
          </div>
          {categories.slice(1).map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
              <span className="text-xs text-slate-400">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111820] p-3 text-center">
          <p className="text-2xl font-bold text-white">{timelineEvents.length}</p>
          <p className="text-xs text-slate-400">Total Events</p>
        </div>
        <div className="bg-[#111820] p-3 text-center">
          <p className="text-2xl font-bold text-white">{yearRange.max - yearRange.min + 1}</p>
          <p className="text-xs text-slate-400">Years Covered</p>
        </div>
        <div className="bg-[#111820] p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{timelineEvents.filter(e => e.significance === 'critical').length}</p>
          <p className="text-xs text-slate-400">Critical Events</p>
        </div>
        <div className="bg-[#111820] p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{timelineEvents.filter(e => e.category === 'hongkong').length}</p>
          <p className="text-xs text-slate-400">Hong Kong Events</p>
        </div>
      </div>
    </div>
  );
}
