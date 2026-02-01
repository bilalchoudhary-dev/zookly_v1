"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LayoutDashboard, ExternalLink, Globe } from "lucide-react"; // Import Globe or ExternalLink

export default function AuthButtons() {
  const { data: session, status } = useSession();

  // 1. Loading State
  if (status === "loading") {
    return (
      <div className="flex items-center gap-4">
         <div className="w-24 h-8 bg-slate-100 rounded-full animate-pulse" />
      </div>
    );
  }

  // 2. Authenticated State
  if (session) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* --- DESKTOP VIEW: Full Text Link --- */}
        {/* hidden on mobile (hidden), flex on tablet+ (sm:flex) */}
        <Link 
          href={`/${session.user?.username}`} 
          target="_blank" 
          className="hidden sm:flex items-center gap-2 text-slate-600 font-bold text-sm hover:text-blue-600 transition-colors px-2"
        >
          <span className="opacity-50">zookly.com/</span>{session.user?.username}
          <ExternalLink size={14} className="opacity-50" />
        </Link>

        {/* --- MOBILE VIEW: Icon Button --- */}
        {/* flex on mobile (flex), hidden on tablet+ (sm:hidden) */}
        <Link 
          href={`/${session.user?.username}`} 
          target="_blank"
          aria-label="View my page"
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-600 border border-slate-200 active:scale-95 transition-all"
        >
          <Globe size={18} />
        </Link>

        {/* --- DASHBOARD BUTTON (Always Visible) --- */}
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          <LayoutDashboard size={16} />
          {/* Hide text on very small screens if needed, or keep it */}
          <span>Dashboard</span>
        </Link>
      </div>
    );
  }

  // 3. Guest State
  return (
    <div className="flex items-center gap-4">
      <Link 
        href="/login"
        className="text-slate-600 font-bold text-sm hover:text-slate-900"
      >
        Sign In
      </Link>
      <Link 
        href="/login"
        className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-colors"
      >
        Get Started
      </Link>
    </div>
  );
}