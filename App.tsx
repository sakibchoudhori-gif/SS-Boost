
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Footer from './components/Footer';
import SplitAuth from './components/SplitAuth';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('smm_current_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const openLogin = () => setAuthMode('login');
  const openSignup = () => setAuthMode('signup');
  const closeAuth = () => setAuthMode(null);

  const handleAuthSuccess = (userData: any) => {
    setLoading(true);
    setTimeout(() => {
      setUser(userData);
      localStorage.setItem('smm_current_user', JSON.stringify(userData));
      setAuthMode(null);
      setLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('smm_current_user');
      setLoading(false);
    }, 1200);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (authMode) {
    return (
      <SplitAuth 
        mode={authMode} 
        onSwitch={(m) => setAuthMode(m)} 
        onBack={closeAuth} 
        onSuccess={handleAuthSuccess} 
      />
    );
  }

  // If user is logged in
  if (user) {
    // Check if user is admin
    if (user.username.toLowerCase() === 'admin') {
      return <AdminPanel user={user} onLogout={handleLogout} />;
    }
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 animate-in fade-in duration-1000">
        <Navbar 
          onLogin={openLogin} 
          onSignup={openSignup} 
        />
        <main>
          <Hero onSignup={openSignup} />
          <Stats />
        </main>
        <Footer />
      </div>

      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        <a 
          href="https://wa.me/yournumber" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform active:scale-95 group relative"
        >
          <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <div className="absolute right-full mr-6 bg-white text-black text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl uppercase tracking-widest pointer-events-none flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            ONLINE
          </div>
        </a>
      </div>
    </div>
  );
};

export default App;
