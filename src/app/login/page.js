"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Github, LogOut, Loader2, User, LayoutDashboard, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // 1. Loading State: Centered with a sleek animation
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-semibold animate-pulse text-sm">Securing connection...</p>
      </div>
    );
  }

  // 2. Logged In State: Show Profile Card
  if (session) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-50 overflow-hidden p-4">
        {/* Background Decor */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-20%,#3b82f615,transparent)] pointer-events-none" />

        <main className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="relative w-24 h-24 mx-auto mb-6 group">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                fill
                priority // Load high priority for LCP score
                className="rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-white shadow-md">
                <User size={40} />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full" title="Online" />
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
            Welcome back, {session.user.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-500 mb-8 text-sm font-medium bg-slate-100/50 inline-block px-3 py-1 rounded-full border border-slate-200/50">
            {session.user.email}
          </p>
          
          <div className="grid gap-3">
            <Link 
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-6 py-4 rounded-xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-[0.98]"
            >
              <LayoutDashboard size={20} /> Go to Dashboard
            </Link>
            
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 font-bold px-6 py-4 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-[0.98]"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 3. Logged Out State: Login Form
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-50 overflow-hidden p-4">
      {/* Background Decor: Consistent with Onboarding page */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-20%,#3b82f615,transparent)] pointer-events-none" />

      <main className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="text-center mb-10">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-600/20 rotate-3 hover:rotate-6 transition-transform duration-300">
            <User className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome to LinkHub</h1>
          <p className="text-slate-500 text-sm font-medium">
            Sign in to manage your links and analytics.
          </p>
        </header>

        {/* Error Feedback */}
        {error && (
          <div 
            className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-3"
            role="alert"
          >
            <ShieldCheck className="shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-bold">Authentication Failed</p>
              <p>Error: {error}. Please try again.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="group relative flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold px-6 py-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] shadow-sm"
            aria-label="Sign in with Google"
          >
            {/* Google Logo SVG */}
            <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button 
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="group flex items-center justify-center gap-3 bg-[#24292F] text-white font-bold px-6 py-4 rounded-xl hover:bg-[#24292F]/90 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-[0.98]"
            aria-label="Sign in with GitHub"
          >
            <Github size={20} className="shrink-0 transition-transform group-hover:scale-110" /> 
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-60">
           <div className="h-px bg-slate-300 flex-1" />
           <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Secure Login</span>
           <div className="h-px bg-slate-300 flex-1" />
        </div>
      </main>
      
      {/* Footer Text */}
      <p className="mt-8 text-center text-xs text-slate-400 max-w-xs mx-auto">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}