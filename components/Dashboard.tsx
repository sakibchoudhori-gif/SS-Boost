
import React, { useState, useEffect } from 'react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const servicesList = [
  { id: 1, category: 'Instagram', name: 'IG Followers [HQ - Real]', price: 0.50, min: 100, max: 10000 },
  { id: 2, category: 'Instagram', name: 'IG Likes [Instant - Refill]', price: 0.10, min: 50, max: 50000 },
  { id: 3, category: 'TikTok', name: 'TikTok Followers [Global]', price: 0.80, min: 100, max: 5000 },
  { id: 4, category: 'TikTok', name: 'TikTok Views [Viral]', price: 0.01, min: 1000, max: 1000000 },
  { id: 5, category: 'YouTube', name: 'YT Watch Time [4000H Pack]', price: 15.00, min: 1, max: 10 },
  { id: 6, category: 'YouTube', name: 'YT Subscribers [Non-Drop]', price: 2.50, min: 100, max: 2000 },
];

const Dashboard: React.FC<DashboardProps> = ({ user: initialUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | null>(null);
  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [orders, setOrders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // New Order State
  const [selectedServiceId, setSelectedServiceId] = useState<number>(servicesList[0].id);
  const [orderLink, setOrderLink] = useState('');
  const [orderQuantity, setOrderQuantity] = useState<number>(100);

  // Sync Data
  useEffect(() => {
    const syncData = () => {
      const users = JSON.parse(localStorage.getItem('smm_users') || '[]');
      const updatedUser = users.find((u: any) => u.username === user.username);
      if (updatedUser) {
        setUser(updatedUser);
      }
      
      const allOrders = JSON.parse(localStorage.getItem('smm_orders') || '[]');
      const userOrders = allOrders.filter((o: any) => o.username === user.username);
      setOrders(userOrders.reverse()); 

      const allTransactions = JSON.parse(localStorage.getItem('smm_transactions') || '[]');
      const userTransactions = allTransactions.filter((t: any) => t.username === user.username);
      setTransactions(userTransactions.reverse());
    };

    syncData();
    const interval = setInterval(syncData, 3000);
    return () => clearInterval(interval);
  }, [user.username]);

  const handleCopy = () => {
    const inviteCode = user.username || 'user';
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const service = servicesList.find(s => s.id === selectedServiceId);
    if (!service) return;

    const totalCharge = (service.price * orderQuantity) / 1000;
    
    if (user.balance < totalCharge) {
      alert("Insufficient balance! Please add funds.");
      return;
    }

    const newOrder = {
      id: '#' + Math.floor(100000 + Math.random() * 900000),
      username: user.username,
      serviceName: service.name,
      category: service.category,
      link: orderLink,
      quantity: orderQuantity,
      charge: totalCharge.toFixed(2),
      status: 'Pending',
      date: new Date().toLocaleString(),
    };

    const users = JSON.parse(localStorage.getItem('smm_users') || '[]');
    const userIdx = users.findIndex((u: any) => u.username === user.username);
    if (userIdx !== -1) {
      users[userIdx].balance -= totalCharge;
      localStorage.setItem('smm_users', JSON.stringify(users));
      localStorage.setItem('smm_current_user', JSON.stringify(users[userIdx]));
      setUser(users[userIdx]);
    }

    const allOrders = JSON.parse(localStorage.getItem('smm_orders') || '[]');
    allOrders.push(newOrder);
    localStorage.setItem('smm_orders', JSON.stringify(allOrders));

    alert("Order placed successfully!");
    setOrderLink('');
    setActiveTab('orders');
  };

  const handleConfirmPayment = () => {
    if (!amount || !trxId) {
      alert("Please fill in both Amount and Transaction ID.");
      return;
    }

    const newTransaction = {
      id: '#' + Math.floor(1000000 + Math.random() * 9000000),
      username: user.username,
      method: paymentMethod?.toUpperCase(),
      amount: amount,
      trxId: trxId,
      status: 'Pending',
      date: new Date().toLocaleString(),
    };

    const allTransactions = JSON.parse(localStorage.getItem('smm_transactions') || '[]');
    allTransactions.push(newTransaction);
    localStorage.setItem('smm_transactions', JSON.stringify(allTransactions));

    alert('Refill request submitted. Admin will verify the TrxID and update your balance.');
    setAmount('');
    setTrxId('');
    setPaymentMethod(null);
    setActiveTab('transactions');
  };

  const selectedService = servicesList.find(s => s.id === selectedServiceId) || servicesList[0];
  const calculatedCharge = ((selectedService.price * orderQuantity) / 1000).toFixed(2);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>) },
    { id: 'new-order', label: 'New Order', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>) },
    { id: 'orders', label: 'Orders History', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>) },
    { id: 'add-funds', label: 'Add Funds', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>) },
    { id: 'transactions', label: 'Transactions', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>) },
    { id: 'refer-earn', label: 'Refer & Earn', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>) },
    { id: 'profile', label: 'My Profile', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>) },
  ];

  const StatCard = ({ title, value, subValue, prefix = "৳" }: { title: string, value: string, subValue?: string, prefix?: string }) => (
    <div className="relative group overflow-hidden">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] transition-all group-hover:border-cyan-400/30 group-hover:bg-white/[0.07]"></div>
      <div className="relative p-8 flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">{prefix} {value}</span>
          {subValue && <span className="text-xs text-green-400 font-bold">+{subValue}%</span>}
        </div>
        <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-gradient w-2/3 group-hover:w-3/4 transition-all duration-700"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#000000] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-black border-r border-white/5 flex flex-col fixed h-full z-20 transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 bg-cyan-gradient rounded-xl flex items-center justify-center text-black font-black text-lg shadow-[0_0_20px_rgba(0,255,255,0.3)]">SD</div>
          {sidebarOpen && (
            <div className="flex flex-col animate-in fade-in duration-500">
              <span className="font-black text-xl tracking-tighter leading-none">DOMINATE</span>
              <span className="text-[10px] font-bold text-cyan-400 tracking-[0.3em] uppercase opacity-80">SaaS Elite</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-sm font-bold group ${
                activeTab === item.id ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              } ${!sidebarOpen && 'justify-center'}`}
            >
              <span className={`transition-transform group-hover:scale-110 shrink-0 ${activeTab === item.id ? 'text-cyan-400' : 'text-gray-600'}`}>{item.icon}</span>
              {sidebarOpen && <span className="animate-in fade-in duration-300">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button onClick={onLogout} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500/60 hover:text-red-500 transition-all text-sm font-black uppercase tracking-widest ${!sidebarOpen && 'justify-center'}`}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-h-screen bg-black relative p-8 md:p-12 overflow-y-auto transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-400/10 text-cyan-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">
                {activeTab === 'dashboard' ? `HELLO, ${user.username || 'CAPTAIN'}` : menuItems.find(i => i.id === activeTab)?.label}
              </h1>
              <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase">Nexus Sync v4.2 Active</p>
            </div>
          </div>
          <div className="w-14 h-14 rounded-3xl bg-cyan-gradient p-px overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.2)]">
            <div className="w-full h-full bg-black rounded-[inherit] flex items-center justify-center text-xl font-black text-cyan-400">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard title="Account Balance" value={(user.balance || 0).toFixed(2)} subValue="12" />
              <StatCard title="Total Spent" value={(orders.reduce((acc, o) => acc + parseFloat(o.charge), 0)).toFixed(2)} />
              <StatCard title="Passive Earn" value={(user.referralEarnings || 0).toFixed(2)} subValue="5" />
              <StatCard title="Total Referrals" value={(user.referralCount || 0).toString()} prefix="" />
            </div>

            <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-[3rem] p-12">
              <h3 className="text-2xl font-black tracking-tighter mb-1 uppercase">Interaction Trajectory</h3>
              <p className="text-gray-500 text-sm font-medium mb-12">Growth metrics updated in real-time.</p>
              <div className="h-[250px] w-full mt-12 relative flex items-end gap-2">
                {[40, 70, 45, 90, 65, 85, 55, 95, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-cyan-400/20 rounded-t-xl hover:bg-cyan-400 transition-all duration-700" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'new-order' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12">
               <form onSubmit={handlePlaceOrder} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Service</label>
                     <select value={selectedServiceId} onChange={(e) => setSelectedServiceId(parseInt(e.target.value))} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 text-white font-bold appearance-none">
                        {servicesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Quantity</label>
                     <input type="number" value={orderQuantity} onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 0)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 text-white font-bold" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Destination URL</label>
                   <input type="url" value={orderLink} onChange={(e) => setOrderLink(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 text-white font-bold" required />
                 </div>
                 <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-3xl p-8 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-cyan-400 uppercase mb-1 tracking-widest">Total Charge</p>
                      <p className="text-4xl font-black text-white">৳ {calculatedCharge}</p>
                    </div>
                    <button type="submit" className="px-12 py-5 bg-cyan-gradient text-black font-black rounded-2xl cyan-glow uppercase text-sm">PLACE ORDER</button>
                 </div>
               </form>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">ID</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Service</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Qty</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Charge</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {orders.length === 0 ? <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-600 font-bold uppercase tracking-widest">No history found.</td></tr> : orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                           <td className="px-8 py-6 text-xs font-black text-cyan-400">{order.id}</td>
                           <td className="px-8 py-6 text-sm font-bold text-white">{order.serviceName}</td>
                           <td className="px-8 py-6 text-sm font-bold text-gray-400">{order.quantity}</td>
                           <td className="px-8 py-6 text-sm font-black text-white">৳ {order.charge}</td>
                           <td className="px-8 py-6"><span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{order.status}</span></td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'add-funds' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <button onClick={() => setPaymentMethod('bkash')} className={`relative group p-1 rounded-[2.5rem] transition-all duration-500 ${paymentMethod === 'bkash' ? 'bg-gradient-to-br from-[#E2136E] to-[#b00c54] scale-[1.02]' : 'bg-white/5 hover:bg-white/10'}`}>
                 <div className="bg-black rounded-[2.4rem] p-10 h-full flex flex-col items-center gap-6">
                    <div className="w-16 h-16 bg-[#E2136E] rounded-2xl flex items-center justify-center p-2"><img src="https://upload.wikimedia.org/wikipedia/commons/8/8b/Bkash_logo.png" alt="bKash" className="w-full h-auto object-contain brightness-0 invert" /></div>
                    <h3 className="text-xl font-black">bKash Instant</h3>
                 </div>
               </button>
               <button onClick={() => setPaymentMethod('nagad')} className={`relative group p-1 rounded-[2.5rem] transition-all duration-500 ${paymentMethod === 'nagad' ? 'bg-gradient-to-br from-[#F7941D] to-[#d47b10] scale-[1.02]' : 'bg-white/5 hover:bg-white/10'}`}>
                 <div className="bg-black rounded-[2.4rem] p-10 h-full flex flex-col items-center gap-6">
                    <div className="w-16 h-16 bg-[#F7941D] rounded-2xl flex items-center justify-center p-2"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Nagad_Logo.svg/2560px-Nagad_Logo.svg.png" alt="Nagad" className="w-full h-auto object-contain brightness-0 invert" /></div>
                    <h3 className="text-xl font-black">Nagad Fast</h3>
                 </div>
               </button>
             </div>
             {paymentMethod && (
               <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 animate-in zoom-in-95 duration-500">
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Amount (৳)</label>
                           <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-400 text-2xl font-black text-cyan-400" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Transaction ID (TrxID)</label>
                           <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="Paste TrxID here" className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-400 text-white font-bold" />
                        </div>
                     </div>
                     <div className="p-6 bg-cyan-400/5 border border-cyan-400/20 rounded-2xl text-xs text-gray-400">
                        <p className="font-black text-cyan-400 uppercase mb-2">Instructions:</p>
                        <p>1. Pay the amount to our Merchant: <span className="text-white font-bold">01XXX-XXXXXX</span></p>
                        <p>2. Paste your transaction ID and click confirm.</p>
                     </div>
                     <button onClick={handleConfirmPayment} className="w-full py-6 bg-cyan-gradient text-black font-black rounded-2xl cyan-glow uppercase tracking-widest text-sm">CONFIRM PAYMENT</button>
                  </div>
               </div>
             )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">ID</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Method</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">TrxID</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {transactions.length === 0 ? <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-600 font-bold uppercase tracking-widest">No transaction history.</td></tr> : transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                           <td className="px-8 py-6 text-xs font-black text-gray-500">{t.id}</td>
                           <td className="px-8 py-6 text-sm font-black text-cyan-400">{t.method}</td>
                           <td className="px-8 py-6 text-sm font-black text-white">৳ {t.amount}</td>
                           <td className="px-8 py-6 text-sm font-bold text-gray-400">{t.trxId}</td>
                           <td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${t.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>{t.status}</span></td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'refer-earn' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 space-y-6">
                  <h2 className="text-5xl font-black tracking-tighter leading-none">INVITE FRIENDS.<br/><span className="text-cyan-400">EARN ৳ 10 PER SIGNUP.</span></h2>
                  <p className="text-gray-400 font-medium">Earn money instantly when your friends join using your invitation code.</p>
               </div>
               <div className="w-full md:w-[400px] bg-black border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Your Code</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-lg font-black text-cyan-400">{user.username || 'CAPTAIN'}</div>
                      <button onClick={handleCopy} className={`px-6 py-3 rounded-xl font-black text-xs uppercase ${copied ? 'bg-green-500 text-white' : 'bg-cyan-400 text-black hover:bg-white'}`}>{copied ? 'COPIED' : 'COPY'}</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/5 rounded-2xl text-center"><p className="text-[9px] text-gray-600 font-black uppercase mb-1">Total Ref</p><p className="text-xl font-black">{user.referralCount || 0}</p></div>
                     <div className="p-4 bg-white/5 rounded-2xl text-center"><p className="text-[9px] text-gray-600 font-black uppercase mb-1">Earned</p><p className="text-xl font-black">৳ {user.referralEarnings || 0}</p></div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-12">
               <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="w-full md:w-1/3 flex flex-col items-center gap-6">
                     <div className="w-40 h-40 rounded-[3rem] bg-cyan-gradient p-1">
                        <div className="w-full h-full bg-black rounded-[inherit] flex items-center justify-center text-6xl font-black text-cyan-400 shadow-inner">
                          {user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                     </div>
                     <div className="text-center">
                        <h3 className="text-2xl font-black tracking-tighter text-white">{user.username}</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Verified Member</p>
                     </div>
                  </div>

                  <div className="flex-1 w-full space-y-10">
                     <div className="space-y-6">
                        <h4 className="text-lg font-black text-cyan-400 uppercase tracking-widest border-b border-white/5 pb-4">Personal Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Username</label>
                              <div className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-gray-400 font-bold">
                                {user.username}
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Email Address</label>
                              <div className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-gray-400 font-bold">
                                {user.email}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-8 bg-cyan-400/5 border border-cyan-400/20 rounded-3xl">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Invite & Reward</p>
                              <p className="text-xs text-gray-400 font-medium">Earn ৳ 10 for every referral.</p>
                           </div>
                           <button onClick={handleCopy} className="px-6 py-3 bg-cyan-400 text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                             {copied ? 'COPIED' : 'COPY CODE'}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Floating WhatsApp UI for Dashboard consistent experience */}
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
      </main>
    </div>
  );
};

export default Dashboard;
