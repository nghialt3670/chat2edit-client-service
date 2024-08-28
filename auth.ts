import Google from "next-auth/providers/google";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
});
