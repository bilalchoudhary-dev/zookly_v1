"use client";
import { useState, useEffect } from "react";
import { X, Copy, Check, Share2, Download } from "lucide-react";
import { toast } from "sonner";

export default function ShareModal({ isOpen, onClose, username }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  // Get the actual domain (e.g., localhost:3000 or myapp.com)
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!isOpen) return null;

  const profileUrl = `${origin}/${username}`;
  // This is the magic URL that Next.js generates automatically
  const ogImageUrl = `${origin}/api/og?username=${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(ogImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${username}-profile-card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded!");
    } catch (e) {
      toast.error("Could not download image");
    }
  };

  const shareData = {
    title: `Check out my Zookly!`,
    text: `Visit my profile: @${username}`,
    url: profileUrl,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-900">Share your Zookly</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* 1. The Social Card Preview */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Social Preview</p>
            <div className="relative aspect-[1.91/1] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
              {/* This img tag fetches the dynamic image we built earlier */}
              <img 
                src={ogImageUrl} 
                alt="Social Card" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Download Button */}
              <button
                onClick={handleDownload}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                title="Download Image"
              >
                <Download size={16} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center px-4">
              This card appears automatically when you share your link on WhatsApp, Twitter, or LinkedIn.
            </p>
          </div>

          {/* 2. Copy Link Section */}
          <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50">
             <div className="flex-1 min-w-0 px-2">
                <p className="text-xs text-slate-400 font-medium truncate">Your unique link</p>
                <p className="text-sm font-bold text-slate-900 truncate">{profileUrl}</p>
             </div>
             <button
               onClick={copyToClipboard}
               className={`p-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2
                 ${copied ? "bg-green-100 text-green-700" : "bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"}
               `}
             >
               {copied ? <Check size={18} /> : <Copy size={18} />}
               {copied ? "Copied" : "Copy"}
             </button>
          </div>

          {/* 3. Native Share Button (Mobile friendly) */}
          <button
            onClick={handleNativeShare}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 active:scale-[0.98]"
          >
            <Share2 size={20} />
            Share Profile
          </button>

        </div>
      </div>
    </div>
  );
}