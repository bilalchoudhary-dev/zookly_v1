"use client";
import React from "react";
import * as LucideIcons from "lucide-react";
import Image from "next/image";
import { getTheme } from "@/lib/themes";

export default function PhonePreview({ 
  profile = {}, 
  links = [] 
}) {
  const linksToRender = links.length > 0 ? links : (profile.links || []);

  const themeId = profile.theme || "minimal";
  const activeTheme = getTheme(themeId) || { 
    bg: "bg-white", 
    text: "text-slate-900", 
    button: "bg-slate-100 text-slate-900" 
  };

  return (
    <>
      {/* Scrollbar Hide Utility Style */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      <div 
        className={`
          relative mx-auto
          w-full max-w-[320px]
          aspect-[9/19] max-h-[640px]
          border-[8px] sm:border-[12px]
          border-slate-950 rounded-[2.5rem] sm:rounded-[3rem] 
          shadow-2xl overflow-hidden 
          ${activeTheme.bg} transition-colors duration-300
        `}
        aria-label={`Mobile preview for @${profile.username}`}
      >
        {/* Decorative Notch */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 sm:h-6 bg-slate-950 rounded-b-xl sm:rounded-b-2xl z-20 pointer-events-none" 
          aria-hidden="true"
        />
        
        {/* Scrollable Content Area with scrollbar hidden */}
        <div className="h-full overflow-y-auto scrollbar-hide p-6 sm:p-8 flex flex-col items-center pt-12 sm:pt-16">
          
          {/* Avatar */}
          <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 border-4 shadow-md overflow-hidden shrink-0 ${activeTheme.text === 'text-white' ? 'border-white/20' : 'border-black/10'}`}>
            {profile.image ? (
              <Image 
                src={profile.image} 
                alt="Avatar"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 200px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl">
                 {profile.username?.[0]?.toUpperCase() || <LucideIcons.User size={32} />}
              </div>
            )}
          </div>
          
          {/* Profile Info */}
          <h2 className={`font-black text-lg sm:text-xl text-center leading-tight break-words max-w-full ${activeTheme.text}`}>
            {profile.displayName || profile.username || "Your Name"}
          </h2>
          
          <p className={`text-xs sm:text-sm font-bold mt-1 opacity-60 truncate max-w-full ${activeTheme.text}`}>
            @{profile.username || "username"}
          </p>
          
          <p className={`text-xs sm:text-sm text-center mt-3 leading-relaxed opacity-80 whitespace-pre-wrap break-words w-full ${activeTheme.text}`}>
            {profile.bio || "Welcome to my LinkHub!"}
          </p>

          {/* Dynamic Links */}
          <div className="w-full mt-8 sm:mt-10 space-y-3 pb-8">
            {linksToRender.map((link, i) => {
              const IconComponent = LucideIcons[link.icon] ? LucideIcons[link.icon] : LucideIcons.Link;
              const safeHref = link.url && link.url.startsWith("http") ? link.url : "#";

              return (
                <a 
                  key={link._id || i}
                  href={safeHref}
                  onClick={(e) => e.preventDefault()}
                  className={`
                    flex items-center gap-3 w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-transform hover:scale-[1.02] cursor-default
                    ${activeTheme.button}
                  `}
                >
                  <IconComponent size={16} className="shrink-0" />
                  <span className="flex-1 text-center pr-6 truncate">
                    {link.title || "Untitled Link"}
                  </span>
                </a>
              );
            })}

            {linksToRender.length === 0 && (
               <div className={`text-center text-xs opacity-50 mt-4 ${activeTheme.text}`}>
                  No links added yet...
               </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}