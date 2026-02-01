"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Loader2 } from "lucide-react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  // 1. Loading State (Prevents layout shift/flicker)
  if (status === "loading") {
    return (
      <div className="flex items-center gap-4">
         <div className="w-16 h-8 bg-slate-100 rounded-full animate-pulse" />
      </div>
    );
  }

  // 2. Authenticated State
  if (session) {
    return (
      <Link 
        href="/dashboard" 
        className="flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors"
      >
        <LayoutDashboard size={16} />
        Dashboard
      </Link>
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