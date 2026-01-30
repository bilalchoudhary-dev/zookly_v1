"use client";
import { useState } from "react";
import Navbar from "@/Components/home/Navbar";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {  Zap, Shield, BarChart3, Palette } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const { data: session } = useSession(); 
  const router = useRouter();

  const handleClaim = (e) => {
    e.preventDefault();
    
    // Clean the username input (remove spaces/linkhub.com) just in case
    const cleanUsername = username.replace("linkhub.com/", "").trim();
    
    // Create the destination URL with the user's choice attached
    const targetUrl = `/onboarding?desiredUsername=${encodeURIComponent(cleanUsername)}`;

    if (session) {
      // 1. If already logged in, go straight there
      router.push(targetUrl);
    } else {
      // 2. If not logged in, trigger Sign In but force the callback to our target
      signIn(undefined, { callbackUrl: targetUrl });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
          <Zap size={14} /> v1.0 is Live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          Everything you are. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            In one simple link.
          </span>
        </h1>
        
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 50M+ people using LinkHub for their link in bio. One link to help you share everything you create, curate and sell.
        </p>

        {/* Claim Form */}
        <form onSubmit={handleClaim} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-16">
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">linkhub.com/</span>
            <input 
              value={username}
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              className="w-full py-4 pl-32 pr-6 rounded-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:outline-none font-bold text-lg transition-all"
            />
          </div>
          <button className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
            Claim my Link
          </button>
        </form>

        {/* Mockup Image Placeholder */}
        <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
          <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
          <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
          <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
             <img src="https://i.pinimg.com/736x/8b/4c/96/8b4c96d5a2d04a6210f76326e7039a06.jpg" className="w-full h-full object-cover" alt="App Mockup" />
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
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
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-slate-400 text-sm font-medium">
        <p>© 2024 LinkHub. Built for creators.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}