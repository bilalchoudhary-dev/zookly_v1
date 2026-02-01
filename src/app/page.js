"use client";
import { useState } from "react";
import Navbar from "@/Components/home/Navbar";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Zap, Shield, BarChart3, Palette, Layout, Facebook, Instagram, Linkedin } from "lucide-react";
import PhonePreview from "@/Components/dashboard/PhonePreview";

export default function Home() {
  const [username, setUsername] = useState("");
  const { data: session } = useSession(); 
  const router = useRouter();

  const handleClaim = (e) => {
    e.preventDefault();
    const cleanUsername = username.replace("Zookly.com/", "").trim();
    const targetUrl = `/onboarding?desiredUsername=${encodeURIComponent(cleanUsername)}`;

    if (session) {
      router.push(targetUrl);
    } else {
      signIn(undefined, { callbackUrl: targetUrl });
    }
  };

  const previewProfile = {
    username: session?.user?.username || "yourname",
    image: session?.user?.image || "", 
    bio: session?.user?.name 
       ? `Hi, I'm ${session.user.name}. Welcome to my Zookly!` 
       : "Digital Creator & Designer. Sharing my latest work and resources below.",
    theme: "air", 
  };

  const previewLinks = [
    { _id: "1", title: "My Portfolio", url: "#", icon: "Layout", clicks: 120 },
    { _id: "2", title: "Instagram", url: "#", icon: "Instagram", clicks: 85 },
    { _id: "3", title: "Latest YouTube Video", url: "#", icon: "Youtube", clicks: 230 },
    { _id: "4", title: "LinkedIn Profile", url: "#", icon: "Linkedin", clicks: 45 },
  ];

  return (
    // FIX: Added 'overflow-x-hidden' to prevent horizontal scrolling from decorative blobs
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT: Text Content */}
          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100">
              <Zap size={14} /> v1.0 is Live
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
              Everything you are. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                In one simple link.
              </span>
            </h1>
            
            <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Join 50M+ creators using Zookly. One link to help you share everything you create, curate, and sell.
            </p>

            <form onSubmit={handleClaim} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mx-auto md:mx-0 mb-12">
              <div className="relative w-full group">
                <label htmlFor="username-input" className="sr-only">Claim your username</label>
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none transition-colors group-focus-within:text-slate-600">
                  Zookly.com/
                </span>
                <input 
                  id="username-input"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  autoComplete="off"
                  className="w-full py-4 pl-[8.5rem] pr-6 rounded-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 focus:outline-none font-bold text-lg transition-all placeholder:text-slate-300 hover:border-slate-300"
                />
              </div>
              <button 
                type="submit"
                className="w-full sm:w-auto whitespace-nowrap bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
              >
                Claim Link
              </button>
            </form>
          </div>

          {/* RIGHT: Dynamic Phone Preview */}
          <div className="flex-1 w-full max-w-[400px] flex justify-center perspective-1000">
            <div className="relative transform md:rotate-y-[-12deg] md:rotate-x-[5deg] transition-all duration-500 hover:rotate-0">
               
               <div className="relative z-20">
                  <PhonePreview 
                    links={previewLinks} 
                    profile={previewProfile} 
                    theme={previewProfile.theme}
                  />
               </div>
               
               {/* Decorative blobs behind phone - These caused the overflow */}
               <div className="absolute top-10 -right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -z-10 animate-pulse" />
               <div className="absolute -bottom-10 -left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
            </div>
          </div>

        </section>

        {/* FEATURES GRID */}
        <section className="py-24 bg-slate-50 px-6 border-t border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-slate-900">Why creators love us</h2>
               <p className="text-slate-500 mt-4">Built for performance, designed for you.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Palette}
                title="Custom Themes"
                desc="Express your personality with our curated themes. From minimal to cyberpunk, find a look that fits your vibe."
              />
              <FeatureCard 
                icon={BarChart3}
                title="In-depth Analytics"
                desc="Track your audience with precision. See views, clicks, and CTR to understand what your followers love."
              />
              <FeatureCard 
                icon={Shield}
                title="Trusted & Secure"
                desc="Your data is safe with us. Built with industry-standard encryption and privacy-first architecture."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center bg-white border-t border-slate-100">
        <p className="text-slate-500 text-sm font-medium">© 2024 Zookly. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}