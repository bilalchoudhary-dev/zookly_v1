"use server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function deleteAccount() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  try {
    await User.findOneAndDelete({ email: session.user.email });
    return { success: true };
  } catch (e) {
    return { error: "Failed to delete account" };
  }
}