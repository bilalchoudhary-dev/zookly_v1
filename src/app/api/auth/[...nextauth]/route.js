import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  
  // Performance: JWT strategy is stateless and faster than database sessions
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Security: prevent unnecessary scope requests
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  // UX/Lighthouse: Define custom pages to avoid unstyled NextAuth defaults
  // causing layout shifts or jarring user experiences.
  pages: {
    signIn: '/login',
    error: '/login', // Redirect errors back to styled login
    // newUser: '/onboarding' // Optional: Can auto-redirect new users
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. On initial sign-in, fetch username from DB
      if (user) {
        try {
          await dbConnect();
          
          // Optimization: Only fetch the 'username' field, not the whole document
          // This reduces memory usage and transfer time.
          const dbUser = await User.findOne({ email: user.email }).select("username").lean();
          
          token.username = dbUser?.username || null;
        } catch (error) {
          console.error("Auth DB Error:", error);
          // Resilience: Don't crash auth if DB fetch fails; allow login to proceed
          // The middleware or dashboard will handle the missing username redirection.
        }
      }
      
      // 2. Allow manual updates (used by Onboarding page)
      if (trigger === "update" && session?.username) {
        token.username = session.username;
      }

      return token;
    },

    async session({ session, token }) {
      // Pass lightweight data to the client
      if (token?.username) {
        session.user.username = token.username;
      }
      return session;
    },
  },

  // Reliability: Ensure secret is explicitly handled
  secret: process.env.NEXTAUTH_SECRET,
  
  // Debug: Turn off in production to reduce log noise
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };