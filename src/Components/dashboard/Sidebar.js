"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Link as LinkIcon, Palette, BarChart3, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Links", path: "/dashboard", icon: LinkIcon },
  { name: "Appearance", path: "/dashboard/appearance", icon: Palette },
  { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight">LinkHub<span className="text-blue-600">.</span></h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}