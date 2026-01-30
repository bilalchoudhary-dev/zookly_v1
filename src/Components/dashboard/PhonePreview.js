import * as LucideIcons from "lucide-react";
import { getTheme } from "@/lib/themes"; // Import helper

export default function PhonePreview({ profile }) {
  // Get the active theme object based on the ID string
  const activeTheme = getTheme(profile.theme || "minimal");

  return (
    <div className={`
      relative w-[320px] h-[640px] border-[12px] border-slate-950 rounded-[3rem] shadow-2xl overflow-hidden
      ${activeTheme.bg} /* Dynamic Background */
    `}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-20"></div>
      
      <div className="h-full overflow-y-auto p-8 flex flex-col items-center pt-16">
        
        {/* Avatar */}
        <div className={`w-24 h-24 rounded-full mb-4 border-4 shadow-md overflow-hidden ${activeTheme.text === 'text-white' ? 'border-white/20' : 'border-black/10'}`}>
          {profile.image ? (
            <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-200" />
          )}
        </div>
        
        {/* Text Colors Dynamic */}
        <h2 className={`font-black text-xl ${activeTheme.text}`}>
          {profile.displayName || "Your Name"}
        </h2>
        <p className={`text-sm font-bold mt-1 opacity-60 ${activeTheme.text}`}>
          @{profile.username}
        </p>
        <p className={`text-sm text-center mt-3 leading-relaxed opacity-80 ${activeTheme.text}`}>
          {profile.bio || "No bio yet."}
        </p>

        {/* Dynamic Buttons */}
        <div className="w-full mt-10 space-y-3">
          {profile.links.map((link, i) => {
            const Icon = LucideIcons[link.icon] || LucideIcons.Link;
            return (
              <a 
                key={i} 
                className={`
                  flex items-center gap-3 w-full p-4 rounded-2xl text-sm font-bold transition-transform hover:scale-[1.02]
                  ${activeTheme.button} /* Dynamic Button Styles */
                `}
              >
                <Icon size={18} />
                <span className="flex-1 text-center pr-6">{link.title || "Untitled"}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}