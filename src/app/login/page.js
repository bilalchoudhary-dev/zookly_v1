"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Checking session...</p>;

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Welcome, {session.user.name}!</p>
        <img src={session.user.image} className="w-16 h-16 rounded-full my-4" />
        <button 
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Sign In to LinkHub</h1>
      <button 
        onClick={() => signIn("google")}
        className="bg-blue-600 text-white px-6 py-2 rounded w-64"
      >
        Sign in with Google
      </button>
      <button 
        onClick={() => signIn("github")}
        className="bg-gray-800 text-white px-6 py-2 rounded w-64"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}