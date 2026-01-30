"use server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function trackClick(linkId) {
  await dbConnect();
  try {
    // Determine if linkId is an _id or a temporary ID (we only track real IDs)
    // We use the positional operator $inc to increment the specific link's clicks
    await User.updateOne(
      { "links._id": linkId },
      { $inc: { "links.$.clicks": 1 } }
    );
  } catch (e) {
    console.error("Tracking error:", e);
    // Fail silently. We don't want to block the user's navigation for a stat.
  }
}