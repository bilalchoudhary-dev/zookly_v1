"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/actions/linkActions";
import { updateTheme } from "@/actions/themeActions";
import { themes } from "@/lib/themes";
import { toast } from "sonner";
import { Palette, Loader2, Check, Save, Eye, X } from "lucide-react";
import PhonePreview from "@/Components/dashboard/PhonePreview";

// --- Sub-component: Skeleton Loader ---
function AppearanceSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto p-4 animate-pulse" aria-hidden="true">
      <div className="flex-1 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-slate-200 rounded-full" />
              <div className="h-6 w-32 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
      <div className="hidden lg:block sticky top-10 h-fit">
        <div className="flex flex-col items-center">
          <div className="h-7 w-32 bg-slate-900 rounded-full mb-6 opacity-20" />
          <div className="w-[320px] h-[640px] bg-slate-200 rounded-[3rem] border-8 border-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function AppearancePage() {
  const [profile, setProfile] = useState(null);
  const [previewTheme, setPreviewTheme] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false); // Mobile Preview State

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await getProfile();
        if (isMounted && data) {
          setProfile(data);
          setPreviewTheme(data.theme || "minimal"); 
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const handleSaveTheme = async () => {
    setSaving(true);
    const result = await updateTheme(previewTheme);
    
    if (result.success) {
      setProfile({ ...profile, theme: previewTheme });
      toast.success("Theme updated successfully!");
    } else {
      toast.error("Failed to save theme");
    }
    setSaving(false);
  };

  if (loading) return <AppearanceSkeleton />;

  const currentSavedTheme = profile?.theme || "minimal";
  const hasUnsavedChanges = previewTheme !== currentSavedTheme;

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto p-4 pb-32 lg:pb-4">
      {/* pb-32 on mobile prevents content from being hidden behind sticky bar */}

      {/* LEFT: Theme Selector */}
      <main className="flex-1 space-y-8">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 h-10">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Palette size={20} aria-hidden="true" />
              <h2>Pick a Theme</h2>
            </div>
            
            {/* Desktop Save Button */}
            <div className="w-fit hidden lg:block">
               {hasUnsavedChanges && (
                <button 
                  type="button"
                  onClick={handleSaveTheme}
                  disabled={saving}
                  aria-busy={saving}
                  className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-right-4 hover:bg-slate-800 transition-colors shadow-lg"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Apply Theme
                </button>
              )}
            </div>
          </div>

          <div 
            className="grid grid-cols-2 gap-4" 
            role="radiogroup" 
            aria-label="Theme Selection"
          >
            {themes.map((theme) => {
              const isSelected = previewTheme === theme.id;
              const isCurrentSaved = currentSavedTheme === theme.id;
              
              return (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => setPreviewTheme(theme.id)}
                  aria-checked={isSelected}
                  role="radio"
                  aria-label={`Select ${theme.label} theme`}
                  className={`
                    relative group p-4 rounded-xl border-2 text-left transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${isSelected ? "border-blue-600 bg-blue-50/50" : "border-slate-100 hover:border-slate-300"}
                  `}
                >
                  <div className={`h-20 rounded-lg mb-3 ${theme.bg} border border-slate-200/50 relative overflow-hidden shadow-inner`}>
                    <div className="absolute inset-x-3 top-3 h-2 bg-current opacity-20 rounded-full" />
                    <div className="absolute inset-x-3 top-7 h-2 bg-current opacity-20 rounded-full" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                      {theme.label}
                    </span>
                    {isCurrentSaved && (
                      <div className="text-green-500" title="Current Live Theme">
                        <Check size={16} aria-label="Current Live Theme" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* RIGHT: Desktop Live Preview */}
      <aside className="hidden lg:block sticky top-10 h-fit" aria-label="Theme Preview">
         <div className="flex flex-col items-center">
            <div 
              className="px-4 py-1.5 bg-slate-900 rounded-full mb-6 shadow-sm flex items-center gap-2"
              role="status"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {hasUnsavedChanges ? "Previewing Mode" : "Live Profile"}
              </span>
              {hasUnsavedChanges && (
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" aria-hidden="true" />
              )}
            </div>
            
            {/* Desktop: Pass previewTheme to show changes instantly */}
            <PhonePreview profile={{ ...profile, theme: previewTheme }} />
         </div>
      </aside>

      {/* --- MOBILE INTERACTION LAYER --- */}

      {/* 1. Mobile Preview Modal */}
      {showMobilePreview && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 lg:hidden animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm flex flex-col items-center">
             <button
                type="button"
                onClick={() => setShowMobilePreview(false)}
                className="absolute -top-14 right-0 text-white flex items-center gap-2 font-bold px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close preview"
              >
                <X size={20} /> Close
              </button>
              
              <div className="scale-90 origin-top">
                {/* Mobile: Pass previewTheme here too! */}
                <PhonePreview profile={{ ...profile, theme: previewTheme }} />
              </div>
          </div>
        </div>
      )}

      {/* 2. Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowMobilePreview(true)}
            className="flex-1 mb-5 py-3.5 bg-slate-100 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Eye size={20} />
            Preview
          </button>
          
          <button
            type="button"
            onClick={handleSaveTheme}
            disabled={saving || !hasUnsavedChanges}
            className="flex-[2] mb-5 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform disabled:opacity-70 disabled:bg-slate-700"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? "Saving..." : "Apply Theme"}
          </button>
        </div>
      </div>
    </div>
  );
}