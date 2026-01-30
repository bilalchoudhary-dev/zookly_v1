export const themes = [
  {
    id: "minimal",
    label: "Minimal",
    bg: "bg-white",
    text: "text-slate-900",
    button: "bg-slate-900 text-white border-2 border-slate-900 shadow-lg hover:bg-white hover:text-slate-900",
  },
  {
    id: "dark",
    label: "Midnight",
    bg: "bg-slate-950",
    text: "text-white",
    button: "bg-slate-800 text-white border-2 border-slate-800 shadow-lg hover:bg-slate-900 hover:border-slate-600",
  },
  {
    id: "blue",
    label: "Ocean",
    bg: "bg-blue-50",
    text: "text-blue-900",
    button: "bg-blue-600 text-white shadow-blue-200/50 shadow-xl hover:bg-blue-700",
  },
  {
    id: "forest",
    label: "Forest",
    bg: "bg-emerald-900",
    text: "text-emerald-50",
    button: "bg-emerald-50 text-emerald-900 shadow-xl hover:bg-emerald-100",
  },
  {
    id: "professional",
    label: "LinkedIn Pro",
    bg: "bg-slate-100",
    text: "text-slate-900",
    button: "bg-blue-700 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-800",
  },
  // 4. Fun & Pop
  {
    id: "cotton_candy",
    label: "Cotton Candy",
    bg: "bg-gradient-to-br from-pink-50 to-blue-50",
    text: "text-slate-800",
    button: "bg-white text-pink-500 border-2 border-pink-100 shadow-sm hover:border-pink-300 hover:text-pink-600",
  },
  // 5. Gamer/Dev
  {
    id: "cyber",
    label: "Cyberpunk",
    bg: "bg-black",
    text: "text-green-400",
    button: "bg-black border border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)] hover:bg-green-900/20",
  },
  // 6. Influencer/Vibe
  {
    id: "sunset",
    label: "Sunset",
    bg: "bg-gradient-to-br from-orange-100 via-red-100 to-pink-100",
    text: "text-slate-900",
    button: "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30 border-none hover:opacity-90",
  },
  // 7. Premium/Luxury
  {
    id: "luxury",
    label: "Gold Luxury",
    bg: "bg-stone-950",
    text: "text-amber-50",
    button: "bg-stone-900 border border-amber-500/30 text-amber-500 hover:border-amber-400 hover:bg-stone-800",
  },
];

// Helper to get theme object safely
export function getTheme(id) {
  return themes.find(t => t.id === id) || themes[0];
}