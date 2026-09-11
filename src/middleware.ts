import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./lib/auth";

// Public paths that do not require authentication
const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/logout", "/api/auth/me"];

// Role-based access control map
const ROLE_ACCESS: Record<string, string[]> = {
  "DIR-12": ["/", "/forecast", "/legal", "/risk", "/chartering", "/scenarios", "/ai-logs"],
  "MGR-01": ["/", "/forecast", "/legal", "/chartering", "/scenarios"],
  "ANL-04": ["/forecast", "/risk", "/ai-logs"],
  "OPS-09": ["/"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Serve static assets, Next.js internals, and public paths without checking auth
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("favicon") ||
    pathname.includes(".svg") ||
    pathname.includes(".png") ||
    PUBLIC_PATHS.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // Get the session cookie
  const token = request.cookies.get("portflow_session")?.value;

  if (!token) {
    // No token, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify the JWT token
  const payload = await verifySessionToken(token);

  if (!payload || !payload.role) {
    // Invalid or expired token, redirect to login and clear cookie
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("portflow_session");
    return response;
  }

  // Enforce Role-Based Access Control (RBAC)
  const userRole = payload.role as string;
  const allowedPaths = ROLE_ACCESS[userRole] || [];

  // Check if the current pathname is allowed for this role
  // We allow exact matches or sub-routes (e.g., /chartering/new)
  const isAllowed = allowedPaths.some((allowedPath) => {
    if (allowedPath === "/") return pathname === "/";
    return pathname === allowedPath || pathname.startsWith(`${allowedPath}/`);
  });

  if (!isAllowed) {
    // Redirect unauthorized users to their highest-priority allowed page
    const fallbackPath = allowedPaths[0] || "/login";
    return NextResponse.redirect(new URL(fallbackPath, request.url));
  }

  // Session is valid and authorized, let them through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
