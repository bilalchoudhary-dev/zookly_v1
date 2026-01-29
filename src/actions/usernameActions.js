"use server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const RESERVED_NAMES = ["admin", "api", "dashboard", "login", "register", "settings"];

export async function claimUsername(formData) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) return { error: "Not authenticated" };

  const username = formData.get("username").toLowerCase().trim();

  // 1. Basic Validation
  if (username.length < 3) return { error: "Username too short" };
  if (!/^[a-z0-9_]+$/.test(username)) return { error: "Invalid characters" };
  if (RESERVED_NAMES.includes(username)) return { error: "Username is reserved" };

  // 2. Check Database
  const existingUser = await User.findOne({ username });
  if (existingUser) return { error: "Username already taken" };

  // 3. Update User
  await User.findOneAndUpdate(
    { email: session.user.email },
    { username: username }
  );

  return { success: true, username };
}