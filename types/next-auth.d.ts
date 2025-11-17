import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extendemos el User de NextAuth para agregar el campo role
   */
  interface User {
    id: string;
    role: string;
  }

  /**
   * Extendemos la Session de NextAuth
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extendemos el JWT token
   */
  interface JWT {
    userId: string;
    role: string;
  }
}