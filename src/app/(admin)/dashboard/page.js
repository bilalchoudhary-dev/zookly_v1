"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { saveProfile, getProfile, deleteLink } from "@/actions/linkActions";
import { ProfileSchema } from "@/lib/schemas";
import { getIconByUrl } from "@/lib/icons";
import { Plus, Save, UserCircle, Loader2, Copy, Eye, X } from "lucide-react";
import PhonePreview from "@/Components/dashboard/PhonePreview";
import SortableLink from "@/Components/dashboard/SortableLink";
import { toast } from "sonner";
import ShareModal from "@/Components/dashboard/ShareModal";
import { Share2 } from "lucide-react"; // Import Share icon

// Drag and Drop Imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// --- Sub-component: Skeleton Loader ---
function DashboardSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto p-4 animate-pulse" aria-hidden="true">
      <main className="flex-1 space-y-10">
        <div className="h-64 bg-slate-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 w-32 bg-slate-200 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </main>
      <aside className="hidden lg:block sticky top-10 h-fit">
        <div className="w-[300px] h-[600px] bg-slate-200 rounded-[3rem]" />
      </aside>
    </div>
  );
}

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

  // 1. Load Data on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getProfile();
        if (isMounted && data) setProfile(data);
      } catch (err) {
        toast.error("Failed to fetch profile data");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const copyToClipboard = async () => {
    try {
      const url = `${window.location.origin}/${profile.username}`;
      await navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  // Sensors for Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const addLink = () => {
    setProfile((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        { tempId: Date.now().toString(), title: "", url: "", icon: "Link" },
      ],
    }));
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...profile.links];
    newLinks[index][field] = value;
    if (field === "url") newLinks[index].icon = getIconByUrl(value);
    setProfile({ ...profile, links: newLinks });
  };

  const removeLink = async (index, id) => {
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
    } else {
      toast.success("Draft link removed");
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setProfile((prev) => {
      const oldIndex = prev.links.findIndex((l) => (l._id || l.tempId) === active.id);
      const newIndex = prev.links.findIndex((l) => (l._id || l.tempId) === over.id);
      return { ...prev, links: arrayMove(prev.links, oldIndex, newIndex) };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = ProfileSchema.safeParse(profile);
    if (!result.success) {
      toast.error("Invalid profile data. Check your URLs.");
      setIsSaving(false);
      return;
    }
    try {
      const response = await saveProfile(profile);
      if (response.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.error || "Save failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto p-4 pb-32 lg:pb-4">
      {/* pb-32 on mobile ensures the last input isn't hidden behind the sticky bottom bar 
      */}

      <main className="flex-1 space-y-10">
        {/* Profile Header */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <UserCircle size={20} aria-hidden="true" />
            <h2>Profile Header</h2>
          </div>

          <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-xl">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white shadow-sm shrink-0">
              {profile.image ? (
                <Image 
                  src={profile.image} 
                  alt={`${profile.username}'s avatar`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <UserCircle className="text-slate-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 leading-none truncate">@{profile.username}</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Your Zookly Handle</p>
            </div>
            {/* <div className="relative z-10">
              <button
                type="button"
                onClick={copyToClipboard}
                className="bg-white text-blue-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg border border-slate-100"
              >
                <Copy size={16} aria-hidden="true" /> 
                <span className="hidden sm:inline">Copy Link</span>
              </button>
            </div> */}
            <div className="flex gap-2">
  <button
    type="button"
    onClick={() => setIsShareOpen(true)}
    className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
  >
    <Share2 size={16} aria-hidden="true" />
    <span className="hidden sm:inline">Share</span>
  </button>
</div>

          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                placeholder="e.g. Acme Corp"
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-base sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell your audience about yourself..."
                className="w-full p-3 rounded-lg border border-slate-200 h-24 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-base sm:text-sm"
              />
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-800 text-lg">Your Links</h3>
            
            {/* Desktop-only Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="hidden lg:flex bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full items-center gap-2 transition-all disabled:opacity-70 font-bold shadow-md"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={profile.links.map((l) => l._id || l.tempId)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3" role="list">
                {profile.links.map((link, index) => (
                  <SortableLink
                    key={link._id || link.tempId}
                    id={link._id || link.tempId}
                    index={index}
                    link={link}
                    updateLink={updateLink}
                    removeLink={removeLink}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            type="button"
            onClick={addLink}
            className="w-full py-5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all font-bold flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={20} />
            Add New Link
          </button>
        </section>
      </main>

      {/* Desktop Preview (Sidebar) */}
      <aside className="hidden lg:block sticky top-10 h-fit" aria-label="Desktop Preview">
        <div className="flex flex-col items-center">
          <div className="px-4 py-1.5 bg-slate-900 rounded-full mb-6 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Preview</span>
          </div>
          <PhonePreview profile={profile} />
        </div>
      </aside>

      {/* --- MOBILE INTERACTION LAYER --- */}

      {/* 1. Full Screen Preview Modal */}
      {showMobilePreview && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 lg:hidden animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm flex flex-col items-center">
             {/* Close Button */}
             <button
                type="button"
                onClick={() => setShowMobilePreview(false)}
                className="absolute -top-14 right-0 text-white flex items-center gap-2 font-bold px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close preview"
              >
                <X size={20} /> Close
              </button>
              
              {/* The Preview Component */}
              <div className="scale-90 origin-top">
                <PhonePreview profile={profile} />
              </div>
          </div>
        </div>
      )}

      {/* 2. Sticky Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowMobilePreview(true)}
            className="flex-1 py-3.5 bg-slate-100 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Eye size={20} />
            Preview
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

        <ShareModal 
  isOpen={isShareOpen} 
  onClose={() => setIsShareOpen(false)} 
  username={profile.username} 
/>


    </div>
  );
}