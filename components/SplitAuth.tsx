
import React, { useState } from 'react';

interface SplitAuthProps {
  mode: 'login' | 'signup';
  onSwitch: (mode: 'login' | 'signup') => void;
  onBack: () => void;
  onSuccess: (user: any) => void;
}

const SplitAuth: React.FC<SplitAuthProps> = ({ mode, onSwitch, onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('smm_users') || '[]');

    if (mode === 'signup') {
      const emailExists = users.find((u: any) => u.email === email);
      const userExists = users.find((u: any) => u.username.toLowerCase() === username.toLowerCase());
      
      if (emailExists) {
        setError('Email already exists');
        return;
      }
      if (userExists) {
        setError('Username already taken');
        return;
      }

      // Referral Logic
      if (invitationCode.trim()) {
        const referrerIndex = users.findIndex((u: any) => u.username.toLowerCase() === invitationCode.trim().toLowerCase());
        if (referrerIndex !== -1) {
          // Reward the referrer: 10 Taka + 1 referral count
          users[referrerIndex].balance = (users[referrerIndex].balance || 0) + 10;
          users[referrerIndex].referralCount = (users[referrerIndex].referralCount || 0) + 1;
          users[referrerIndex].referralEarnings = (users[referrerIndex].referralEarnings || 0) + 10;
          
          // If the referrer is currently logged in (unlikely during signup of another person on same browser but good for consistency)
          const currentUser = JSON.parse(localStorage.getItem('smm_current_user') || '{}');
          if (currentUser.username === users[referrerIndex].username) {
             localStorage.setItem('smm_current_user', JSON.stringify(users[referrerIndex]));
          }
        }
      }

      const newUser = { 
        username, 
        email, 
        password, 
        balance: 0, 
        invitationCode,
        referralCount: 0,
        referralEarnings: 0
      };
      
      users.push(newUser);
      localStorage.setItem('smm_users', JSON.stringify(users));
      onSuccess(newUser);
    } else {
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        onSuccess(user);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-black overflow-hidden animate-in fade-in duration-500">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-20 bg-gradient-to-br from-[#000808] via-black to-[#001a1a]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-8 bg-black border-2 border-cyan-400 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,255,0.2)]">
             <svg className="w-12 h-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
          </div>
          <h1 className="text-4xl font-black tracking-[0.3em] text-white mb-2">SOCIAL HUB <span className="text-cyan-400">X</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Premium SMM Ecosystem</p>
          <div className="mt-12 p-6 bg-cyan-400/5 border border-cyan-400/20 rounded-2xl max-w-xs">
            <p className="text-cyan-400 font-black text-sm uppercase mb-2">Partner Program</p>
            <p className="text-gray-400 text-xs font-medium leading-relaxed">Refer your friends using your username as the invitation code and earn ৳ 10 instantly for every signup.</p>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-900/5 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative bg-[#050505]">
        <button 
          onClick={onBack}
          className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          Close
        </button>

        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="text-4xl font-black tracking-tighter mb-4">
              {mode === 'signup' ? 'JOIN THE ELITE' : 'WELCOME BACK'}
            </h2>
            <p className="text-gray-500 font-medium">
              {mode === 'signup' ? 'Start your growth journey with Social Hub X.' : 'Access your professional command center.'}
            </p>
          </div>

          {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black text-center uppercase tracking-widest">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Username (Used as Invite Code)</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. MasterGrowth"
                    className="w-full bg-black border border-white/5 rounded-xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-white font-medium"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Invitation Code (Optional)</label>
                  <input 
                    type="text" 
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="Referrer's Username"
                    className="w-full bg-black border border-white/5 rounded-xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-white font-medium"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-black border border-white/5 rounded-xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-white font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-white/5 rounded-xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-white font-medium"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-5 mt-4 bg-cyan-400 text-black font-black rounded-xl hover:bg-[#00FFFF] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              {mode === 'signup' ? 'SIGNUP' : 'LOGIN'}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => onSwitch(mode === 'login' ? 'signup' : 'login')}
              className="ml-3 text-cyan-400 hover:text-white transition-colors"
            >
              {mode === 'login' ? 'Create Account' : 'Login Instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplitAuth;
