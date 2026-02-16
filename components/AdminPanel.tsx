
import React, { useState, useEffect } from 'react';

interface AdminPanelProps {
  user: any;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [refillAmount, setRefillAmount] = useState('');

  useEffect(() => {
    const fetchData = () => {
      const allUsers = JSON.parse(localStorage.getItem('smm_users') || '[]');
      const allOrders = JSON.parse(localStorage.getItem('smm_orders') || '[]');
      const allTransactions = JSON.parse(localStorage.getItem('smm_transactions') || '[]');
      
      setUsers(allUsers);
      setOrders(allOrders.reverse());
      setTransactions(allTransactions.reverse());
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const allOrders = JSON.parse(localStorage.getItem('smm_orders') || '[]');
    const orderIdx = allOrders.findIndex((o: any) => o.id === orderId);
    if (orderIdx !== -1) {
      allOrders[orderIdx].status = newStatus;
      localStorage.setItem('smm_orders', JSON.stringify(allOrders));
      setOrders([...allOrders].reverse());
    }
  };

  const handleApprovePayment = (transaction: any) => {
    if (transaction.status !== 'Pending') return;

    const allTransactions = JSON.parse(localStorage.getItem('smm_transactions') || '[]');
    const tIdx = allTransactions.findIndex((t: any) => t.id === transaction.id);
    
    if (tIdx !== -1) {
      allTransactions[tIdx].status = 'Approved';
      localStorage.setItem('smm_transactions', JSON.stringify(allTransactions));
      
      // Add balance to user
      const allUsers = JSON.parse(localStorage.getItem('smm_users') || '[]');
      const uIdx = allUsers.findIndex((u: any) => u.username === transaction.username);
      if (uIdx !== -1) {
        allUsers[uIdx].balance = (allUsers[uIdx].balance || 0) + parseFloat(transaction.amount);
        localStorage.setItem('smm_users', JSON.stringify(allUsers));
        setUsers(allUsers);
      }
      setTransactions([...allTransactions].reverse());
      alert(`Payment Approved! ৳${transaction.amount} added to ${transaction.username}'s balance.`);
    }
  };

  const handleRejectPayment = (transactionId: string) => {
    const allTransactions = JSON.parse(localStorage.getItem('smm_transactions') || '[]');
    const tIdx = allTransactions.findIndex((t: any) => t.id === transactionId);
    if (tIdx !== -1) {
      allTransactions[tIdx].status = 'Rejected';
      localStorage.setItem('smm_transactions', JSON.stringify(allTransactions));
      setTransactions([...allTransactions].reverse());
    }
  };

  const handleManualRefill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !refillAmount) return;

    const allUsers = JSON.parse(localStorage.getItem('smm_users') || '[]');
    const uIdx = allUsers.findIndex((u: any) => u.username === editingUser.username);
    
    if (uIdx !== -1) {
      allUsers[uIdx].balance = (allUsers[uIdx].balance || 0) + parseFloat(refillAmount);
      localStorage.setItem('smm_users', JSON.stringify(allUsers));
      setUsers(allUsers);
      alert(`Successfully added ৳${refillAmount} to ${editingUser.username}.`);
      setEditingUser(null);
      setRefillAmount('');
    }
  };

  const totalRevenue = transactions.filter(t => t.status === 'Approved').reduce((acc, t) => acc + parseFloat(t.amount), 0);
  const pendingPayments = transactions.filter(t => t.status === 'Pending').length;

  const menuItems = [
    { id: 'overview', label: 'Admin Home', icon: '🏠' },
    { id: 'users', label: 'User Control', icon: '👥' },
    { id: 'orders', label: 'All Orders', icon: '📦' },
    { id: 'payments', label: 'Refill Requests', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-[#050505] border-r border-white/5 flex flex-col fixed h-full z-20 transition-all duration-500 ${sidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(220,38,38,0.3)]">A</div>
          {sidebarOpen && <span className="font-black text-xl tracking-tighter">ADMIN<span className="text-red-600">HUB</span></span>}
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-sm font-bold ${
                activeTab === item.id ? 'bg-red-600/10 text-red-500 border border-red-500/20' : 'text-gray-500 hover:bg-white/5'
              } ${!sidebarOpen && 'justify-center'}`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-6">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-gray-500 hover:text-white transition-all text-sm font-black uppercase tracking-widest">
            🚪 {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-h-screen bg-black relative p-8 md:p-12 overflow-y-auto transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">System <span className="text-red-600">Command</span></h1>
            <p className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase mt-2">Access Level: Root Administrator</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Active System</p>
              <p className="text-sm font-black text-green-500">v4.2.0 ONLINE</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-xl font-black">A</div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: users.length, icon: '👥', color: 'text-blue-400' },
                { label: 'Total Revenue', value: `৳${totalRevenue.toFixed(2)}`, icon: '💰', color: 'text-green-400' },
                { label: 'Total Orders', value: orders.length, icon: '📦', color: 'text-purple-400' },
                { label: 'Pending Payouts', value: pendingPayments, icon: '⏳', color: 'text-yellow-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col gap-2">
                   <span className="text-2xl mb-2">{stat.icon}</span>
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                   <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full"></div>
               <h2 className="text-2xl font-black uppercase mb-8">Recent System Activity</h2>
               <div className="space-y-4">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xs font-black text-gray-500">{o.username[0]}</div>
                          <div>
                             <p className="text-sm font-bold text-white">{o.username} placed an order</p>
                             <p className="text-[10px] text-gray-500 uppercase font-black">{o.serviceName}</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-xs font-black text-red-500">৳{o.charge}</span>
                          {o.link && <a href={o.link} target="_blank" rel="noreferrer" className="text-[8px] text-cyan-400 font-bold uppercase mt-1 hover:underline">View Link</a>}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Username</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Email</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Balance</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {users.map((u: any) => (
                        <tr key={u.email} className="hover:bg-white/[0.02]">
                           <td className="px-8 py-6 font-bold text-white">{u.username}</td>
                           <td className="px-8 py-6 text-sm text-gray-400">{u.email}</td>
                           <td className="px-8 py-6 font-black text-green-400">৳{(u.balance || 0).toFixed(2)}</td>
                           <td className="px-8 py-6">
                              <button onClick={() => setEditingUser(u)} className="px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-lg uppercase hover:bg-white hover:text-black transition-all">Manual Refill</button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
             <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-x-auto">
                <table className="w-full text-left min-w-[1000px]">
                   <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Order ID</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">User</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Service</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Target Link</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Status</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {orders.map((o: any) => (
                        <tr key={o.id} className="hover:bg-white/[0.02]">
                           <td className="px-8 py-6 text-xs font-black text-red-500">{o.id}</td>
                           <td className="px-8 py-6 text-sm font-bold text-white">{o.username}</td>
                           <td className="px-8 py-6 text-xs text-gray-400 max-w-[200px] truncate">{o.serviceName}</td>
                           <td className="px-8 py-6">
                              {o.link ? (
                                <a href={o.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-cyan-400 hover:underline max-w-[150px] truncate block">
                                  {o.link}
                                </a>
                              ) : <span className="text-gray-600 text-[10px]">NO LINK</span>}
                           </td>
                           <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${o.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>{o.status}</span>
                           </td>
                           <td className="px-8 py-6">
                              <select 
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                className="bg-black border border-white/10 text-[10px] font-bold rounded-lg px-2 py-1 outline-none focus:border-red-500"
                              >
                                 <option value="Pending">Pending</option>
                                 <option value="Processing">Processing</option>
                                 <option value="Completed">Completed</option>
                                 <option value="Canceled">Canceled</option>
                              </select>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
             <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                   <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">User</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Amount</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Method</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">TrxID</th>
                         <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {transactions.length === 0 ? <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-600 font-black uppercase tracking-widest">No payment requests.</td></tr> : transactions.map((t: any) => (
                        <tr key={t.id} className="hover:bg-white/[0.02]">
                           <td className="px-8 py-6 font-bold text-white">{t.username}</td>
                           <td className="px-8 py-6 font-black text-green-500">৳{t.amount}</td>
                           <td className="px-8 py-6 text-[10px] font-black uppercase text-gray-500">{t.method}</td>
                           <td className="px-8 py-6 text-sm font-bold text-white font-mono">{t.trxId}</td>
                           <td className="px-8 py-6">
                              {t.status === 'Pending' ? (
                                <div className="flex items-center gap-2">
                                   <button onClick={() => handleApprovePayment(t)} className="px-3 py-1.5 bg-green-600 text-white text-[9px] font-black rounded-lg uppercase">Approve</button>
                                   <button onClick={() => handleRejectPayment(t.id)} className="px-3 py-1.5 bg-red-600 text-white text-[9px] font-black rounded-lg uppercase">Reject</button>
                                </div>
                              ) : (
                                <span className={`text-[10px] font-black uppercase ${t.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>{t.status}</span>
                              )}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* Refill Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingUser(null)}></div>
             <div className="relative w-full max-w-sm bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10">
                <h3 className="text-xl font-black uppercase mb-2">Manual Refill</h3>
                <p className="text-gray-500 text-xs font-bold mb-8 uppercase tracking-widest">Target: {editingUser.username}</p>
                
                <form onSubmit={handleManualRefill} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Amount to Add (৳)</label>
                      <input 
                        type="number" 
                        value={refillAmount} 
                        onChange={(e) => setRefillAmount(e.target.value)} 
                        className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-red-600 font-black text-white"
                        placeholder="0.00"
                        required
                      />
                   </div>
                   <button type="submit" className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all">Confirm Refill</button>
                </form>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
