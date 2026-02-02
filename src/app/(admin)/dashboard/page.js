"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic"; // 1. Import dynamic
import { saveProfile, getProfile, deleteLink } from "@/actions/linkActions";
import { ProfileSchema } from "@/lib/schemas";
import { getIconByUrl } from "@/lib/icons";
import { Save, UserCircle, Loader2, Share2, Eye, X, Camera } from "lucide-react";
import { toast } from "sonner";
import ShareModal from "@/Components/dashboard/ShareModal";
import LinksEditor from "@/Components/dashboard/LinksEditor"; // 2. Import the new component
import { uploadImage } from "@/actions/uploadActions";

const PhonePreview = dynamic(() => import("@/Components/dashboard/PhonePreview"), {
  ssr: false,
  loading: () => <div className="w-[300px] h-[600px] bg-slate-100 rounded-[3rem] animate-pulse" />
});

export default function DashboardPage() {
  const [profile, setProfile] = useState({
    displayName: "",
    bio: "",
    username: "",
    image: "",
    links: [],
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    getProfile()
      .then((data) => {
        if (isMounted && data) setProfile(data);
      })
      .catch(() => toast.error("Failed to load"))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);


  const handleLinkUpdate = (index, field, value) => {
    const newLinks = [...profile.links];
    newLinks[index][field] = value;
    if (field === "url") newLinks[index].icon = getIconByUrl(value);
    setProfile((prev) => ({ ...prev, links: newLinks }));
  };

  const handleLinkRemove = (index, id) => {
    const linkToRemove = profile.links[index];
    const newLinks = profile.links.filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, links: newLinks }));

    if (id && !id.includes("temp")) {
      toast.promise(deleteLink(id), {
        loading: "Deleting...",
        success: "Link deleted",
        error: () => {
          setProfile((prev) => ({ ...prev, links: [...prev.links, linkToRemove] }));
          return "Failed to delete.";
        },
      });
    }
  };

  const handleLinkAdd = () => {
    setProfile((prev) => ({
      ...prev,
      links: [...prev.links, { tempId: Date.now().toString(), title: "", url: "", icon: "Link" }],
    }));
  };

  const handleLinksReorder = (newLinks) => {
    setProfile((prev) => ({ ...prev, links: newLinks }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = ProfileSchema.safeParse(profile);
    if (!result.success) {
      toast.error("Invalid data");
      setIsSaving(false);
      return;
    }
    const response = await saveProfile(profile);
    if (response.success) toast.success("Saved! your profile is updated.");
    else toast.error("Failed to save: " + response.error);
    setIsSaving(false);
  };

  

 const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Size Check (Limit client side to 5MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setIsUploading(true);

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 3. Send to Server Action
      const result = await uploadImage(formData);

      if (result.success) {
        setProfile((prev) => ({ ...prev, image: result.url }));
        toast.success("Image uploaded! Please save changes.");
      } else {
        toast.error("Upload failed. Try again.");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto p-4 pb-32 lg:pb-4">
      
      <main className="flex-1 space-y-10">
        
        {/* Profile Header Card */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-800 font-bold">
               <UserCircle size={20} />
               <h2>Profile Header</h2>
             </div>
             {/* Desktop Save Button */}
             <button
               onClick={handleSave}
               disabled={isSaving}
               className="hidden lg:flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold text-sm items-center gap-2 transition-all"
             >
               {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
               Save
             </button>
          </div>

          <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-xl">
            {/* --- AVATAR UPLOAD SECTION --- */}
            <div 
              className="relative w-16 h-16 rounded-full border border-white shadow-sm shrink-0 cursor-pointer group"
              onClick={() => !isUploading && fileInputRef.current?.click()} 
            >
              {/* Spinner */}
              {isUploading && (
                <div className="absolute inset-0 bg-slate-100/80 flex items-center justify-center z-20 rounded-full">
                  <Loader2 className="animate-spin text-slate-400" size={20} />
                </div>
              )}

              {/* The Image */}
              <div className="relative w-full h-full rounded-full overflow-hidden">
                {profile.image ? (
                  <Image src={profile.image} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200" />
                )}
              </div>

              
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-slate-100 z-10">
                <div className="bg-slate-100 rounded-full p-1 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Camera size={12} />
                </div>
              </div>

              
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading} 
            />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => {
                    // Force lowercase and remove special chars
                    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "");
                    setProfile({ ...profile, username: clean });
                  }}
                  className="w-full bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded-lg py-1 pl-7 pr-3 font-bold text-slate-900 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-slate-500 font-semibold uppercase">
                Zookly Handle (Unique)
              </p>
            </div>
             <button onClick={() => setIsShareOpen(true)} className="bg-slate-900 text-white p-2 rounded-lg">
               <Share2 size={16} />
             </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
              <input
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Tell your story..."
              />
            </div>
          </div>
        </section>

        {/* Links Editor (Now Clean & Isolated) */}
        <LinksEditor 
          links={profile.links}
          setLinks={handleLinksReorder}
          onUpdate={handleLinkUpdate}
          onRemove={handleLinkRemove}
          onAdd={handleLinkAdd}
        />

      </main>

      <aside className="hidden lg:block sticky top-10 h-fit w-[350px]">
        <div className="px-4 py-1.5 bg-slate-900 rounded-full mb-6 w-fit mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Preview</span>
        </div>
        <PhonePreview profile={profile} />
      </aside>

      {/* --- MOBILE PREVIEW MODAL --- */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 lg:hidden animate-in fade-in">
           <div className="relative w-full max-w-sm flex flex-col items-center">
              <button onClick={() => setShowMobilePreview(false)} className="absolute -top-14 right-0 text-white flex gap-2 font-bold px-4 py-2 bg-white/10 rounded-full">
                <X size={20} /> Close
              </button>
              <div className="scale-90 origin-top">
                <PhonePreview profile={profile} />
              </div>
           </div>
        </div>
      )}

      {/* --- MOBILE STICKY BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex gap-3">
          <button onClick={() => setShowMobilePreview(true)} className="flex-1 mb-5 py-3.5 bg-slate-100 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2">
            <Eye size={20} /> Preview
          </button>
          <button onClick={handleSave} disabled={isSaving} className="flex-[2] py-3.5 mb-5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} username={profile.username} />
    </div>
  );
}