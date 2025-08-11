import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "./prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const role = study.settings.admins.includes(user.email)
        ? "ADMIN"
        : "USER";
      if (session.user) {
        session.user.id = user.id;
        session.user.role = role;
      }
      return session;
    },
  },
};

export async function ensureAuthenticated(
  role?: "ADMIN" | "USER",
): Promise<Session> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  if (role && session.user?.role !== role) {
    redirect("/");
  }
  return session;
}
