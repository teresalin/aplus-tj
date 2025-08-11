import "server-only";
import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const isTeacher = user.email.endsWith("@your-school.org");
        token.role = token.role ?? (isTeacher ? "teacher" : "user");
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = (token as any).role ?? "user";
      return session;
    },
  },
};
