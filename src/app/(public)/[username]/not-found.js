import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">User Not Found</h2>
      <p className="text-slate-500 mb-8 text-center max-w-xs">
        The LinkHub profile you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all">
        Create Your Own Hub
      </Link>
    </div>
  );
}