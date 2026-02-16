
import React, { useState, useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('smm_users') || '[]');

    if (mode === 'signup') {
      const exists = users.find((u: any) => u.email === email);
      if (exists) {
        setError('Email already exists');
        return;
      }
      const newUser = { username, email, password, balance: 0 };
      users.push(newUser);
      localStorage.setItem('smm_users', JSON.stringify(users));
      onAuthSuccess(newUser);
    } else {
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        onAuthSuccess(user);
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-cyan-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-cyan-400/20 blur-3xl rounded-full"></div>

        <div className="p-8 md:p-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <button 
              onClick={() => { setMode('login'); setError(''); }}
              className={`text-lg font-black tracking-tighter transition-all ${mode === 'login' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
            >
              LOGIN
            </button>
            <div className="w-px h-6 bg-white/10"></div>
            <button 
              onClick={() => { setMode('signup'); setError(''); }}
              className={`text-lg font-black tracking-tighter transition-all ${mode === 'signup' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
            >
              SIGNUP
            </button>
          </div>

          {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-bold text-center">{error}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. jdoe_growth"
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-white"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-white"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 mt-4 bg-cyan-gradient text-black font-black rounded-2xl cyan-glow transition-all active:scale-95 uppercase"
            >
              {mode === 'login' ? 'Enter Dashboard' : 'Create My Account'}
            </button>
          </form>

          <p className="text-center text-[10px] text-gray-600 mt-8 font-medium uppercase tracking-widest">
            {mode === 'login' ? "Don't have an account?" : "Already a member?"}
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="ml-2 text-cyan-400 font-bold hover:underline"
            >
              {mode === 'login' ? 'SIGN UP HERE' : 'LOG IN HERE'}
            </button>
          </p>
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
