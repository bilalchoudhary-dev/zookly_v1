import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
    const isOnboardingPage = req.nextUrl.pathname === "/onboarding";

    // 1. If trying to reach dashboard without a username -> Redirect to onboarding
    if (isDashboardPage && isAuth && !token.username) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // 2. If trying to reach onboarding but ALREADY has a username -> Redirect to dashboard
    if (isOnboardingPage && isAuth && token.username) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only runs if user is logged in
    },
  }
);

// We only want this to run on admin/dashboard routes
export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};