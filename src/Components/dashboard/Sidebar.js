"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Link as LinkIcon,
  Palette,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Links", path: "/dashboard", icon: LinkIcon },
  { name: "Appearance", path: "/dashboard/appearance", icon: Palette },
  { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
  { name: "Public Home", path: "/", icon: Home },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes (user clicks a link)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* -------------------------------------------------------------------
          MOBILE VIEW: Header + Hamburger Drawer
          (Visible only on small screens < md)
      -------------------------------------------------------------------- */}

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-40">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Zookly<span className="text-blue-600">.</span>
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Spacer to prevent content overlap with fixed header */}
      <div className="md:hidden h-16" aria-hidden="true" />

      {/* Mobile Navigation Drawer (Overlay + Panel) */}
      <div
        className={`
          md:hidden fixed inset-0 z-50 flex
          transition-opacity duration-300
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Backdrop (Click to close) */}
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Sliding Panel */}
        <nav
          className={`
            relative bg-white w-3/4 max-w-xs h-full shadow-2xl flex flex-col
            transform transition-transform duration-300 ease-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 -mr-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      aria-current={isActive ? "page" : undefined}
                      className={`
                        flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      <item.icon
                        size={20}
                        className={
                          isActive ? "text-blue-600" : "text-slate-400"
                        }
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Drawer Footer (Sign Out) */}
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-3 py-3 text-base font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* -------------------------------------------------------------------
          DESKTOP VIEW: Vertical Sidebar
          (Visible only on medium screens and up >= md)
      -------------------------------------------------------------------- */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 bg-white flex-col h-screen sticky top-0">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Zookly<span className="text-blue-600">.</span>
          </h1>
        </div>

        <nav className="flex-1 px-4" aria-label="Desktop Navigation">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-blue-200
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    <item.icon size={18} aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-red-200"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
