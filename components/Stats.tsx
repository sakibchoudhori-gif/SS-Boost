
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, highlight }) => (
  <div className={`bg-[#0A0A0A] border p-8 rounded-3xl transition-all group ${highlight ? 'border-cyan-400/50 shadow-[0_0_20px_rgba(0,255,255,0.1)]' : 'border-white/5 hover:border-cyan-400/30'}`}>
    <p className={`text-sm font-bold tracking-widest uppercase mb-2 ${highlight ? 'text-cyan-400' : 'text-gray-500'}`}>{label}</p>
    <p className={`text-4xl md:text-5xl font-black transition-colors ${highlight ? 'text-white' : 'text-white group-hover:text-cyan-400'}`}>{value}</p>
  </div>
);

const Stats: React.FC = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Orders" value="2.4M+" />
          <StatCard label="Active Users" value="12K+" />
          <StatCard label="Services" value="1.5K+" />
          <StatCard label="Uptime" value="99.9%" />
        </div>
      </div>
    </section>
  );
};

export default Stats;
