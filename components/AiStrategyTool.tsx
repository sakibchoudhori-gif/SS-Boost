
import React, { useState } from 'react';
import { generateStrategy } from '../services/geminiService';

const AiStrategyTool: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    setStrategy(null);
    try {
      const result = await generateStrategy(niche);
      setStrategy(result);
    } catch (error) {
      console.error(error);
      setStrategy("Sorry, our AI engine is currently overloaded. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-cyan-500/20 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>

        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-[10px] font-black uppercase mb-6 tracking-widest">
            AI Powered Feature
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
            GET YOUR FREE <br />
            <span className="text-cyan-400">7-DAY DOMINATION PLAN</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg">
            Enter your niche or business name below. Our Gemini AI will generate a custom 7-day social strategy to help you scale fast.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input 
              type="text" 
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Fitness Influencer, Luxury Real Estate..."
              className="flex-1 bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-white font-medium"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="px-8 py-4 bg-cyan-gradient text-black font-black rounded-2xl cyan-glow disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? 'ANALYZING...' : 'GENERATE PLAN'}
            </button>
          </div>

          {strategy && (
            <div className="bg-black/50 border border-white/5 rounded-2xl p-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h4 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
                ✨ Your Custom Growth Roadmap:
              </h4>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {strategy}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AiStrategyTool;
