"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react"; // Import useSession
import { deleteAccount } from "@/actions/userActions";
import { toast } from "sonner";
import { AlertTriangle, LogOut, X, Loader2, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession(); // Get the logged-in user's email
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // 1. Validation: Does the typed email match the session email?
    if (confirmText !== session?.user?.email) {
      toast.error("Email does not match. Please type it exactly.");
      return;
    }

    setIsDeleting(true);

    // 2. Call Server Action
    const result = await deleteAccount();
    
    if (result.success) {
      toast.success("Account deleted. Redirecting...");
      setTimeout(() => signOut({ callbackUrl: '/' }), 2000);
    } else {
      toast.error("Error deleting account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 relative">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500">Manage your account preferences</p>
      </div>

      {/* DANGER ZONE CARD */}
      <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-red-100 bg-red-50/50">
          <h3 className="font-bold text-red-900 flex items-center gap-2">
            <AlertTriangle size={20} /> Danger Zone
          </h3>
          <p className="text-red-700 text-sm mt-1">
            Actions here are irreversible. All your links and data will be lost.
          </p>
        </div>
        
        <div className="p-6 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Delete Account</h4>
            <p className="text-sm text-slate-500">Permanently remove your profile.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} // Open the modal
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors shadow-sm"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Sign Out Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
        <div>
           <h4 className="font-bold text-slate-900">Sign Out</h4>
           <p className="text-sm text-slate-500">Log out of your session.</p>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="border border-slate-300 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* --- THE CONFIRMATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900">Final Confirmation</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-900 text-sm font-medium flex gap-3">
                 <AlertTriangle className="shrink-0" size={20} />
                 <p>This action cannot be undone. This will permanently delete your account <b>@{session?.user?.username}</b> and remove your data from our servers.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                   Type your email to confirm
                </label>
                <input 
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="myemail@domain.com"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-medium"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleDelete}
                disabled={confirmText !== session?.user?.email || isDeleting}
                className={`
                   px-6 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2 transition-all
                   ${confirmText === session?.user?.email 
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