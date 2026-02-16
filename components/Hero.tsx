
import React from 'react';

interface HeroProps {
  onSignup: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSignup }) => {
  return (
    <section className="pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">#1 Ranked SMM Panel 2024</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
          DOMINATE SOCIAL <br />
          <span className="bg-gradient-to-r from-[#00FFFF] to-[#0088FF] bg-clip-text text-transparent">PRESENCE INSTANTLY</span>
        </h1>

        <p className="max-w-2xl text-lg text-gray-400 mb-12 leading-relaxed">
          Elevate your brands and accounts with the world's most reliable SMM services. 
          Unmatched speed, bot-free quality, and wholesale pricing at your fingertips.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button 
            onClick={onSignup}
            className="w-full sm:w-auto px-10 py-5 bg-cyan-gradient text-black text-lg font-black rounded-full cyan-glow hover:scale-105 transition-all active:scale-95"
          >
            GET STARTED NOW
          </button>
          <button 
            onClick={() => document.getElementById('stats-section')?.scrollIntoView({behavior: 'smooth'})}
            className="w-full sm:w-auto px-10 py-5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/5 text-lg font-bold rounded-full transition-all"
          >
            OUR IMPACT
          </button>
        </div>

        {/* Floating Icons Background - Only Instagram Kept */}
        <div className="mt-20 w-full relative h-16 flex items-center justify-center opacity-30">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="h-10 md:h-12 grayscale hover:grayscale-0 transition-all cursor-crosshair hover:scale-110" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
