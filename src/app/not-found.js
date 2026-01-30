import Link from "next/link";
import { Home, Search, MoveLeft } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 overflow-hidden px-4">
      
      {/* 1. Consistent Zookly Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-20%,#3b82f615,transparent)] pointer-events-none" />

      {/* 2. Main Glass Card */}
      <main className="relative z-10 w-full max-w-lg bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-slate-200/50 text-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Floating 404 Graphic */}
        <div className="relative mb-8">
            <h1 className="text-9xl font-black text-slate-900/5 select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center shadow-inner rotate-12">
                   <Search className="text-blue-600 w-10 h-10" />
                </div>
            </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          Page not found
        </h2>
        
        <p className="text-slate-500 text-lg mb-10 leading-relaxed max-w-xs mx-auto">
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-[0.98] group"
          >
            <Home size={18} />
            <span>Zookly Home</span>
          </Link>

          <button 
            // Basic "Go Back" functionality
            // In a server component we can just use a link, or client component for router.back()
            // Here linking to Login/Dashboard is usually safer than 'back'
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
          >
            <Link href="/login" className="flex items-center gap-2 w-full h-full">
                <span>Login</span>
            </Link>
          </button>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-8 text-center">
        <p className="flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest text-slate-300">
           Zookly
        </p>
      </footer>
    </div>
  );
}