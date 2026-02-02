"use client";
import { useState, useEffect, Suspense } from "react";
import { claimUsername } from "@/actions/usernameActions";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, ArrowRight, Sparkles, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

function OnboardingContent() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const desired = searchParams.get("desiredUsername");
    if (desired) {
      setInputValue(desired.toLowerCase().replace(/[^a-z0-9-_]/g, ""));
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    const sanitized = val.toLowerCase().replace(/[^a-z0-9-_]/g, "");
    setInputValue(sanitized);
    if (error) setError("");
  };

  async function handleSubmit(formData) {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
     
      const result = await claimUsername(formData);

      if (result.success) {
        await update({ username: result.username });
        router.refresh();
        router.push("/dashboard");
        toast.success("🎉 Username claimed successfully!");
      } else {
        setError(result.error || "Failed to claim username");
        setLoading(false);
        toast.error("Failed to claim username, please try again later.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const isValidLength = inputValue.length >= 3;

  return (
    // Background: Added a subtle grid pattern and radial gradient for depth
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-50 overflow-hidden p-4">
      {/* Abstract Background Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-20%,#3b82f615,transparent)] pointer-events-none" />

      <main className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/50 w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm rotate-3 hover:rotate-6 transition-transform">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            Claim your unique handle
          </h1>
          <p className="text-slate-500 text-base">
            This is the start of your new digital identity.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-8">
          
          {/* Input Group */}
          <div className="space-y-4">
            <div className="relative group">
              {/* Animated Label/Prefix */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 font-medium select-none pointer-events-none transition-colors group-focus-within:text-blue-500">
                <LinkIcon size={16} />
                <span>Zookly.com/</span>
              </div>
              
              <input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={inputValue}
                disabled={loading}
                onChange={handleInputChange}
                className={`
                  w-full pl-[8.5rem] pr-12 py-4 rounded-2xl border-2 bg-slate-50/50
                  outline-none transition-all font-bold text-lg tracking-wide
                  placeholder:text-slate-300
                  disabled:opacity-70 disabled:cursor-not-allowed
                  ${error 
                    ? "border-red-100 bg-red-50/30 text-red-900 focus:border-red-300 focus:ring-4 focus:ring-red-500/10" 
                    : "border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-slate-900"
                  }
                `}
                required
                autoComplete="off"
                autoFocus
                aria-invalid={!!error}
              />

              {/* Success Indicator (Visual only) */}
              {isValidLength && !error && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in spin-in-90 duration-300">
                  <CheckCircle2 size={24} fill="#ecfdf5" />
                </div>
              )}
            </div>

            {/* Live Link Preview Card */}
            <div className={`
              flex items-center gap-3 p-3 rounded-xl border border-dashed transition-all duration-300
              ${inputValue ? "bg-blue-50/50 border-blue-200 opacity-100" : "bg-slate-50 border-slate-200 opacity-60 grayscale"}
            `}>
              <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                 {inputValue.slice(0, 2).toUpperCase() || "??"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Your Live Link</p>
                <p className="text-sm font-bold text-slate-900 truncate">
                  Zookly.com/<span className="text-blue-600">{inputValue || "username"}</span>
                </p>
              </div>
            </div>
            
            {/* Error Message */}
            <div className="min-h-[24px]">
              {error && (
                <p className="text-red-600 text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  {error}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isValidLength}
            className={`
              relative w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-200
              flex items-center justify-center gap-3 overflow-hidden group
              ${loading || !isValidLength
                ? "bg-slate-300 cursor-not-allowed shadow-none" 
                : "bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:scale-[1.01] hover:shadow-slate-900/20 active:scale-[0.98]"
              }
            `}
          >
            {/* Subtle sheen effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
            
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Securing handle...</span>
              </>
            ) : (
              <>
                <span>Claim my page</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </main>

      {/* Footer Badge (Optional) */}
      <div className="mt-8 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm text-xs text-slate-500 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Logged in
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}