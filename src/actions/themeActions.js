"use server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function updateTheme(themeId) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  try {
    await User.findOneAndUpdate(
      { email: session.user.email },
      { theme: themeId }
    );
    return { success: true };
  } catch (e) {
    return { error: "Failed to update theme" };
  }
}