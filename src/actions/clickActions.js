"use server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function trackClick(linkId) {
  if (!linkId) return; 

  await dbConnect();

  try {
    await User.updateOne(
      { "links._id": linkId },
      { $inc: { "links.$.clicks": 1 } }
    );
  } catch (e) {
    console.error("Tracking error:", e);
  }
}