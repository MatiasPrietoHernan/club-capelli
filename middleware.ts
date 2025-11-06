import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;
    if (token && (token as any).role === "admin" && pathname === "/login") {
      return NextResponse.redirect(new URL("/admin/products", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: { 
      authorized: ({ token }) => !!token && (token as any).role === "admin" 
    },
  }
);

export const config = { 
  matcher: ["/admin/:path*", "/api/admin/:path*"] 
};