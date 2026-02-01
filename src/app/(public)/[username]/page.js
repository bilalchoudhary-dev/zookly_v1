import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { notFound } from "next/navigation";
import Image from "next/image"; // Optimization: Replaces standard img
import { getTheme } from "@/lib/themes";
import TrackingLink from "@/Components/public/TrackingLink";
import React from "react";
import { Sparkles } from "lucide-react"; // Added for branding flair

// 1. Metadata: Read-only (Don't count views here to avoid bot inflation)
export async function generateMetadata({ params }) {
  const { username } = await params;
  await dbConnect();
  const user = await User.findOne({ username }).select("name bio image").lean();

  if (!user) return {};

  // 1. Define the BASE URL (Use your real domain in production)
  // In development, localhost works only for YOU, not for WhatsApp.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zookly.com"; 

  return {
    title: `${user.name} (@${username}) - Zookly`,
    description: user.bio,
    openGraph: {
      title: `${user.name} on Zookly`,
      description: user.bio,
      // 2. Point to your new API route
      images: [
        {
          url: `${baseUrl}/api/og?username=${username}&v2`, 
          width: 1200,
          height: 630,
          alt: `${user.name}'s Zookly Profile`,
        },
      ],
      type: "website",
    },
  };
}

export default async function PublicProfile({ params }) {
  const { username } = await params;
  await dbConnect();

  // 2. Page Load: Fetch AND Increment Views (Atomic operation)
  // This ensures we only count real page loads, not metadata crawlers
  const user = await User.findOneAndUpdate(
    { username },
    { $inc: { views: 1 } },
    { new: true } // Return the updated document
  ).lean();

  if (!user) {
    notFound();
  }

  // Get active theme
  const theme = getTheme(user.theme || "minimal");

  return (
    <div className={`min-h-screen w-full flex flex-col items-center py-12 sm:py-20 px-4 transition-colors duration-500 ${theme.bg} ${theme.text}`}>
      
      {/* Optional: Abstract background pattern if theme is 'minimal' (white) to reduce boredom */}
      {(!user.theme || user.theme === 'minimal') && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      )}

      <main className="relative z-10 w-full max-w-lg flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Profile Header */}
        <header className="flex flex-col items-center text-center mb-10 w-full">
          {/* Avatar with Ring & Shadow */}
          <div 
            className={`
              relative w-28 h-28 sm:w-32 sm:h-32 rounded-full mb-6 
              border-[6px] shadow-2xl overflow-hidden shrink-0
              transform transition-transform hover:scale-105 duration-300
              ${theme.text === "text-white" ? "border-white/20 shadow-black/20" : "border-white shadow-slate-200"}
            `}
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || username}
                fill
                priority // Critical for LCP Score
                className="object-cover"
                sizes="(max-width: 768px) 128px, 150px"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-4xl font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Typography Upgrade */}
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            {user.name}
          </h1>
          
          <p className="font-bold opacity-60 text-sm sm:text-base tracking-wide uppercase">
            @{user.username}
          </p>

          {user.bio && (
            <p className="mt-4 max-w-sm text-sm sm:text-base leading-relaxed opacity-80 whitespace-pre-wrap">
              {user.bio}
            </p>
          )}
        </header>

        {/* Links Section */}
        <section className="w-full space-y-4">
          {user.links?.length > 0 ? (
            user.links.map((link, index) => {
              // Serialize ID for client component
              const safeLink = {
                ...link,
                _id: link._id.toString(),
              };
              
              return (
                <div 
                  key={safeLink._id}
                  className="animate-in slide-in-from-bottom-4 fade-in fill-mode-backwards"
                  style={{ animationDelay: `${index * 50}ms` }} // Staggered animation
                >
                  <TrackingLink 
                    link={safeLink} 
                    themeButtonClass={theme.button} 
                  />
                </div>
              );
            })
          ) : (
             <div className="text-center opacity-50 py-10">
               <p>No links added yet.</p>
             </div>
          )}
        </section>

        {/* Branding Footer */}
        <footer className="mt-16 mb-8 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <Sparkles size={12} />
            Powered by Zookly
          </a>
        </footer>

      </main>
    </div>
  );
}