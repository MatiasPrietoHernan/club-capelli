import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/database";
import User from '@/schemas/user.schema';

interface UserDocument {
  _id: string;
  email: string;
  name: string;
  role: string;
  passwordHash: string;
  failedLogins?: number;
  lockedUntil?: Date | null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log(`⚠️  Missing credentials - ${new Date().toISOString()}`);
          return null;
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          }).select("+passwordHash") as UserDocument | null;

          const now = new Date();

          if (!user || (user.lockedUntil && user.lockedUntil > now)) {
            console.log(`🚫 Failed login attempt: ${credentials.email} - User not found or locked - ${new Date().toISOString()}`);
            return null;
          }

          const passwordWithPepper = credentials.password + (process.env.PASSWORD_PEPPER ?? "");
          const isValidPassword = await bcrypt.compare(passwordWithPepper, user.passwordHash);

          if (!isValidPassword) {
            const failed = (user.failedLogins ?? 0) + 1;
            const update: any = { failedLogins: failed };

            if (failed >= 5) {
              update.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
              update.failedLogins = 0;
              console.log(`🔒 User locked due to failed attempts: ${credentials.email} - ${new Date().toISOString()}`);
            } else {
              console.log(`❌ Failed login attempt ${failed}/5: ${credentials.email} - Wrong password - ${new Date().toISOString()}`);
            }

            await User.updateOne({ _id: user._id }, update);
            return null;
          }

          console.log(`✅ Successful login: ${user.email} (${user.role}) - ${new Date().toISOString()}`);
          await User.updateOne(
            { _id: user._id },
            { failedLogins: 0, lockedUntil: null }
          );
          return {
            id: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error(`💥 Auth error:`, error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
