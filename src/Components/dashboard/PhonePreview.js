import * as LucideIcons from "lucide-react";

export default function PhonePreview({ profile }) {
  return (
    <div className="relative w-[320px] h-[640px] border-[12px] border-slate-950 rounded-[3rem] shadow-2xl bg-white overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-20"></div>
      
      <div className="h-full overflow-y-auto p-8 flex flex-col items-center pt-16">
        {/* Real Profile Image */}
        <div className="w-24 h-24 bg-slate-100 rounded-full mb-4 border-2 border-slate-50 shadow-md overflow-hidden">
          {profile.image ? (
            <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-200" />
          )}
        </div>
        
        <h2 className="font-black text-xl text-slate-900">
          {profile.displayName || "Your Name"}
        </h2>
        
        <p className="text-blue-600 text-xs font-bold mt-1">
          @{profile.username || "username"}
        </p>

        <p className="text-slate-500 text-sm text-center mt-3 leading-relaxed px-2">
          {profile.bio || "No bio yet."}
        </p>

        {/* Links */}
        <div className="w-full mt-10 space-y-3">
          {profile.links.map((link, i) => {
            const Icon = LucideIcons[link.icon] || LucideIcons.Link;
            return (
              <a 
                key={i} 
                href={link.url}
                target="_blank"
                className="flex items-center gap-3 w-full p-4 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-lg"
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