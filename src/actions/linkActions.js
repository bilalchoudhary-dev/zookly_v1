"use server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { ProfileSchema } from "@/lib/schemas"; // Import the same schema
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function saveProfile(profileData) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) return { error: "Unauthorized" };

  // 1. SERVER-SIDE VALIDATION (The Security Guard)
  const result = ProfileSchema.safeParse(profileData);
  
  if (!result.success) {
    // If someone bypasses the frontend, the server catches them here
    return { error: "Invalid data format. Nice try!" };
  }

  // 2. Extract validated data
  const { displayName, bio, links } = result.data;

  try {
    await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        name: displayName, 
        bio: bio,
        links: links 
      },
      { runValidators: true }
    );
    return { success: true };
  } catch (e) {
    return { error: "Database error occurred." };
  }
}

export async function getProfile() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) return null;

  // Transform DB fields to our state format
  return {
    displayName: user.name || "",
    bio: user.bio || "",
    username: user.username || "",
    image: user.image || "",
    theme: user.theme || "minimal",
    views: user.views || 0,
    links: user.links ? user.links.map(link => ({
      ...link,
      _id: link._id.toString(), // The magic fix
      title: link.title,
      url: link.url,
      icon: link.icon
    })) : []
  };
}

// ... existing imports

export async function deleteLink(linkId) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  try {
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $pull: { links: { _id: linkId } } } // The magic operator
    );
    return { success: true };
  } catch (e) {
    return { error: "Failed to delete link" };
  }
}