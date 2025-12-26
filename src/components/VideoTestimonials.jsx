import React, { useState } from 'react';
import { Play, ExternalLink, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const VideoTestimonials = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showSensitiveWarning, setShowSensitiveWarning] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Tursunay Ziawudun',
      category: 'Uyghur',
      title: 'Survivor of Xinjiang Detention Camps',
      description: 'Tursunay describes systematic rape, torture, and forced sterilization in Chinese detention camps. Her testimony was crucial in documenting genocide.',
      videoUrl: 'https://www.youtube.com/embed/e6bPGl10Cts',
      duration: '28:15',
      date: 'February 2021',
      outlet: 'BBC News',
      sensitive: true,
      views: '2.1M',
      verified: true,
      tags: ['Detention Camps', 'Torture', 'Sexual Violence', 'Genocide']
    },
    {
      id: 2,
      name: 'Nathan Law',
      category: 'Hong Kong',
      title: 'Hong Kong Pro-Democracy Activist in Exile',
      description: 'Nathan Law, youngest legislator in HK history, fled after NSL. He testifies about the dismantling of Hong Kong\'s freedoms and the targeting of activists.',
      videoUrl: 'https://www.youtube.com/embed/nHN5Jd5RL8U',
      duration: '15:42',
      date: 'July 2020',
      outlet: 'BBC HARDtalk',
      sensitive: false,
      views: '890K',
      verified: true,
      tags: ['National Security Law', 'Exile', 'Democracy Movement']
    },
    {
      id: 3,
      name: 'Gulbahar Haitiwaji',
      category: 'Uyghur',
      title: 'French Citizen Detained for 2 Years',
      description: 'Gulbahar, a French-Uyghur woman, was lured back to China and detained for 2 years. She describes brainwashing, forced confessions, and family separation.',
      videoUrl: 'https://www.youtube.com/embed/WR4juW3P5_o',
      duration: '22:30',
      date: 'March 2021',
      outlet: 'France 24',
      sensitive: true,
      views: '1.5M',
      verified: true,
      tags: ['Detention Camps', 'Brainwashing', 'Family Separation']
    },
    {
      id: 4,
      name: 'Chemi Lhamo',
      category: 'Tibet',
      title: 'Tibetan-Canadian Student Activist',
      description: 'Chemi faced online harassment and death threats from Chinese nationalists after being elected student union president. She speaks about transnational repression.',
      videoUrl: 'https://www.youtube.com/embed/1Gtt2JxmQtg',
      duration: '18:20',
      date: 'April 2019',
      outlet: 'CBC News',
      sensitive: false,
      views: '650K',
      verified: true,
      tags: ['Transnational Repression', 'Student Activism', 'Online Harassment']
    },
    {
      id: 5,
      name: 'Chen Guangcheng',
      category: 'Mainland',
      title: 'Blind Activist Who Escaped House Arrest',
      description: 'Chen, a blind self-taught lawyer, exposed forced abortions and escaped house arrest in a dramatic 2012 incident. He now advocates from the US.',
      videoUrl: 'https://www.youtube.com/embed/VlMBGuzZLbU',
      duration: '25:10',
      date: 'May 2012',
      outlet: 'CNN',
      sensitive: false,
      views: '1.2M',
      verified: true,
      tags: ['One-Child Policy', 'Forced Abortion', 'Escape']
    },
    {
      id: 6,
      name: 'Sayragul Sauytbay',
      category: 'Uyghur',
      title: 'Teacher Forced to Work in Detention Camp',
      description: 'Sayragul was forced to teach Chinese propaganda in a detention camp. She witnessed torture, medical experiments, and deaths. She fled to Kazakhstan then Sweden.',
      videoUrl: 'https://www.youtube.com/embed/uQHuOfZgJWI',
      duration: '20:45',
      date: 'November 2019',
      outlet: 'DW Documentary',
      sensitive: true,
      views: '980K',
      verified: true,
      tags: ['Detention Camps', 'Forced Labor', 'Medical Experiments']
    },
    {
      id: 7,
      name: 'Ray Wong',
      category: 'Hong Kong',
      title: 'First Political Refugee Granted Asylum from HK',
      description: 'Ray Wong, founder of Hong Kong Indigenous, was the first HK activist granted asylum in Germany. He discusses the 2016 Mong Kok unrest and fleeing prosecution.',
      videoUrl: 'https://www.youtube.com/embed/xS-tDoFrOLk',
      duration: '16:30',
      date: 'May 2018',
      outlet: 'VICE News',
      sensitive: false,
      views: '720K',
      verified: true,
      tags: ['Asylum', 'Umbrella Movement', 'Political Refugee']
    },
    {
      id: 8,
      name: 'Mihrigul Tursun',
      category: 'Uyghur',
      title: 'Mother Separated from Triplets',
      description: 'Mihrigul was detained 3 times, tortured, and separated from her infant triplets. One died in suspicious circumstances. Her testimony moved US Congress to tears.',
      videoUrl: 'https://www.youtube.com/embed/NZU91ljmZaQ',
      duration: '24:50',
      date: 'November 2018',
      outlet: 'US Congressional Hearing',
      sensitive: true,
      views: '1.8M',
      verified: true,
      tags: ['Family Separation', 'Infant Death', 'Congressional Testimony']
    }
  ];

  const categories = ['all', 'Uyghur', 'Hong Kong', 'Tibet', 'Mainland'];

  const filteredTestimonials = testimonials.filter(t => 
    categoryFilter === 'all' || t.category === categoryFilter
  );

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Play className="w-8 h-8 text-red-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Video Testimonials</h2>
          <p className="text-slate-400 text-sm">First-hand accounts from survivors and activists</p>
        </div>
      </div>

      {/* Sensitive Content Warning */}
      {showSensitiveWarning && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-400 font-bold mb-1">Sensitive Content Warning</h3>
              <p className="text-slate-300 text-sm mb-3">
                Some testimonials contain descriptions of torture, sexual violence, and other traumatic experiences. 
                Videos marked with ⚠️ may be distressing. Viewer discretion is advised.
              </p>
              <button
                onClick={() => setShowSensitiveWarning(false)}
                className="text-sm text-red-400 hover:text-red-300 underline"
              >
                I understand, dismiss this warning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-blue-500 text-white'
                : 'bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-700/50'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTestimonials.map(testimonial => (
          <div key={testimonial.id} className="bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden hover:border-blue-500/30 transition-colors">
            {/* Video Thumbnail/Player */}
            {selectedVideo === testimonial.id ? (
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={testimonial.videoUrl}
                  title={testimonial.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            ) : (
              <div 
                className="aspect-video bg-slate-800 relative cursor-pointer group"
                onClick={() => setSelectedVideo(testimonial.id)}
              >
                <img 
                  src={`https://img.youtube.com/vi/${testimonial.videoUrl.split('/').pop()}/maxresdefault.jpg`}
                  alt={testimonial.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://img.youtube.com/vi/${testimonial.videoUrl.split('/').pop()}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                  {testimonial.duration}
                </div>
                {testimonial.sensitive && (
                  <div className="absolute top-2 left-2 bg-red-500/90 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Sensitive
                  </div>
                )}
              </div>
            )}

            {/* Video Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{testimonial.name}</h3>
                  <p className="text-sm text-blue-400 mb-2">{testimonial.title}</p>
                </div>
                {testimonial.verified && (
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-400 mb-3">{testimonial.description}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {testimonial.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-4">
                  <span>{testimonial.outlet}</span>
                  <span>{testimonial.date}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {testimonial.views}
                  </span>
                </div>
                <a
                  href={testimonial.videoUrl.replace('/embed/', '/watch?v=')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  YouTube
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="mt-6 bg-slate-900/50 rounded-lg border border-slate-700/50 p-4">
        <h3 className="text-white font-bold mb-2">More Video Resources</h3>
        <div className="space-y-2 text-sm">
          <a href="https://www.youtube.com/@UyghurHumanRightsProject" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Uyghur Human Rights Project YouTube Channel
          </a>
          <a href="https://www.youtube.com/@HongKongFreePress" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Hong Kong Free Press YouTube Channel
          </a>
          <a href="https://www.youtube.com/@VoiceofAmerica" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Voice of America - China Coverage
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoTestimonials;
