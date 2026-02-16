
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onLogin: () => void;
  onSignup: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin, onSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-10 h-10 bg-cyan-gradient rounded-lg flex items-center justify-center text-black font-black text-xl group-hover:scale-110 transition-transform">
            SD
          </div>
          <span className="text-xl font-bold tracking-tighter">
            SOCIAL<span className="text-cyan-400">DOMINATE</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors">Services</a>
          <a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors">API</a>
          <a href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors">Support</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="px-5 py-2 text-sm font-semibold border border-white/20 hover:border-cyan-400 hover:text-cyan-400 transition-all rounded-full hidden sm:block"
          >
            LOGIN
          </button>
          <button 
            onClick={onSignup}
            className="px-6 py-2 text-sm font-bold bg-cyan-gradient text-black rounded-full cyan-glow transition-all active:scale-95"
          >
            SIGNUP
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
