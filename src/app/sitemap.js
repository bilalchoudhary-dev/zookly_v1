import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export default async function sitemap() {
  const baseUrl = "https://zookly.vercel.app"; 

  // 1. Get all users for dynamic routes
  await dbConnect();
  const users = await User.find({}).select("username updatedAt").lean();

  const userUrls = users.map((user) => ({
    url: `${baseUrl}/${user.username}`,
    lastModified: user.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 2. Static Routes
  const routes = ["", "/login", "/onboarding", "/dashboard"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  }));

  return [...routes, ...userUrls];
}