import "server-only";
import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { resolveRole } from "./roles";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      // Re-resolved on every refresh so allowlist changes apply without a re-login.
      token.role = resolveRole(token.email);
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role ?? "user";
      return session;
    },
  },
};
