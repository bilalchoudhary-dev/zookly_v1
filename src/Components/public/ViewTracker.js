"use client";
import { useEffect } from "react";
import { incrementView } from "@/actions/viewActions";
import { useSession } from "next-auth/react";

export default function ViewTracker({ profileUsername }) {
  const { data: session } = useSession();

  useEffect(() => {
    const isMyOwnProfile = session?.user?.username === profileUsername;
    
    if (!isMyOwnProfile) {
      const timer = setTimeout(() => {
        incrementView(profileUsername);
      }, 2000); 
      
      return () => clearTimeout(timer);
    }
  }, [session, profileUsername]);

  return null;
}