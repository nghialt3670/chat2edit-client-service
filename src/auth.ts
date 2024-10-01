import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";
import ENV from "./lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, GitHub],
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;

      const endpoint = `${ENV.BACKEND_API_BASE_URL}/api/sign-in`;
      const method = "POST";
      const headers = { "Content-Type": "application/json" };
      const body = JSON.stringify({ user, account });
      const response = await fetch(endpoint, { method, headers, body });

      if (!response.ok) return false;

      const { accountId } = await response.json();
      user.id = accountId;

      return true;
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
