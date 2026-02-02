"use server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function incrementView(username) {
 try {
     await dbConnect();
     await User.updateOne(
       { username },
       { $inc: { views: 1 } }
     );
 } catch (error) {
    console.error("View increment error:", error);
 }
}