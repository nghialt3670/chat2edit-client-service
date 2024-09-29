import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, GitHub],
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;

      const endpoint = "http://localhost:4000/api/sign-in";
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
