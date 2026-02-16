
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="pt-20 pb-10 px-6 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-cyan-gradient rounded-md flex items-center justify-center text-black font-black text-sm">
                SD
              </div>
              <span className="text-lg font-bold tracking-tighter uppercase">
                SOCIAL<span className="text-cyan-400">DOMINATE</span>
              </span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8">
              The premium SMM solution for creators, influencers, and digital marketers. 
              Built for speed, reliability, and scale.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Discord', 'Telegram', 'Instagram'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-400 hover:text-black transition-all">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-current rounded-sm"></div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-cyan-400">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Child Panels</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bulk Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-cyan-400">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-medium">
          <p>© 2024 SOCIALDOMINATE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              API SYSTEM STATUS: ONLINE
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              1.2K USERS ONLINE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
