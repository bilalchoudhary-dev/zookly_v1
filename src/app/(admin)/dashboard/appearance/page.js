"use client";
import { useState, useEffect } from "react";
import { getProfile } from "@/actions/linkActions";
import { updateTheme } from "@/actions/themeActions";
import { themes } from "@/lib/themes";
import { toast, Toaster } from "sonner";
import { Palette, Loader2, Check, Save } from "lucide-react";
import PhonePreview from "@/Components/dashboard/PhonePreview";

export default function AppearancePage() {
  const [profile, setProfile] = useState(null);
  const [previewTheme, setPreviewTheme] = useState(""); // Tracks what user is clicking
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getProfile();
      if (data) {
        setProfile(data);
        setPreviewTheme(data.theme || "minimal"); // Initialize preview with current theme
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSaveTheme = async () => {
    setSaving(true);
    
    // 1. Save to DB
    const result = await updateTheme(previewTheme);
    
    if (result.success) {
      // 2. Update local profile state to match the new saved theme
      setProfile({ ...profile, theme: previewTheme });
      toast.success("Theme updated successfully!");
    } else {
      toast.error("Failed to save theme");
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  // Is there a change that needs saving?
  const hasUnsavedChanges = previewTheme !== (profile?.theme || "minimal");

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto p-4">
      <Toaster position="bottom-right" richColors />

      {/* LEFT: Theme Selector */}
      <div className="flex-1 space-y-8">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Palette size={20} />
              <h3>Pick a Theme</h3>
            </div>
            
            {/* Conditional Save Button */}
            {hasUnsavedChanges && (
              <button 
                onClick={handleSaveTheme}
                disabled={saving}
                className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-right-4"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Apply Theme
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => {
              const isSelected = previewTheme === theme.id;
              const isCurrentSaved = (profile.theme || "minimal") === theme.id;
              
              return (
                <button
                  key={theme.id}
                  onClick={() => setPreviewTheme(theme.id)} // Just preview, don't save yet
                  className={`
                    relative group p-4 rounded-xl border-2 text-left transition-all duration-200
                    ${isSelected ? "border-blue-600 bg-blue-50/50" : "border-slate-100 hover:border-slate-300"}
                  `}
                >
                  <div className={`h-20 rounded-lg mb-3 ${theme.bg} border border-slate-200/50 relative overflow-hidden shadow-inner`}>
                    {/* Abstract preview shapes */}
                    <div className="absolute inset-x-3 top-3 h-2 bg-current opacity-20 rounded-full"></div>
                    <div className="absolute inset-x-3 top-7 h-2 bg-current opacity-20 rounded-full"></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                      {theme.label}
                    </span>
                    {/* Show a Checkmark if this is the CURRENT SAVED theme */}
                    {isCurrentSaved && <div className="text-green-500"><Check size={16} /></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="hidden lg:block sticky top-10 h-fit">
         <div className="flex flex-col items-center">
            <div className="px-4 py-1.5 bg-slate-900 rounded-full mb-6 shadow-sm flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {hasUnsavedChanges ? "Previewing Mode" : "Live Profile"}
              </span>
              {hasUnsavedChanges && <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>}
            </div>
            
            {/* CRITICAL: Pass the previewTheme, not the saved theme! */}
            <PhonePreview profile={{ ...profile, theme: previewTheme }} />
         </div>
      </div>
    </div>
  );
}