"use client";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { LayoutDashboard, LogIn } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-1">
          LinkHub<span className="text-blue-600">.</span>
        </Link>

        {/* Dynamic CTA */}
        <div>
          {session ? (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          ) : (
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
          )}
        </div>
      </div>
    </nav>
  );
}