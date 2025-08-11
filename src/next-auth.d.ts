import { DefaultSession } from "next-auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: "admin" | "teacher" | "user";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "teacher" | "user";
  }
}
