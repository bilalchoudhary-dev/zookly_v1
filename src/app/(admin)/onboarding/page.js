"use client";
import { useState, useEffect } from "react";
// CHANGED: Verify this import path matches your project structure (app/actions vs lib/actions)
import { claimUsername } from "@/app/actions"; 
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function Onboarding() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const desired = searchParams.get("desiredUsername");
    if (desired) {
      setInputValue(desired);
    }
  }, [searchParams]);

  async function handleSubmit(formData) {
    setLoading(true);
    setError("");

    const result = await claimUsername(formData);

    if (result.success) {
      // 1. Update the session cookie so middleware sees the new username
      await update({ username: result.username });
      
      // CHANGED: Added router.refresh() to invalidate Client Cache
      // Without this, the Dashboard checks the old cached session (no username) and kicks you back here.
      router.refresh(); 

      // 3. Navigate after the refresh logic is queued
      router.push("/dashboard");
    } else if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Claim your handle</h1>
        <p className="text-slate-500 mb-6">This will be your permanent link.</p>

        <form action={handleSubmit} className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              linkhub.com/
            </span>
            <input
              name="username"
              placeholder="username"
              value={inputValue}
              // CHANGED: Disabled input during loading to prevent double-edits while submitting
              disabled={loading}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-28 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
              required
              autoFocus
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Claim Username"}
          </button>
        </form>
      </div>
    </div>
  );
}