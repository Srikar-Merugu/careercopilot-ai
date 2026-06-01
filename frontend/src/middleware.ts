import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define route groups
  const isDashboardRoute = path.startsWith("/dashboard");
  const isAuthRoute = path === "/login" || path === "/signup" || path === "/forgot-password" || path === "/reset-password";

  // Check for the authentication session cookie
  const sessionToken = request.cookies.get("cc_session")?.value;

  if (isDashboardRoute && !sessionToken) {
    // Unauthenticated request attempting to enter protected dashboard
    const loginUrl = new URL("/login", request.url);
    // Persist target redirect parameters
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Do NOT redirect auth routes here — client-side initializeSession() handles
  // redirecting authenticated users away from login/signup. This avoids a
  // redirect loop when the cookie exists but the JWT token is expired/invalid.

  return NextResponse.next();
}

// Map edge intercepts to only hit auth views and dashboard roots
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/forgot-password", "/reset-password"],
};
