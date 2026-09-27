import type { DefaultSession } from "next-auth";
import "next-auth/jwt";
import type { AppRole } from "@/lib/auth/roles";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: AppRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppRole;
  }
}
