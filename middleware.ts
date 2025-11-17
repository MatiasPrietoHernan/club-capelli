import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    // 🔥 Ahora token.role está bien tipado
    console.log(`🔐 Access attempt - Role: ${token?.role}`);
    
    
    if (token?.role !== "admin") {
      console.log(`❌ Unauthorized access attempt by ${token?.role || "unknown"}`);
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Verificá que el token existe Y que el rol es admin
        return !!token && token.role === "admin";
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*"
  ],
};