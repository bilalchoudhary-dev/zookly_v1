import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. On initial sign-in, fetch username from DB
      if (user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        token.username = dbUser?.username || null;
      }
      
      // 2. Allow manual updates (we'll use this after they claim a name)
      if (trigger === "update" && session?.username) {
        token.username = session.username;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.username = token.username;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };