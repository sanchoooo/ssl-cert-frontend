// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define which routes are PROTECTED
// This matches /dashboard and anything under it (e.g., /dashboard/settings)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/private(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. If the user is hitting a protected route, 
  // ensure they are authenticated. If not, redirect to login.
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files (images, favicon, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};