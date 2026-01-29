"use client";
import { useState, useEffect } from "react";
import { saveProfile, getProfile } from "@/actions/linkActions";
import { ProfileSchema } from "@/lib/schemas";
import { getIconByUrl } from "@/lib/icons";
import { Plus, Trash2, Save, UserCircle, Loader2 } from "lucide-react";
import PhonePreview from "@/Components/dashboard/PhonePreview";
import { toast, Toaster } from "sonner";

export default function DashboardPage() {
  const [profile, setProfile] = useState({
    displayName: "",
    bio: "",
    username: "",
    image: "",
    links: []
  });
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch data when the page reloads to keep it persistent
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProfile();
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const addLink = () => {
    setProfile({
      ...profile,
      links: [...profile.links, { title: "", url: "", icon: "Link" }]
    });
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...profile.links];
    newLinks[index][field] = value;
    
    // Automatically update icon based on the URL
    if (field === "url") {
      newLinks[index].icon = getIconByUrl(value);
    }
    
    setProfile({ ...profile, links: newLinks });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // 2. Validate with Zod before sending to server
    const result = ProfileSchema.safeParse(profile);
    
    if (!result.success) {
      toast.error("Invalid profile data. Please check your URLs.");
      setIsSaving(false);
      return;
    }

    // 3. Save to MongoDB via Server Action
    const response = await saveProfile(profile);
    
    if (response.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(response.error || "Save failed");
    }
    setIsSaving(false);
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto p-4">
      {/* Sonner Toaster for professional notifications */}

      <div className="flex-1 space-y-10">
        
        {/* Profile Header Section */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <UserCircle size={20} />
            <h3>Profile Header</h3>
          </div>

          <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-xl">
             <img src={profile.image} className="w-16 h-16 rounded-full border border-white shadow-sm" alt="Avatar" />
             <div>
                <p className="font-bold text-slate-900 leading-none">@{profile.username}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Your LinkHub Handle</p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Display Name</label>
              <input 
                value={profile.displayName}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                placeholder="Name as it appears on your profile"
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Bio</label>
              <textarea 
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="A short description about yourself..."
                className="w-full p-3 rounded-lg border border-slate-200 h-24 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-800 text-lg">Your Links</h3>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full flex items-center gap-2 transition-all disabled:opacity-50 shadow-md font-bold"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="space-y-3">
            {profile.links.map((link, index) => (
              <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-4 items-center shadow-sm group">
                <div className="flex-1 space-y-3">
                  <input 
                    value={link.title}
                    onChange={(e) => updateLink(index, 'title', e.target.value)}
                    placeholder="Link Title"
                    className="w-full font-bold text-slate-700 outline-none"
                  />
                  <input 
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    placeholder="URL (e.g., https://youtube.com/user)"
                    className="w-full text-sm text-slate-400 outline-none"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="flex flex-col items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                        <span className="text-[10px] font-black">{link.icon}</span>
                      </div>
                   </div>

                  <button 
                    onClick={() => {
                      const filtered = profile.links.filter((_, i) => i !== index);
                      setProfile({...profile, links: filtered});
                    }} 
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={addLink} 
            className="w-full py-5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all font-bold flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add New Link
          </button>
        </section>
      </div>

      {/* RIGHT: THE LIVE MOCKUP */}
      <div className="hidden lg:block sticky top-10 h-fit">
        <div className="flex flex-col items-center">
          <div className="px-4 py-1.5 bg-slate-900 rounded-full mb-6 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Preview</span>
          </div>
          <PhonePreview profile={profile} />
        </div>
      </div>
    </div>
  );
}