"use server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
// CHANGED: Import from the new separated lib file
import { authOptions } from "@/lib/auth";

// CHANGED: Expanded reserved list to prevent system route hijacking
const RESERVED_NAMES = [
  "admin", "api", "dashboard", "login", "register", "settings",
  "favicon", "robots", "sitemap", "manifest", "oauth", "public", "json", "xml", "png"
];

export async function claimUsername(formData) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) return { error: "Not authenticated" };

  const rawUsername = formData.get("username");
  
  // CHANGED: Runtime type check to prevent crash on .toLowerCase() if input is null/file
  if (typeof rawUsername !== "string") {
    return { error: "Invalid input format" };
  }

  const username = rawUsername.toLowerCase().trim();

  // 1. Basic Validation
  if (username.length < 3) return { error: "Username too short" };
  if (!/^[a-z0-9_]+$/.test(username)) return { error: "Invalid characters" };
  if (RESERVED_NAMES.includes(username)) return { error: "Username is reserved" };

  try {
    // CHANGED: Replaced race-condition prone "check-then-update" with atomic operation
    const result = await User.findOneAndUpdate(
      { email: session.user.email },
      { username: username },
      // new: true returns the updated document, runValidators ensures schema rules apply
      { new: true, runValidators: true } 
    );
    
    // Edge case: If user wasn't found (shouldn't happen if auth is working)
    if (!result) return { error: "User profile not found" };

    return { success: true, username: result.username };
  } catch (error) {
    // CHANGED: Catch duplicate key error (11000) for race conditions
    if (error.code === 11000) {
      return { error: "Username already taken" };
    }
    console.error("Claim Error:", error);
    return { error: "An unexpected error occurred" };
  }
}