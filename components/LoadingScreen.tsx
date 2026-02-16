
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
      <div className="relative mb-12">
        {/* Main Logo Container */}
        <div className="w-24 h-24 bg-cyan-gradient rounded-[2rem] flex items-center justify-center text-black font-black text-4xl animate-pulse shadow-[0_0_60px_rgba(0,255,255,0.4)] relative z-10">
          SD
        </div>
        {/* Spinning Rings */}
        <div className="absolute inset-[-15px] border border-cyan-400/20 rounded-[2.5rem] animate-spin-slow"></div>
        <div className="absolute inset-[-30px] border border-white/5 rounded-[3rem] animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }}></div>
      </div>
      
      <div className="flex flex-col items-center gap-6 max-w-xs w-full">
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-[0.2em] text-white uppercase mb-2">Social Hub X</h2>
          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] animate-pulse">Initializing Dominance</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
          <div className="h-full bg-cyan-gradient animate-loading-bar w-1/2"></div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Synchronizing cloud nodes...</span>
          <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Protocol v4.2.0-Stable</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
