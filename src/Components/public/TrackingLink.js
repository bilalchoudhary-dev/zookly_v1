"use client";
import { trackClick } from "@/actions/clickActions";
import * as LucideIcons from "lucide-react";

export default function TrackingLink({ link, themeButtonClass }) {
  const Icon = LucideIcons[link.icon] || LucideIcons.Link;

  const handleClick = () => {
    // Fire the server action in the background
    // We don't await this because we want the user to go to the URL immediately
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
      <Icon size={20} />
      <span className="flex-1 text-center font-bold pr-6">{link.title}</span>
    </a>
  );
}