"use client";
import { useState } from "react";
import { claimUsername } from "@/actions/usernameActions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export default function Onboarding() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { update } = useSession();

  async function handleSubmit(formData) {
    setLoading(true);
    setError("");

    const result = await claimUsername(formData);

    if (result.success) {
      await update({ username: result.username });
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
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              linkhub.com/
            </span>
            <input
              name="username"
              placeholder="username"
              className="w-full pl-28 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            {loading ? "Checking..." : "Claim Username"}
          </button>
        </form>
      </div>
    </div>
  );
}
