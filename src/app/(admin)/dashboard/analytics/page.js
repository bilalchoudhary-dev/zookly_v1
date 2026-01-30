"use client";
import { useState, useEffect } from "react";
import { getProfile } from "@/actions/linkActions";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Loader2, TrendingUp, MousePointer2, Eye } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const profile = await getProfile();
      setData(profile);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  // 1. Calculate Stats
  const totalViews = data?.views || 0;
  
  // Sum up all clicks from the links array
  const totalClicks = data?.links.reduce((acc, link) => acc + (link.clicks || 0), 0) || 0;
  
  // Calculate CTR (Clicks / Views)
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

  // Prepare Chart Data (Top 5 Links)
  const chartData = data?.links
    .map(link => ({ name: link.title, clicks: link.clicks || 0 }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="text-slate-500">Track your profile performance</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Views" 
          value={totalViews.toLocaleString()} 
          icon={Eye} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Total Clicks" 
          value={totalClicks.toLocaleString()} 
          icon={MousePointer2} 
          color="bg-green-50 text-green-600" 
        />
        <StatCard 
          title="Click Through Rate" 
          value={`${ctr}%`} 
          icon={TrendingUp} 
          color="bg-purple-50 text-purple-600" 
        />
      </div>

      {/* CHART SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Top Performing Links</h3>
        
        {chartData && chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748B', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748B', fontSize: 12}} 
                />
                <Tooltip 
                  cursor={{fill: '#F1F5F9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="clicks" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-400">
            No link data available yet. Share your profile!
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-black text-slate-900">{value}</h3>
      </div>
    </div>
  );
}