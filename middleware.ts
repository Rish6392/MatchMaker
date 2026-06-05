import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define routes that require authentication
  const isProtectedRoute = path.startsWith("/dashboard");

  // Define routes that are public/auth related
  const isAuthRoute = path === "/login";

  // Get the token from cookies
  const token = request.cookies.get("token")?.value;

  // If the user is trying to access a protected route without a token,
  // redirect them to the login page.
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is trying to access the login page while already authenticated,
  // redirect them to the dashboard.
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
  ],
};
