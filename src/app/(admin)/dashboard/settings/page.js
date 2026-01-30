"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { deleteAccount } from "@/actions/userActions";
import { toast } from "sonner";
import { AlertTriangle, LogOut, X, Loader2, Trash2, UserCog } from "lucide-react";

// --- Sub-component: Skeleton Loader ---
function SettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-pulse" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 rounded" />
        <div className="h-4 w-64 bg-slate-200 rounded" />
      </div>
      <div className="h-40 bg-slate-200 rounded-2xl" />
      <div className="h-24 bg-slate-200 rounded-2xl" />
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Ref for focus management (Initialized to null for JS)
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      // Small timeout to allow render
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setConfirmText(""); // Reset text on close
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isModalOpen]);

  const handleDelete = async () => {
    // Trim whitespace to prevent frustration
    if (confirmText.trim() !== session?.user?.email) {
      toast.error("Email does not match.", {
        description: `Please type "${session?.user?.email}" exactly.`
      });
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteAccount();
      
      if (result.success) {
        toast.success("Account deleted. Goodbye.");
        setTimeout(() => signOut({ callbackUrl: '/' }), 1500);
      } else {
        toast.error("Deletion failed", { description: "Please try again later." });
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setIsDeleting(false);
    }
  };

  // 1. Handle Loading State
  if (status === "loading") {
    return <SettingsSkeleton />;
  }

  // 2. Handle Unauthenticated State
  if (!session) {
    return null; 
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 relative pb-20">
      
      <header>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UserCog className="text-slate-400" /> Settings
        </h2>
        <p className="text-slate-500">Manage your account preferences</p>
      </header>

      {/* DANGER ZONE CARD */}
      <section 
        className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm"
        aria-labelledby="danger-zone-title"
      >
        <div className="p-6 border-b border-red-100 bg-red-50/50">
          <h3 id="danger-zone-title" className="font-bold text-red-900 flex items-center gap-2">
            <AlertTriangle size={20} aria-hidden="true" /> Danger Zone
          </h3>
          <p className="text-red-700 text-sm mt-1">
            Actions here are irreversible. All your links and data will be lost.
          </p>
        </div>
        
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900">Delete Account</h4>
            <p className="text-sm text-slate-500">Permanently remove your profile and all data.</p>
          </div>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors shadow-sm w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Trash2 size={16} aria-hidden="true" />
            Delete Account
          </button>
        </div>
      </section>

      {/* Sign Out Section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm gap-4">
        <div>
           <h4 className="font-bold text-slate-900">Sign Out</h4>
           <p className="text-sm text-slate-500">Log out of your active session.</p>
        </div>
        <button 
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="border border-slate-300 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-2 text-slate-700 w-full sm:w-auto transition-colors"
        >
          <LogOut size={16} aria-hidden="true" /> Sign Out
        </button>
      </section>

      {/* --- THE CONFIRMATION MODAL --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h3 id="modal-title" className="font-bold text-lg text-slate-900">Final Confirmation</h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-900 text-sm font-medium flex gap-3">
                 <AlertTriangle className="shrink-0 text-red-600" size={20} aria-hidden="true" />
                 <div>
                    <p className="mb-1">This action cannot be undone.</p>
                    <p>This will permanently delete <b>@{session?.user?.name || "your account"}</b> and remove your data.</p>
                 </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-email" className="text-xs font-bold text-slate-500 uppercase block">
                    Type <span className="select-all text-slate-800 bg-slate-100 px-1 rounded">{session?.user?.email}</span> to confirm
                </label>
                <input 
                  ref={inputRef}
                  id="confirm-email"
                  type="email"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={session?.user?.email || "email@example.com"}
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-medium transition-all"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              
              <button 
                type="button"
                onClick={handleDelete}
                disabled={confirmText.trim() !== session?.user?.email || isDeleting}
                className={`
                   px-6 py-2.5 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all w-full sm:w-auto
                   ${confirmText.trim() === session?.user?.email 
                      ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20" 
                      : "bg-slate-300 cursor-not-allowed"}
                `}
              >
                {isDeleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                {isDeleting ? "Deleting..." : "Confirm Deletion"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}