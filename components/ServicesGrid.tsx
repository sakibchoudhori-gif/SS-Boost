
import React from 'react';

const services = [
  {
    platform: 'Instagram',
    name: 'High Quality Followers',
    price: '$0.02',
    icon: '📸',
    color: 'from-pink-500 to-purple-600'
  },
  {
    platform: 'TikTok',
    name: 'Viral Video Views',
    price: '$0.001',
    icon: '🎵',
    color: 'from-black to-gray-800'
  },
  {
    platform: 'YouTube',
    name: 'Organic Watch Time',
    price: '$2.50',
    icon: '📺',
    color: 'from-red-600 to-red-800'
  },
  {
    platform: 'X (Twitter)',
    name: 'Premium Reposts',
    price: '$0.15',
    icon: '🐦',
    color: 'from-blue-400 to-blue-600'
  }
];

const ServicesGrid: React.FC = () => {
  return (
    <section id="services-grid" className="py-20 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Most Popular <span className="text-cyan-400">Services</span></h2>
            <p className="text-gray-400 max-w-xl">Browse our top performing services tailored for growth-hungry influencers and businesses.</p>
          </div>
          <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-colors">
            VIEW ALL 1,500+ SERVICES
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div key={idx} className="bg-black border border-white/10 rounded-3xl p-6 hover:translate-y-[-5px] transition-all flex flex-col group">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                {service.icon}
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">{service.platform}</p>
              <h3 className="text-xl font-bold mb-8 group-hover:text-cyan-400 transition-colors">{service.name}</h3>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Starting From</p>
                  <p className="text-lg font-black text-cyan-400">{service.price}<span className="text-xs text-gray-400 font-normal"> / 1k</span></p>
                </div>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
