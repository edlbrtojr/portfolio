import { NextRequest, NextResponse } from "next/server";

// This middleware ensures that the site defaults to Portuguese
// without changing the URL structure
export function middleware(request: NextRequest) {
  // Get the language preference cookie if it exists
  const language = request.cookies.get("language")?.value;

  // For the first visit (when there's no language cookie yet),
  // we ensure the site loads in Portuguese
  if (!language) {
    // Create a response that sets the language cookie to Portuguese
    const response = NextResponse.next();
    response.cookies.set("language", "pt");
    return response;
  }

  // If URL has /pt or /en prefix, redirect to remove it
  const pathname = request.nextUrl.pathname;
  if (pathname === "/pt" || pathname.startsWith("/pt/")) {
    return NextResponse.redirect(
      new URL(pathname.replace(/^\/pt\/?/, "/"), request.url)
    );
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    // For English paths, keep the language cookie but fix the URL
    const response = NextResponse.redirect(
      new URL(pathname.replace(/^\/en\/?/, "/"), request.url)
    );
    response.cookies.set("language", "en");
    return response;
  }

  // Otherwise, proceed normally
  return NextResponse.next();
}

// Run middleware on all paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
