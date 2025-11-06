import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/database";
import User from '@/schemas/user.schema'



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
       credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" }},
      async authorize(credentials:any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
         await connectDB();
         const user = await User.findOne({ email: credentials.email }).select("+passwordHash");
         const now = new Date();
        if (!user || (user.lockedUntil && user.lockedUntil > now)) return null;

        const ok = await bcrypt.compare((credentials.password || "") + (process.env.PASSWORD_PEPPER ?? ""), user.passwordHash);
        
         if (!ok) {
          const failed = (user?.failedLogins ?? 0) + 1;
          const update: any = { failedLogins: failed };
          if (failed >= 5) { update.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); update.failedLogins = 0; }
          await User.updateOne({ _id: user._id }, update);
          return null;
        }
        await User.updateOne({ _id: user._id }, { failedLogins: 0, lockedUntil: null });
        return { id: String(user._id), email: user.email, name: user.name, role: user.role };
      }
    })
  ],
session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) { if (user) { token.userId = (user as any).id; token.role = (user as any).role; } return token; },
    async session({ session, token }) { if (session.user) { (session.user as any).id = token.userId; (session.user as any).role = token.role; } return session; },
  },
    pages: { signIn: "/login" },
    secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    [process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token"]: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };