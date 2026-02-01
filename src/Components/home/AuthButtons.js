"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LayoutDashboard, ExternalLink, User } from "lucide-react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

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
      <div className="flex items-center gap-3">
        <Link 
          href={`/${session.user?.username}`} 
          target="_blank" // Open in new tab so they don't lose the dashboard
          className="hidden sm:flex items-center gap-2 text-slate-600 font-bold text-sm hover:text-blue-600 transition-colors px-2"
        >
          <span className="opacity-50">zookly.com/</span>{session.user?.username}
          <ExternalLink size={14} className="opacity-50" />
        </Link>

        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          <LayoutDashboard size={16} />
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