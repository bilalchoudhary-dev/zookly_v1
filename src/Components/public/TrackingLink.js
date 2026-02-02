"use client";
import { trackClick } from "@/actions/clickActions";
import * as LucideIcons from "lucide-react";
import { useSession } from "next-auth/react"; 

export default function TrackingLink({ 
  link, 
  themeButtonClass, 
  profileUsername 
}) {
  const Icon = LucideIcons[link.icon] || LucideIcons.Link;
  const { data: session } = useSession();

  const handleClick = () => {
    if (session?.user?.username === profileUsername) {
      console.log("Analytics: Owner click ignored");
      return; 
    }

    trackClick(link._id);
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-200 ${themeButtonClass}`}
    >
      <Icon size={20} className="shrink-0" />
      <span className="flex-1 text-center font-bold pr-6 truncate">
        {link.title}
      </span>
    </a>
  );
}