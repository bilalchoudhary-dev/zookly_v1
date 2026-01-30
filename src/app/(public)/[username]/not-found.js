import Link from "next/link";
import { FileQuestion, ArrowLeft, Sparkles } from "lucide-react";

export default function UserNotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 overflow-hidden">
      {/* Background Decor: Consistent with other pages */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#3b82f615,transparent)] pointer-events-none" />

      <main className="relative z-10 w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500">
        
        {/* Icon Container */}
        <div className="mx-auto w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-8 shadow-sm rotate-3 border border-slate-200">
          <FileQuestion className="text-slate-400" size={40} />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Profile not found
        </h1>
        
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          The LinkHub page you are looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          {/* Primary CTA */}
          <Link 
            href="/" 
            className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-[0.98]"
          >
            <Sparkles size={18} />
            Create your LinkHub
          </Link>

          {/* Secondary CTA */}
          <Link 
            href="/" 
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-8 opacity-40 hover:opacity-100 transition-opacity">
        <span className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-slate-500">
          LinkHub
        </span>
      </footer>
    </div>
  );
}