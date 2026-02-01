import Link from "next/link";
import AuthButtons from "./AuthButtons"; // Import the Island

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-1">
          Zookly<span className="text-blue-600">.</span>
        </Link>

        <div>
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}