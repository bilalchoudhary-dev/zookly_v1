import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { notFound } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { getTheme } from "@/lib/themes";

export async function generateMetadata({ params }) {
  const { username } = await params;
  await dbConnect();
  const user = await User.findOne({ username });
  
  return {
    title: `${user?.name || username} (@${username}) | LinkHub`,
    description: user?.bio || `Check out ${username}'s links on LinkHub`,
  };
}

export default async function PublicProfile({ params }) {
  const { username } = await params;
  await dbConnect();

  // Fetch the user data
  const user = await User.findOne({ username }).lean();

  if (!user) {
    notFound(); // Triggers the default Next.js 404 page
  }

  const theme = getTheme(user.theme || "minimal")

  return (
   <div className={`min-h-screen flex flex-col items-center py-16 px-4 ${theme.bg} ${theme.text}`}>
      
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className={`w-28 h-28 rounded-full overflow-hidden border-4 shadow-xl mb-4 ${theme.text === 'text-white' ? 'border-white/20' : 'border-white'}`}>
          <img src={user.image} alt={user.name} className="w-full h-full object-cover"/>
        </div>
        <h1 className="text-3xl font-black">{user.name}</h1>
        <p className="font-bold opacity-60 mt-1">@{user.username}</p>
        {user.bio && <p className="text-center mt-4 max-w-sm leading-relaxed opacity-90">{user.bio}</p>}
      </div>

      {/* Links */}
      <div className="w-full max-w-md space-y-4">
        {user.links.map((link, index) => {
          const Icon = LucideIcons[link.icon] || LucideIcons.Link;
          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-200 ${theme.button}`}
            >
              <Icon size={20} />
              <span className="flex-1 text-center font-bold pr-6">{link.title}</span>
            </a>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="mt-16 opacity-40 hover:opacity-100 transition-opacity">
        <a href="/" className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
           LinkHub
        </a>
      </footer>
    </div>
  );
}