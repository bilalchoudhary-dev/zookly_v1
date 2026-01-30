"use client";
import { useState, useEffect } from "react";
import { saveProfile, getProfile, deleteLink } from "@/actions/linkActions";
import { ProfileSchema } from "@/lib/schemas";
import { getIconByUrl } from "@/lib/icons";
import { Plus, Save, UserCircle, Loader2, Copy } from "lucide-react";
import PhonePreview from "@/Components/dashboard/PhonePreview";
import SortableLink from "@/Components/dashboard/SortableLink";
import { toast } from "sonner";

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

  // 1. Load Data on Refresh
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProfile();
        if (data) setProfile(data);
      } catch (err) {
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const copyToClipboard = () => {
  const url = `${window.location.origin}/${profile.username}`;
  navigator.clipboard.writeText(url);
  toast.success("Copied to clipboard!", {
    description: "Ready to paste in your Instagram bio.",
  });
};

  // 2. Sensors for Drag & Drop (Prevents accidental drags when clicking inputs)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const addLink = () => {
    setProfile({
      ...profile,
      links: [
        ...profile.links,
        {
          tempId: Date.now().toString(),
          title: "",
          url: "",
          icon: "Link",
        },
      ],
    });
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...profile.links];
    newLinks[index][field] = value;
    if (field === "url") newLinks[index].icon = getIconByUrl(value);
    setProfile({ ...profile, links: newLinks });
  };

  const removeLink = async (index, id) => {
    // 1. Optimistic Update: Remove from UI immediately so it feels fast
    const linkToRemove = profile.links[index];
    const newLinks = profile.links.filter((_, i) => i !== index);

    setProfile((prev) => ({
      ...prev,
      links: newLinks,
    }));

    // 2. Decide: Is this a saved link or a brand new draft?
    if (id && !id.includes("temp")) {
      // It's a real database item -> Delete from Server
      toast.promise(deleteLink(id), {
        loading: "Deleting...",
        success: "Link deleted permanently",
        error: (err) => {
          // If server fails, put it back!
          setProfile((prev) => ({
            ...prev,
            links: [...prev.links, linkToRemove],
          }));
          return "Failed to delete. Please try again.";
        },
      });
    } else {
      // It's just a draft -> No server call needed
      toast.success("Draft link removed");
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setProfile((prev) => {
      const oldIndex = prev.links.findIndex(
        (l) => (l._id || l.tempId) === active.id,
      );
      const newIndex = prev.links.findIndex(
        (l) => (l._id || l.tempId) === over.id,
      );
      return {
        ...prev,
        links: arrayMove(prev.links, oldIndex, newIndex),
      };
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

    const response = await saveProfile(profile);
    if (response.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(response.error || "Save failed");
    }
    setIsSaving(false);
  };

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto p-4">
      <div className="flex-1 space-y-10">
        {/* Profile Header */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <UserCircle size={20} />
            <h3>Profile Header</h3>
          </div>

          <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-xl">
            <img
              src={profile.image}
              className="w-16 h-16 rounded-full border border-white shadow-sm"
              alt="Avatar"
            />
            <div>
              <p className="font-bold text-slate-900 leading-none">
                @{profile.username}
              </p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                Your LinkHub Handle
              </p>
              <div className="flex gap-3 mt-4 sm:mt-0 relative z-10">
    <button 
      onClick={copyToClipboard}
      className="bg-white text-blue-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
    >
      <Copy size={16} /> Copy Link
    </button>
  </div>
            </div>
          </div>

          <div className="space-y-4">
            <input
              value={profile.displayName}
              onChange={(e) =>
                setProfile({ ...profile, displayName: e.target.value })
              }
              placeholder="Display Name"
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Bio..."
              className="w-full p-3 rounded-lg border border-slate-200 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </section>

        {/* Reorderable Links Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-800 text-lg">Your Links</h3>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full flex items-center gap-2 transition-all disabled:opacity-50 font-bold shadow-md"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={profile.links.map((l) => l._id || l.tempId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
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
            onClick={addLink}
            className="w-full py-5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all font-bold flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add New Link
          </button>
        </section>
      </div>

      {/* Preview */}
      <div className="hidden lg:block sticky top-10 h-fit">
        <div className="flex flex-col items-center">
          <div className="px-4 py-1.5 bg-slate-900 rounded-full mb-6 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              Live Preview
            </span>
          </div>
          <PhonePreview profile={profile} />
        </div>
      </div>
    </div>
  );
}
