"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
// CHANGED: Imported useSearchParams to capture login errors
import { useSearchParams } from "next/navigation";
import { Github, LogOut, Loader2, User } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  // CHANGED: Hook to read query parameters (e.g., ?error=AccessDenied)
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // 1. Improved Loading Spinner UX
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-semibold animate-pulse">Verifying session...</p>
      </div>
    );
  }


  if (session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/40 text-center">
          <div className="relative w-24 h-24 mx-auto mb-6 group">
            {/* 2. Default Avatar Fallback Logic */}
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                fill
                className="rounded-full object-cover border-4 border-slate-50 shadow-sm"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-4 border-white shadow-sm">
                <User size={40} />
              </div>
            )}
            <div className="absolute inset-0 rounded-full border border-black/5 pointer-events-none" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Welcome, {session.user.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mb-8 text-sm font-medium">{session.user.email}</p>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-[0.98]"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/40">
        <header className="text-center mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-200">
            <User className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Sign In</h1>
          <p className="text-slate-500 text-sm">Choose a provider to continue to your dashboard.</p>
        </header>

        {/* CHANGED: Added error feedback UI to inform users why login failed */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center">
            Login failed: {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* 3. Redirect Callbacks added to signIn */}
          <button 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold px-6 py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button 
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-3 bg-slate-900 text-white font-bold px-6 py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md shadow-slate-200"
          >
            <Github size={20} /> Continue with GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-[11px] text-slate-400 uppercase tracking-widest font-bold">
          Secure Cloud Authentication
        </p>
      </div>
    </main>
  );
}