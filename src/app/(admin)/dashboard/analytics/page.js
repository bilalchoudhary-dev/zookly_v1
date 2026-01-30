"use client";
import { useState, useEffect } from "react";
import { getProfile } from "@/actions/linkActions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Loader2, TrendingUp, MousePointer2, Eye } from "lucide-react";

// --- Sub-component: Skeleton Loader ---
function AnalyticsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 animate-pulse" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 rounded" />
        <div className="h-4 w-64 bg-slate-200 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-200" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-6 w-16 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="h-6 w-40 bg-slate-200 rounded" />
        <div className="h-[300px] w-full bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

// --- Sub-component: Stat Card ---
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div className={`p-3 rounded-xl ${color} shrink-0`}>
        <Icon size={24} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const profile = await getProfile();
        if (isMounted) setData(profile);
      } catch (error) {
        console.error("Failed to load analytics");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <AnalyticsSkeleton />;

  // 1. Calculate Stats Safe Guards
  const totalViews = data?.views || 0;
  const totalClicks = data?.links?.reduce((acc, link) => acc + (link.clicks || 0), 0) || 0;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  // Prepare Chart Data (Top 5 Links)
  const chartData = data?.links
    ? data.links
        .map((link) => ({ 
          name: link.title || "Untitled", 
          clicks: link.clicks || 0 
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5)
    : [];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="text-slate-500">Track your profile performance</p>
      </header>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Key Statistics">
        <StatCard title="Total Views" value={totalViews.toLocaleString()} icon={Eye} color="bg-blue-50 text-blue-600" />
        <StatCard title="Total Clicks" value={totalClicks.toLocaleString()} icon={MousePointer2} color="bg-green-50 text-green-600" />
        <StatCard title="Click Through Rate" value={`${ctr}%`} icon={TrendingUp} color="bg-purple-50 text-purple-600" />
      </section>

      {/* CHART SECTION */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 text-lg">Top Performing Links</h3>
        
        {chartData.length > 0 ? (
          /* FIX: Added style width/height and min-w-0 to prevent Recharts warning */
          <div style={{ width: "100%", height: 300 }} className="min-w-0" aria-label="Bar chart showing top 5 links by clicks">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748B', fontSize: 12}} 
                  dy={10}
                  interval={0} 
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748B', fontSize: 12}} 
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="clicks" 
                  fill="#2563EB" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                  name="Clicks"
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <Loader2 className="opacity-0 mb-2" size={48} /> {/* Placeholder spacer */}
            <p className="font-medium">No link data available yet</p>
            <p className="text-sm">Share your profile to start tracking!</p>
          </div>
        )}
      </section>
    </div>
  );
}